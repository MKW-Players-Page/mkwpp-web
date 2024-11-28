import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { I18nContext } from "../../../utils/i18n/i18n";
import { SettingsContext } from "../../../utils/Settings";
import { MetadataContext } from "../../../utils/Metadata";
import { CategorySelect } from "../../widgets";
import OverwriteColor from "../../widgets/OverwriteColor";
import { getCategorySiteHue, getTrackById } from "../../../utils/EnumUtils";
import LapModeSelect, { LapModeEnum } from "../../widgets/LapModeSelect";
import PlayerMention from "../../widgets/PlayerMention";
import { Pages, resolvePage } from "../Pages";
import Deferred from "../../widgets/Deferred";
import { useCategoryParam, useIdsParam, useLapModeParam } from "../../../utils/SearchParams";
import { ApiState, useApiArray } from "../../../hooks/ApiHook";
import api, { CategoryEnum, Score, PlayerStats, Player } from "../../../api";
import { formatTime, formatTimeDiff } from "../../../utils/Formatters";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "../../widgets/Dropdown";

interface MatchupData {
  playerData: Player;
  scoreData: Array<Score>;
  statsData: PlayerStats;
}

interface getPlayerDataParams {
  id: number;
  category: CategoryEnum;
  lapMode: LapModeEnum;
}

const getPlayerData = async ({
  id,
  category,
  lapMode,
}: getPlayerDataParams): Promise<MatchupData> => {
  const scoreDataRequest = api.timetrialsPlayersScoresList({ id: id, category, region: 1 });
  const playerDataRequest = api.timetrialsPlayersRetrieve({ id });
  const statsDataRequest = api.timetrialsPlayersStatsRetrieve({
    id: id,
    category,
    lapMode,
    region: 1,
  });
  return {
    playerData: await playerDataRequest,
    scoreData: await scoreDataRequest,
    statsData: await statsDataRequest,
  };
};

interface ElaborateMatchupData {
  isLoading: boolean;
  allTrackIds: number[];
  onlyOneLapType: boolean;
  scoresSortedByTime: number[][];
  scoresSortedByTimeDelta: number[];
  scoresSortedByTimeIndexes: (number | undefined)[][];
  scoresSortedPersonalDeltas: (number | undefined)[][];
  scoresSortedPersonalDeltasToNext: (number | undefined)[][];
  scoresSortedForLoopRgbValue: (number | undefined)[][];
  scoresSortedForLoop: (Score | undefined)[][];
  tallyWins: number[];
}

