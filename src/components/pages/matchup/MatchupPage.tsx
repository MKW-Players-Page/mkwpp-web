import { useContext, useLayoutEffect, useRef, useState } from "react";
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
  return {
    playerData: await api.timetrialsPlayersRetrieve({ id }),
    scoreData: await api.timetrialsPlayersScoresList({ id: id, category, region: 1 }),
    statsData: await api.timetrialsPlayersStatsRetrieve({
      id: id,
      category,
      lapMode,
      region: 1,
    }),
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

  if (layoutTypeBig && !isLap) {
    return (
      <td
        rowSpan={2}
        className="force-bg"
        style={{ position: "sticky", left: 0, paddingRight: "5px" }}
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
      <td className="force-bg" style={{ position: "sticky", left: 0, paddingRight: "5px" }}>
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
  matchupData: ApiState<MatchupData>[];
  category: CategoryEnum;
  lapMode: LapModeEnum;
  differenceMode: boolean;
}

const MatchupPageTableRow = ({
  layoutTypeBig,
  lastId,
  id,
  nextId,
  matchupData,
  category,
  lapMode,
  differenceMode,
}: MatchupPageTableRowProps) => {
  const metadata = useContext(MetadataContext);

  const trackId = id >>> 1;
  const isFlap = id % 2 === 1;

  if ((lapMode === LapModeEnum.Course && isFlap) || (lapMode === LapModeEnum.Lap && !isFlap))
    return <></>;

  const orderedScores = matchupData
    .map((data) =>
      data.data?.scoreData.find((score) => score.isLap === isFlap && score.track === trackId),
    )
    .filter((r) => r !== undefined)
    .sort((a, b) => (a as Score).value - (b as Score).value) as Score[];

  if (orderedScores.length === 0) return <></>;

  const orderedScoreDelta = orderedScores[orderedScores.length - 1].value - orderedScores[0].value;

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
      {matchupData.map((data, idx, arr) => {
        const score = data.data?.scoreData.find(
          (score) => score.isLap === isFlap && score.track === trackId,
        );

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
              {arr.length === 2 && idx === 1 ? <></> : <td>-</td>}
            </>
          );

        const rgbValue =
          100 +
          Math.floor(
            (155 * (orderedScores[orderedScores.length - 1].value - score.value)) /
              orderedScoreDelta,
          );

        const deltaScoreFirst = score.value - orderedScores[0].value;
        const scoreIndex = orderedScores.findIndex((r) => r.value === score.value);

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
            {arr.length === 2 && idx === 1 ? (
              <></>
            ) : orderedScores.length < 2 ? (
              <td>-</td>
            ) : (
              <td
                style={{
                  color:
                    arr.length === 2
                      ? scoreIndex === 0
                        ? `rgb(100,255,100)`
                        : `rgb(255,100,100)`
                      : `rgb(255,${rgbValue},${rgbValue})`,
                }}
              >
                {formatTimeDiff(
                  arr.length === 2
                    ? scoreIndex === 0
                      ? -orderedScoreDelta
                      : orderedScoreDelta
                    : differenceMode
                      ? scoreIndex - 1 < 0
                        ? 0
                        : score.value - orderedScores[scoreIndex - 1].value
                      : deltaScoreFirst,
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
}: MatchupPageTableFooterRowProps) => {
  const orderedScores = matchupData
    .map((data) => data.data?.statsData[rankingTypeKey as keyof PlayerStats] as number)
    .sort((a, b) => a - b);

  if (matchupData[0].data?.statsData === undefined) return <></>;

  const orderedScoreDelta = orderedScores[orderedScores.length - 1] - orderedScores[0];

  return (
    <tr>
      <th className="force-bg" style={{ position: "sticky", left: 0, paddingRight: "5px" }}>
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
            {arr.length === 2 && idx === 1 ? (
              <></>
            ) : (
              <th
                style={{
                  color:
                    arr.length === 2
                      ? scoreIndex === 0
                        ? `rgb(100,255,100)`
                        : `rgb(255,100,100)`
                      : `rgb(255,${rgbValue},${rgbValue})`,
                }}
              >
                {displayFuncDiff(
                  arr.length === 2
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
    [category],
    "playerData",
    [],
    false,
  );

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

  const allTrackIds = (
    Array.from(
      new Set(
        matchupData
          .map((data) =>
            data.data?.scoreData.map(
              (scoreData) => (scoreData.track << 1) ^ ((scoreData.isLap ?? false) ? 1 : 0),
            ),
          )
          .flat(),
      ),
    ) as number[]
  ).sort((a, b) => a - b);
  const notOnlyOneLapMode =
    allTrackIds.map((r) => r % 2 === 1).includes(true) &&
    allTrackIds.map((r) => r % 2 === 1).includes(false);

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
        <Deferred isWaiting={metadata.isLoading || matchupDataIsLoading}>
          <div className="module" ref={tableModule} style={{ overflowX: "scroll" }}>
            <table style={{ whiteSpace: "nowrap" }}>
              <thead>
                <tr>
                  <>
                    <th
                      className="force-bg"
                      style={{ position: "sticky", left: 0, paddingRight: "5px" }}
                    />
                    {matchupData.map((playerData, idx, arr) => (
                      <>
                        <th
                          colSpan={
                            layoutTypeBig && lapMode === LapModeEnum.Overall && notOnlyOneLapMode
                              ? 2
                              : 1
                          }
                        >
                          <PlayerMention precalcPlayer={playerData.data?.playerData} />
                        </th>
                        {arr.length === 2 && idx === 1 ? <></> : <th />}
                      </>
                    ))}
                  </>
                </tr>
                <tr>
                  <th
                    className="force-bg"
                    style={{ position: "sticky", left: 0, paddingRight: "5px" }}
                  >
                    {translations.matchupPageTrackCol[lang]}
                  </th>
                  {matchupData.map((playerData, idx, arr) => (
                    <>
                      {layoutTypeBig && lapMode === LapModeEnum.Overall && notOnlyOneLapMode ? (
                        <>
                          <th>{translations.matchupPageCourseCol[lang]}</th>
                          <th>{translations.matchupPageLapCol[lang]}</th>
                          {arr.length === 2 && idx === 1 ? (
                            <></>
                          ) : (
                            <th>{translations.matchupPageDiffCol[lang]}</th>
                          )}
                        </>
                      ) : (
                        <>
                          <th>{translations.matchupPageTimeCol[lang]}</th>
                          {arr.length === 2 && idx === 1 ? (
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
                {allTrackIds.map((id, idx, arr) => (
                  <MatchupPageTableRow
                    layoutTypeBig={
                      layoutTypeBig && lapMode === LapModeEnum.Overall && notOnlyOneLapMode
                    }
                    lastId={arr[idx - 1]}
                    id={id}
                    nextId={arr[idx + 1]}
                    matchupData={matchupData}
                    category={category}
                    lapMode={lapMode}
                    differenceMode={differenceMode}
                  />
                ))}
              </tbody>
              <tfoot>
                <MatchupPageTableFooterRow
                  rankingType={translations.matchupPageTotalRow[lang]}
                  rankingTypeKey="totalScore"
                  matchupData={matchupData}
                  differenceMode={differenceMode}
                  layoutTypeBig={layoutTypeBig && lapMode === LapModeEnum.Overall}
                  displayFunc={formatTime}
                  displayFuncDiff={formatTimeDiff}
                />
                <MatchupPageTableFooterRow
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
                  rankingType={translations.matchupPagePRWRRow[lang]}
                  rankingTypeKey="totalRecordRatio"
                  matchupData={matchupData}
                  differenceMode={differenceMode}
                  layoutTypeBig={layoutTypeBig && lapMode === LapModeEnum.Overall}
                  displayFunc={(x) => ((x / 64) * 100).toFixed(4) + "%"}
                  displayFuncDiff={(x) => ((x / 64) * 100).toFixed(4) + "%"}
                />
                <tr>
                  <th
                    className="force-bg"
                    style={{ position: "sticky", left: 0, paddingRight: "5px" }}
                  >
                    {translations.matchupPageTallyRow[lang]}
                  </th>
                  <>
                    {matchupData
                      .map(
                        (data) =>
                          data.data?.scoreData
                            .map((score) => {
                              if (
                                lapMode === LapModeEnum.Lap
                                  ? score.isLap
                                  : lapMode === LapModeEnum.Course
                                    ? !score.isLap
                                    : false
                              )
                                return 0;
                              for (let player of matchupData) {
                                const comp = player.data?.scoreData.find(
                                  (s) => score.isLap === s.isLap && s.track === score.track,
                                );
                                if (comp !== undefined && comp.value < score.value) return 0;
                              }
                              return 1;
                            })
                            .reduce((acc: number, val: number) => acc + val, 0) ?? 0,
                      )
                      .map((score, idx, arr) => {
                        const orderedScores = [...arr].sort((a, b) => b - a);
                        const deltaScoreFirst = orderedScores[0] - score;
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
                            </th>
                            {arr.length === 2 && idx === 1 ? (
                              <></>
                            ) : (
                              <th
                                style={{
                                  color:
                                    arr.length === 2
                                      ? scoreIndex === 0
                                        ? `rgb(100,255,100)`
                                        : `rgb(255,100,100)`
                                      : `rgb(255,${rgbValue},${rgbValue})`,
                                }}
                              >
                                {arr.length === 2
                                  ? scoreIndex === 0
                                    ? "+" + -orderedScoreDelta
                                    : orderedScoreDelta
                                  : differenceMode
                                    ? scoreIndex - 1 < 0
                                      ? 0
                                      : score - orderedScores[scoreIndex - 1]
                                    : deltaScoreFirst}
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