const elaboratePlayerData = (
  matchupData: ApiState<MatchupData>[],
  lapMode: LapModeEnum,
): ElaborateMatchupData => {
  for (const matchup of matchupData)
    if (matchup.isLoading || matchup.data === undefined)
      return {
        isLoading: true,
        onlyOneLapType: false,
        allTrackIds: [],
        scoresSortedByTime: [[]],
        scoresSortedByTimeIndexes: [[]],
        scoresSortedPersonalDeltas: [[]],
        scoresSortedPersonalDeltasToNext: [[]],
        scoresSortedForLoop: [[]],
        scoresSortedForLoopRgbValue: [[]],
        scoresSortedByTimeDelta: [],
        tallyWins: [],
      };

  let hasLapMode = false;
  let has3LapMode = false;
  const tempAllTrackIds = new Set<number>();
  for (const player of matchupData)
    for (const score of player.data?.scoreData ?? []) {
      hasLapMode = score.isLap ?? false;
      has3LapMode = !score.isLap;
      tempAllTrackIds.add(
        (score.track << 1) ^
          (lapMode === LapModeEnum.Overall
            ? (score.isLap ?? false)
              ? 1
              : 0
            : lapMode === LapModeEnum.Course
              ? 0
              : 1),
      );
    }
  const allTrackIds = Array.from(tempAllTrackIds).sort((a, b) => a - b);

  const scoresSortedByTime = [];
  const scoresSortedByTimeDelta = [];
  const scoresSortedByTimeIndexes = [];
  const scoresSortedPersonalDeltas = [];
  const scoresSortedPersonalDeltasToNext = [];
  const scoresSortedForLoop = [];
  const scoresSortedForLoopRgbValue = [];
  const tallyWins = matchupData.map((_) => 0);
  for (const trackId of allTrackIds) {
    const tempArray = [];
    for (const player of matchupData)
      tempArray.push(
        player.data?.scoreData.find(
          (score) => score.isLap === (trackId % 2 === 1) && score.track === trackId >>> 1,
        ),
      );

    scoresSortedForLoop.push(tempArray);

    const thisSortedArray = tempArray
      .filter((score) => score !== undefined)
      .map((score) => (score as Score).value)
      .sort((a, b) => a - b);
    const orderedScoreDelta = thisSortedArray[thisSortedArray.length - 1] - thisSortedArray[0];
    scoresSortedByTime.push(thisSortedArray);
    scoresSortedByTimeDelta.push(orderedScoreDelta);

    const tempRgbValues = [];
    const tempScoresSortedByTimeIndexes = [];
    const tempScoresSortedPersonalDeltas = [];
    const tempScoresSortedPersonalDeltasToNext = [];
    for (let i = 0; i < tempArray.length; i++) {
      const score = tempArray[i];
      if (score === undefined) {
        tempRgbValues.push(undefined);
        tempScoresSortedByTimeIndexes.push(undefined);
        tempScoresSortedPersonalDeltas.push(undefined);
        tempScoresSortedPersonalDeltasToNext.push(undefined);
        continue;
      }

      tempRgbValues.push(
        100 +
          Math.floor(
            (155 * (thisSortedArray[thisSortedArray.length - 1] - score.value)) / orderedScoreDelta,
          ),
      );
      const thisSortedIndex = thisSortedArray.findIndex(
        (sortedScore) => sortedScore === score.value,
      );
      tempScoresSortedByTimeIndexes.push(thisSortedIndex);
      tempScoresSortedPersonalDeltas.push(thisSortedArray[0] - score.value);
      tempScoresSortedPersonalDeltasToNext.push(
        thisSortedIndex === 0 ? 0 : thisSortedArray[thisSortedIndex - 1] - score.value,
      );

      if (thisSortedIndex === 0) tallyWins[i]++;
    }

    scoresSortedForLoopRgbValue.push(tempRgbValues);
    scoresSortedByTimeIndexes.push(tempScoresSortedByTimeIndexes);
    scoresSortedPersonalDeltas.push(tempScoresSortedPersonalDeltas);
    scoresSortedPersonalDeltasToNext.push(tempScoresSortedPersonalDeltasToNext);
  }

  return {
    isLoading: false,
    allTrackIds,
    onlyOneLapType: hasLapMode && has3LapMode,
    scoresSortedByTime,
    scoresSortedForLoop,
    scoresSortedByTimeDelta,
    scoresSortedForLoopRgbValue,
    scoresSortedByTimeIndexes,
    scoresSortedPersonalDeltas,
    scoresSortedPersonalDeltasToNext,
    tallyWins,
  };
};

interface MatchupPageTableRowTrackTDProps {
  layoutTypeBig: boolean;
  isLap: boolean;
  trackName: string;
  trackId: number;
  category: CategoryEnum;
  lapMode: LapModeEnum;
}

const MatchupPageTableRowTrackTD = ({
  layoutTypeBig,
  isLap,
  trackName,
  trackId,
  category,
  lapMode,
}: MatchupPageTableRowTrackTDProps) => {
  const { translations, lang } = useContext(I18nContext);
  const { settings } = useContext(SettingsContext);

  if (layoutTypeBig && !isLap) {
    return (
      <td
        rowSpan={2}
        className="force-bg"
        style={settings.lockTableCells ? { position: "sticky", left: 0, paddingRight: "5px" } : {}}
      >
        <Link
          to={resolvePage(
            Pages.TrackChart,
            { id: trackId },
            {
              cat: category !== CategoryEnum.NonShortcut ? category : null,
              lap: lapMode === LapModeEnum.Lap ? lapMode : null,
            },
          )}
        >
          {trackName}
        </Link>
      </td>
    );
  } else if (!layoutTypeBig) {
    return (
      <td
        className="force-bg"
        style={settings.lockTableCells ? { position: "sticky", left: 0, paddingRight: "5px" } : {}}
      >
        <Link
          to={resolvePage(
            Pages.TrackChart,
            { id: trackId },
            {
              cat: category !== CategoryEnum.NonShortcut ? category : null,
              lap: isLap ? LapModeEnum.Lap : null,
            },
          )}
        >
          {`${trackName} - ${isLap ? translations.constantLapModeLap[lang] : translations.constantLapModeCourse[lang]}`}
        </Link>
      </td>
    );
  }

  return <></>;
};

interface MatchupPageTableRowProps {
  layoutTypeBig: boolean;
  lastId: number;
  id: number;
  nextId: number;
  category: CategoryEnum;
  lapMode: LapModeEnum;
  differenceMode: boolean;
  orderedScores: number[];
  orderedScoresIndexes: (undefined | number)[];
  orderedScoresPersonalDeltas: (undefined | number)[];
  orderedScoresPersonalDeltasToNext: (undefined | number)[];
  orderedScoreDelta: number;
  scores: (undefined | Score)[];
  scoresRgbValues: (undefined | number)[];
  isTwoPlayers: boolean;
}

const MatchupPageTableRow = ({
  layoutTypeBig,
  lastId,
  id,
  nextId,
  category,
  lapMode,
  differenceMode,
  orderedScores,
  orderedScoresIndexes,
  orderedScoresPersonalDeltas,
  orderedScoresPersonalDeltasToNext,
  orderedScoreDelta,
  scores,
  scoresRgbValues,
  isTwoPlayers,
}: MatchupPageTableRowProps) => {
  const metadata = useContext(MetadataContext);
  const trackId = id >>> 1;
  const isFlap = id % 2 === 1;

  if (orderedScores.length === 0) return <></>;

  return (
    <tr>
      <MatchupPageTableRowTrackTD
        layoutTypeBig={
          layoutTypeBig && ((nextId === id + 1 && !isFlap) || (lastId === id - 1 && isFlap))
        }
        isLap={isFlap}
        trackName={getTrackById(metadata.tracks, trackId)?.name ?? "Err"}
        trackId={trackId}
        category={category}
        lapMode={lapMode}
      />
      {scores.map((score, idx, arr) => {
        if (score === undefined)
          return (
            <>
              {isFlap && layoutTypeBig ? (
                <>
                  <td />
                  <td>-</td>
                </>
              ) : (
                <td colSpan={layoutTypeBig ? 2 : 1}>-</td>
              )}
              {isTwoPlayers && idx === 1 ? <></> : <td>-</td>}
            </>
          );

        const scoreIndex = orderedScoresIndexes[idx] ?? 0;

        return (
          <>
            {isFlap && layoutTypeBig ? <td /> : <></>}
            <td
              style={{
                fontWeight: scoreIndex === 0 ? "bold" : "",
              }}
              colSpan={layoutTypeBig && !isFlap ? 2 : 1}
            >
              {formatTime(score.value)}
            </td>
            {isTwoPlayers && idx === 1 ? (
              <></>
            ) : orderedScores.length < 2 ? (
              <td>-</td>
            ) : (
              <td
                style={{
                  color: isTwoPlayers
                    ? scoreIndex === 0
                      ? `rgb(100,255,100)`
                      : `rgb(255,100,100)`
                    : `rgb(255,${scoresRgbValues[idx]},${scoresRgbValues[idx]})`,
                }}
              >
                {formatTimeDiff(
                  isTwoPlayers
                    ? scoreIndex === 0
                      ? -orderedScoreDelta
                      : orderedScoreDelta
                    : differenceMode
                      ? (orderedScoresPersonalDeltasToNext[idx] ?? 0)
                      : (orderedScoresPersonalDeltas[idx] ?? 0),
                )}
              </td>
            )}
          </>
        );
      })}
    </tr>
  );
};

interface MatchupPageTableFooterRowProps {
  layoutTypeBig: boolean;
  isTwoPlayers: boolean;
  rankingType: string;
  rankingTypeKey: string;
  matchupData: ApiState<MatchupData>[];
  differenceMode: boolean;
  displayFunc: (x: number) => string;
  displayFuncDiff: (x: number) => string;
}

const MatchupPageTableFooterRow = ({
  rankingType,
  rankingTypeKey,
  matchupData,
  differenceMode,
  displayFunc,
  displayFuncDiff,
  layoutTypeBig,
  isTwoPlayers,
}: MatchupPageTableFooterRowProps) => {
  const { settings } = useContext(SettingsContext);
  const orderedScores = matchupData
    .map((data) => data.data?.statsData[rankingTypeKey as keyof PlayerStats] as number)
    .sort((a, b) => a - b);

  if (matchupData[0].data?.statsData === undefined) return <></>;

  const orderedScoreDelta = orderedScores[orderedScores.length - 1] - orderedScores[0];

  return (
    <tr>
      <th
        className="force-bg"
        style={settings.lockTableCells ? { position: "sticky", left: 0, paddingRight: "5px" } : {}}
      >
        {rankingType}
      </th>
      {matchupData.map((data, idx, arr) => {
        const score = data.data?.statsData[rankingTypeKey as keyof PlayerStats] as number;

        const rgbValue =
          100 +
          Math.floor((155 * (orderedScores[orderedScores.length - 1] - score)) / orderedScoreDelta);

        const deltaScoreFirst = score - orderedScores[0];
        const scoreIndex = orderedScores.findIndex((r) => r === score);
        return (
          <>
            <th
              colSpan={layoutTypeBig ? 2 : 1}
              style={{
                textDecoration: scoreIndex === 0 ? "underline" : "",
              }}
            >
              {displayFunc(score)}
            </th>
            {isTwoPlayers && idx === 1 ? (
              <></>
            ) : (
              <th
                style={{
                  color: isTwoPlayers
                    ? scoreIndex === 0
                      ? `rgb(100,255,100)`
                      : `rgb(255,100,100)`
                    : `rgb(255,${rgbValue},${rgbValue})`,
                }}
              >
                {displayFuncDiff(
                  isTwoPlayers
                    ? scoreIndex === 0
                      ? -orderedScoreDelta
                      : orderedScoreDelta
                    : differenceMode
                      ? scoreIndex - 1 < 0
                        ? 0
                        : score - orderedScores[scoreIndex - 1]
                      : deltaScoreFirst,
                )}
              </th>
            )}
          </>
        );
      })}
    </tr>
  );
};

const MatchupPage = () => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, false);
  const [differenceMode, setDifferenceMode] = useState(false);
  const ids = useIdsParam(searchParams).ids;

  const { translations, lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  const { settings } = useContext(SettingsContext);

  const matchupData = useApiArray(
    (params: getPlayerDataParams) => getPlayerData(params),
    ids.length,
    ids.map((id) => {
      return {
        id,
        category,
        lapMode,
      };
    }),
    [category, lapMode],
    "playerData",
    [],
    false,
  );

  const isTwoPlayers = matchupData.length === 2;
  const matchupDataIsLoading = matchupData.map((r) => r.isLoading).includes(true);
  const siteHue = getCategorySiteHue(category, settings);

  const tableModule = useRef<HTMLDivElement | null>(null);
  const [layoutTypeBig, setLayoutTypeBig] = useState(true);
  const [layoutSwitchWidth, setLayoutSwitchWidth] = useState(0);
  useLayoutEffect(() => {
    if (tableModule.current === null) return;
    const element = tableModule.current;
    const updateSize = () => {
      const scrollDiff = element.scrollWidth - element.clientWidth;
      console.log(element);
      if (layoutTypeBig && scrollDiff > 0) {
        setLayoutTypeBig(false);
        setLayoutSwitchWidth(element.clientWidth);
      } else if (
        !layoutTypeBig &&
        scrollDiff === 0 &&
        element.clientWidth > layoutSwitchWidth + 50
      ) {
        setLayoutTypeBig(true);
        setLayoutSwitchWidth(0);
      }
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [
    tableModule,
    matchupDataIsLoading,
    setLayoutTypeBig,
    setLayoutSwitchWidth,
    layoutSwitchWidth,
    layoutTypeBig,
    ids,
  ]);

  const [elaboratedMatchupData, setElaboratedMatchupData] = useState(
    elaboratePlayerData(matchupData, lapMode),
  );
  useEffect(
    () => setElaboratedMatchupData(elaboratePlayerData(matchupData, lapMode)),
    [matchupData, lapMode],
  );

  return (
    <>
      {/* Redirect if any id is invalid or API fetch failed */}
      {ids.length < 2 && <Navigate to={resolvePage(Pages.MatchupHome)} />}
      <Link to={resolvePage(Pages.MatchupHome)}>&lt; Back</Link>
      <h1>{translations.matchupPageHeading[lang]}</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect value={category} onChange={setCategory} />
          <LapModeSelect includeOverall value={lapMode} onChange={setLapMode} />
        </div>
        {matchupData.length === 2 ? (
          <></>
        ) : (
          <div className="module-row">
            <Dropdown
              data={
                {
                  type: "Normal",
                  value: differenceMode,
                  valueSetter: setDifferenceMode,
                  defaultItemSet: 0,
                  data: [
                    {
                      id: 0,
                      children: [
                        {
                          type: "DropdownItemData",
                          element: {
                            text: translations.matchupPageDiffColToFirst[lang],
                            value: false,
                          },
                        } as DropdownItemSetDataChild,
                        {
                          type: "DropdownItemData",
                          element: {
                            text: translations.matchupPageDiffColToNext[lang],
                            value: true,
                          },
                        } as DropdownItemSetDataChild,
                      ],
                    },
                  ],
                } as DropdownData
              }
            />
          </div>
        )}
        <Deferred
          isWaiting={metadata.isLoading || matchupDataIsLoading || elaboratedMatchupData.isLoading}
        >
          <div className="module" ref={tableModule} style={{ overflowX: "scroll" }}>
            <table style={{ whiteSpace: "nowrap" }}>
              <thead>
                <tr>
                  <>
                    <th
                      className="force-bg"
                      style={
                        settings.lockTableCells
                          ? { position: "sticky", left: 0, paddingRight: "5px" }
                          : {}
                      }
                    />
                    {matchupData.map((playerData, idx, arr) => (
                      <>
                        <th
                          colSpan={
                            layoutTypeBig &&
                            lapMode === LapModeEnum.Overall &&
                            !elaboratedMatchupData.onlyOneLapType
                              ? 2
                              : 1
                          }
                        >
                          <PlayerMention precalcPlayer={playerData.data?.playerData} />
                        </th>
                        {isTwoPlayers && idx === 1 ? <></> : <th />}
                      </>
                    ))}
                  </>
                </tr>
                <tr>
                  <th
                    className="force-bg"
                    style={
                      settings.lockTableCells
                        ? { position: "sticky", left: 0, paddingRight: "5px" }
                        : {}
                    }
                  >
                    {translations.matchupPageTrackCol[lang]}
                  </th>
                  {matchupData.map((playerData, idx, arr) => (
                    <>
                      {layoutTypeBig &&
                      lapMode === LapModeEnum.Overall &&
                      !elaboratedMatchupData.onlyOneLapType ? (
                        <>
                          <th>{translations.matchupPageCourseCol[lang]}</th>
                          <th>{translations.matchupPageLapCol[lang]}</th>
                          {isTwoPlayers && idx === 1 ? (
                            <></>
                          ) : (
                            <th>{translations.matchupPageDiffCol[lang]}</th>
                          )}
                        </>
                      ) : (
                        <>
                          <th>{translations.matchupPageTimeCol[lang]}</th>
                          {isTwoPlayers && idx === 1 ? (
                            <></>
                          ) : (
                            <th>{translations.matchupPageDiffCol[lang]}</th>
                          )}
                        </>
                      )}
                    </>
                  ))}
                </tr>
              </thead>
              <tbody className="table-hover-rows">
                {elaboratedMatchupData.scoresSortedForLoop.map((scores, idx, arr) => (
                  <MatchupPageTableRow
                    layoutTypeBig={
                      layoutTypeBig &&
                      lapMode === LapModeEnum.Overall &&
                      !elaboratedMatchupData.onlyOneLapType
                    }
                    lastId={elaboratedMatchupData.allTrackIds[idx - 1]}
                    id={elaboratedMatchupData.allTrackIds[idx]}
                    nextId={elaboratedMatchupData.allTrackIds[idx + 1]}
                    category={category}
                    lapMode={lapMode}
                    differenceMode={differenceMode}
                    isTwoPlayers={isTwoPlayers}
                    orderedScores={elaboratedMatchupData.scoresSortedByTime[idx]}
                    orderedScoresIndexes={elaboratedMatchupData.scoresSortedByTimeIndexes[idx]}
                    orderedScoresPersonalDeltas={
                      elaboratedMatchupData.scoresSortedPersonalDeltas[idx]
                    }
                    orderedScoresPersonalDeltasToNext={
                      elaboratedMatchupData.scoresSortedPersonalDeltasToNext[idx]
                    }
                    orderedScoreDelta={elaboratedMatchupData.scoresSortedByTimeDelta[idx]}
                    scores={elaboratedMatchupData.scoresSortedForLoop[idx]}
                    scoresRgbValues={elaboratedMatchupData.scoresSortedForLoopRgbValue[idx]}
                  />
                ))}
              </tbody>
              <tfoot>
                <MatchupPageTableFooterRow
                  isTwoPlayers={isTwoPlayers}
                  rankingType={translations.matchupPageTotalRow[lang]}
                  rankingTypeKey="totalScore"
                  matchupData={matchupData}
                  differenceMode={differenceMode}
                  layoutTypeBig={layoutTypeBig && lapMode === LapModeEnum.Overall}
                  displayFunc={formatTime}
                  displayFuncDiff={formatTimeDiff}
                />
                <MatchupPageTableFooterRow
                  isTwoPlayers={isTwoPlayers}
                  rankingType={translations.matchupPageAFRow[lang]}
                  rankingTypeKey="totalRank"
                  matchupData={matchupData}
                  differenceMode={differenceMode}
                  layoutTypeBig={layoutTypeBig && lapMode === LapModeEnum.Overall}
                  displayFunc={(x) => (x / 64).toFixed(4)}
                  displayFuncDiff={(x) => {
                    const r = (x / 64).toFixed(4);
                    return x > 0 ? `+` + r : r;
                  }}
                />
                <MatchupPageTableFooterRow
                  isTwoPlayers={isTwoPlayers}
                  rankingType={translations.matchupPageARRRow[lang]}
                  rankingTypeKey="totalStandard"
                  matchupData={matchupData}
                  differenceMode={differenceMode}
                  layoutTypeBig={layoutTypeBig && lapMode === LapModeEnum.Overall}
                  displayFunc={(x) => (x / 64).toFixed(4)}
                  displayFuncDiff={(x) => {
                    const r = (x / 64).toFixed(4);
                    return x > 0 ? `+` + r : r;
                  }}
                />
                <MatchupPageTableFooterRow
                  isTwoPlayers={isTwoPlayers}
                  rankingType={translations.matchupPagePRWRRow[lang]}
                  rankingTypeKey="totalRecordRatio"
                  matchupData={matchupData}
                  differenceMode={differenceMode}
                  layoutTypeBig={layoutTypeBig && lapMode === LapModeEnum.Overall}
                  displayFunc={(x) => ((x / 64) * 100).toFixed(4) + "%"}
                  displayFuncDiff={(x) => {
                    const r = ((x / 64) * 100).toFixed(4) + "%";
                    return x > 0 ? `+` + r : r;
                  }}
                />
                <tr>
                  <th
                    className="force-bg"
                    style={
                      settings.lockTableCells
                        ? { position: "sticky", left: 0, paddingRight: "5px" }
                        : {}
                    }
                  >
                    {translations.matchupPageTallyRow[lang]}
                  </th>
                  <>
                    {elaboratedMatchupData.tallyWins.map((score, idx, arr) => {
                      const orderedScores = [...arr].sort((a, b) => b - a);
                      const scoreIndex = orderedScores.findIndex((r) => r === score);
                      const orderedScoreDelta =
                        orderedScores[orderedScores.length - 1] - orderedScores[0];
                      const rgbValue =
                        100 +
                        Math.floor(
                          (155 * (orderedScores[orderedScores.length - 1] - score)) /
                            orderedScoreDelta,
                        );
                      return (
                        <>
                          <th
                            colSpan={layoutTypeBig && lapMode === LapModeEnum.Overall ? 2 : 1}
                            style={{
                              textDecoration: scoreIndex === 0 ? "underline" : "",
                            }}
                          >
                            {score}
                            {` ${score === 1 ? translations.matchupPageTallyRowWinsSingular[lang] : translations.matchupPageTallyRowWinsPlural[lang]}`}
                          </th>
                          {isTwoPlayers && idx === 1 ? (
                            <></>
                          ) : (
                            <th
                              style={{
                                color: isTwoPlayers
                                  ? scoreIndex === 0
                                    ? `rgb(100,255,100)`
                                    : `rgb(255,100,100)`
                                  : `rgb(255,${rgbValue},${rgbValue})`,
                              }}
                            >
                              {isTwoPlayers
                                ? scoreIndex === 0
                                  ? "+" + -orderedScoreDelta
                                  : orderedScoreDelta
                                : differenceMode
                                  ? scoreIndex === 0
                                    ? 0
                                    : orderedScores[scoreIndex - 1] - score
                                  : score - orderedScores[0]}
                            </th>
                          )}
                        </>
                      );
                    })}
                  </>
                </tr>
              </tfoot>
            </table>
          </div>
        </Deferred>
      </OverwriteColor>
    </>
  );
};

export default MatchupPage;
