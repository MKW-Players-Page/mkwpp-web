import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { I18nContext, translate } from "../../../utils/i18n/i18n";
import { SettingsContext } from "../../../utils/Settings";
import { getTrackById, MetadataContext } from "../../../utils/Metadata";
import OverwriteColor from "../../widgets/OverwriteColor";
import { getCategorySiteHue } from "../../../utils/EnumUtils";
import { LapModeEnum, LapModeRadio } from "../../widgets/LapModeSelect";
import PlayerMention from "../../widgets/PlayerMention";
import { Pages, resolvePage } from "../Pages";
import Deferred from "../../widgets/Deferred";
import { useCategoryParam, useIdsParam, useLapModeParam } from "../../../utils/SearchParams";
import { ApiState, useApiArray } from "../../../hooks/ApiHook";
import api, { CategoryEnum, Score, PlayerStats, Player } from "../../../api";
import { formatTime, formatTimeDiff } from "../../../utils/Formatters";
import { CategoryRadio } from "../../widgets/CategorySelect";
import RadioButtons from "../../widgets/RadioButtons";
import ArrayTable, { ArrayTableCellData } from "../../widgets/Table";
import { SmallBigTrackFormat } from "../../widgets/SmallBigFormat";

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
  scoresSortedPersonalDeltas: (number | undefined)[][];
  scoresSortedPersonalDeltasToNext: (number | undefined)[][];
  scoresSortedForLoopRgbValue: (number | undefined)[][];
  totalTimeDeltas: number[];
  totalTimeDeltasToNext: number[];
  totalTimeRGB: number[];
  averageFinDeltas: number[];
  averageFinDeltasToNext: number[];
  averageFinRGB: number[];
  averageStandardDeltas: number[];
  averageStandardDeltasToNext: number[];
  averageStandardRGB: number[];
  prwrDeltas: number[];
  prwrDeltasToNext: number[];
  prwrRGB: number[];
  tallyWins: number[];
  tallyWinsDeltas: number[];
  tallyWinsDeltasToNext: number[];
  tallyWinsRGB: number[];
}

const elaboratePlayerData = (
  matchupData: ApiState<MatchupData>[],
  lapMode: LapModeEnum,
): ElaborateMatchupData => {
  for (const matchup of matchupData)
    if (matchup.isLoading || matchup.data === undefined)
      return {
        isLoading: true,
        allTrackIds: [],
        scoresSortedPersonalDeltas: [[]],
        scoresSortedPersonalDeltasToNext: [[]],
        scoresSortedForLoopRgbValue: [[]],
        totalTimeDeltas: [],
        totalTimeDeltasToNext: [],
        totalTimeRGB: [],
        averageFinDeltas: [],
        averageFinDeltasToNext: [],
        averageFinRGB: [],
        averageStandardDeltas: [],
        averageStandardDeltasToNext: [],
        averageStandardRGB: [],
        prwrDeltas: [],
        prwrDeltasToNext: [],
        prwrRGB: [],
        tallyWins: [],
        tallyWinsDeltas: [],
        tallyWinsDeltasToNext: [],
        tallyWinsRGB: [],
      };

  const tempAllTrackIds = new Set<number>();
  for (const player of matchupData)
    for (const score of player.data?.scoreData ?? []) {
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

  const scoresSortedPersonalDeltas = [];
  const scoresSortedPersonalDeltasToNext = [];
  const scoresSortedForLoopRgbValue = [];
  const tallyWins = matchupData.map(() => 0);
  for (const trackId of allTrackIds) {
    const tempArray = [];
    for (const player of matchupData)
      tempArray.push(
        player.data?.scoreData.find(
          (score) => score.isLap === (trackId % 2 === 1) && score.track === trackId >>> 1,
        ),
      );

    const thisSortedArray: number[] = tempArray
      .reduce((acc: number[], score) => {
        if (score === undefined) return acc;
        acc.push(score.value);
        return acc;
      }, [])
      .sort((a, b) => a - b);

    const tempRgbValues = new Array(matchupData.length);
    const tempScoresSortedPersonalDeltas = new Array(matchupData.length);
    const tempScoresSortedPersonalDeltasToNext = new Array(matchupData.length);
    for (let i = 0; i < tempArray.length; i++) {
      const score = tempArray[i];
      if (score === undefined) continue;

      const orderedScoreDelta = thisSortedArray[thisSortedArray.length - 1] - thisSortedArray[0];

      tempRgbValues[i] =
        orderedScoreDelta === 0
          ? 255
          : 100 +
            Math.floor(
              (155 * (thisSortedArray[thisSortedArray.length - 1] - score.value)) /
                orderedScoreDelta,
            );

      const thisSortedIndex = thisSortedArray.findIndex(
        (sortedScore) => sortedScore === score.value,
      );
      tempScoresSortedPersonalDeltas[i] = thisSortedArray[0] - score.value;
      tempScoresSortedPersonalDeltasToNext[i] =
        thisSortedIndex === 0 ? 0 : thisSortedArray[thisSortedIndex - 1] - score.value;

      if (thisSortedIndex === 0) tallyWins[i]++;
    }

    scoresSortedForLoopRgbValue.push(tempRgbValues);
    scoresSortedPersonalDeltas.push(tempScoresSortedPersonalDeltas);
    scoresSortedPersonalDeltasToNext.push(tempScoresSortedPersonalDeltasToNext);
  }

  const totalTimeSorted = matchupData
    .map((r) => r.data?.statsData.totalScore ?? 0)
    .sort((a, b) => a - b);
  const totalTimeDeltas = matchupData.map(
    (r) => (r.data?.statsData.totalScore ?? 0) - totalTimeSorted[0],
  );
  const totalTimeDeltasToNext = matchupData.map((r) => {
    const thisScore = r.data?.statsData.totalScore ?? 0;
    const index = totalTimeSorted.findIndex((score) => score === thisScore);
    return thisScore - totalTimeSorted[index < 2 ? 0 : index - 1];
  });
  const totalTimeRGB = totalTimeSorted.map((_, idx) => {
    const orderedScoreDelta = totalTimeSorted[totalTimeSorted.length - 1] - totalTimeSorted[0];
    if (orderedScoreDelta === 0) return 255;
    return 255 - Math.floor((totalTimeDeltas[idx] / orderedScoreDelta) * 155);
  });

  const scoresForFooter = lapMode === LapModeEnum.Overall ? 64 : 32;

  const averageFinSorted = matchupData
    .map((r) => (r.data?.statsData.totalRank ?? 0) / scoresForFooter)
    .sort((a, b) => a - b);
  const averageFinDeltas = matchupData.map(
    (r) => (r.data?.statsData.totalRank ?? 0) / scoresForFooter - averageFinSorted[0],
  );
  const averageFinDeltasToNext = matchupData.map((r) => {
    const thisScore = (r.data?.statsData.totalRank ?? 0) / scoresForFooter;
    const index = averageFinSorted.findIndex((score) => score === thisScore);
    return thisScore - averageFinSorted[index < 2 ? 0 : index - 1];
  });
  const averageFinRGB = averageFinSorted.map((_, idx) => {
    const orderedScoreDelta = averageFinSorted[averageFinSorted.length - 1] - averageFinSorted[0];
    if (orderedScoreDelta === 0) return 255;
    return 255 - Math.floor((averageFinDeltas[idx] / orderedScoreDelta) * 155);
  });

  const averageStandardSorted = matchupData
    .map((r) => (r.data?.statsData.totalStandard ?? 0) / scoresForFooter)
    .sort((a, b) => a - b);
  const averageStandardDeltas = matchupData.map(
    (r) => (r.data?.statsData.totalStandard ?? 0) / scoresForFooter - averageStandardSorted[0],
  );
  const averageStandardDeltasToNext = matchupData.map((r) => {
    const thisScore = (r.data?.statsData.totalStandard ?? 0) / scoresForFooter;
    const index = averageStandardSorted.findIndex((score) => score === thisScore);
    return thisScore - averageStandardSorted[index < 2 ? 0 : index - 1];
  });
  const averageStandardRGB = averageStandardSorted.map((_, idx) => {
    const orderedScoreDelta =
      averageStandardSorted[averageStandardSorted.length - 1] - averageStandardSorted[0];
    if (orderedScoreDelta === 0) return 255;
    return 255 - Math.floor((averageStandardDeltas[idx] / orderedScoreDelta) * 155);
  });

  const prwrSorted = matchupData
    .map((r) => ((r.data?.statsData.totalRecordRatio ?? 0) / scoresForFooter) * 100)
    .sort((a, b) => b - a);
  const prwrDeltas = matchupData.map(
    (r) => prwrSorted[0] - ((r.data?.statsData.totalRecordRatio ?? 0) / scoresForFooter) * 100,
  );
  const prwrDeltasToNext = matchupData.map((r) => {
    const thisScore = ((r.data?.statsData.totalRecordRatio ?? 0) / scoresForFooter) * 100;
    const index = prwrSorted.findIndex((score) => score === thisScore);
    return thisScore - prwrSorted[index < 2 ? 0 : index - 1];
  });
  const prwrRGB = prwrSorted.map((_, idx) => {
    const orderedScoreDelta = prwrSorted[0] - prwrSorted[prwrSorted.length - 1];
    if (orderedScoreDelta === 0) return 255;
    return 255 - Math.floor((prwrDeltas[idx] / orderedScoreDelta) * 155);
  });

  const tallyWinsSorted = tallyWins.slice().sort((a, b) => b - a);
  const tallyWinsDeltas = tallyWins.map((r) => r - tallyWinsSorted[0]);
  const tallyWinsDeltasToNext = tallyWins.map((r) => {
    const index = tallyWinsSorted.findIndex((score) => score === r);
    return r - tallyWinsSorted[index < 2 ? 0 : index - 1];
  });
  const tallyWinsRGB = tallyWinsSorted.map((_, idx) => {
    const orderedScoreDelta = tallyWinsSorted[tallyWinsSorted.length - 1] - tallyWinsSorted[0];
    if (orderedScoreDelta === 0) return 255;
    return 255 - Math.floor((tallyWinsDeltas[idx] / orderedScoreDelta) * 155);
  });

  return {
    isLoading: false,
    allTrackIds,
    scoresSortedForLoopRgbValue,
    scoresSortedPersonalDeltas,
    scoresSortedPersonalDeltasToNext,
    totalTimeDeltas,
    totalTimeDeltasToNext,
    totalTimeRGB,
    averageFinDeltas,
    averageFinDeltasToNext,
    averageFinRGB,
    averageStandardDeltas,
    averageStandardDeltasToNext,
    averageStandardRGB,
    prwrDeltas,
    prwrDeltasToNext,
    prwrRGB,
    tallyWins,
    tallyWinsDeltas,
    tallyWinsDeltasToNext,
    tallyWinsRGB,
  };
};

const MatchupPage = () => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, false);
  const [differenceMode, setDifferenceMode] = useState(false);
  const ids = useIdsParam(searchParams).ids;

  const { lang } = useContext(I18nContext);
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

  const scoreCountForFooter = lapMode === LapModeEnum.Overall ? 64 : 32;
  const headerRows: ArrayTableCellData[][] = [
    [{ content: null }],
    [{ content: translate("matchupPageTrackCol", lang), lockedCell: true }],
  ];

  const rows: ArrayTableCellData[][] = [];

  const footerRows: ArrayTableCellData[][] = [
    [{ content: translate("matchupPageTotalRow", lang), lockedCell: true }],
    [{ content: translate("matchupPageAFRow", lang), lockedCell: true }],
    [{ content: translate("matchupPageARRRow", lang), lockedCell: true }],
    [{ content: translate("matchupPagePRWRRow", lang), lockedCell: true }],
    [{ content: translate("matchupPageTallyRow", lang), lockedCell: true }],
  ];

  for (let idx = 0; idx < matchupData.length; idx++) {
    if (matchupDataIsLoading) break;
    if (elaboratedMatchupData.isLoading) break;
    const playerData = matchupData[idx].data as MatchupData;

    headerRows[0].push({ content: <PlayerMention precalcPlayer={playerData.playerData} /> });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall) {
      headerRows[0].push({ content: null, expandCell: [false, true] });
      headerRows[1].push(
        { content: translate("matchupPageCourseCol", lang) },
        { content: translate("matchupPageLapCol", lang) },
      );
    } else {
      headerRows[1].push({ content: translate("matchupPageTimeCol", lang) });
    }
    if (!isTwoPlayers || idx === 0) {
      headerRows[0].push({ content: null, expandCell: [false, true] });
      headerRows[1].push({ content: translate("matchupPageDiffCol", lang) });
    }

    let skipNum = 0;
    for (let rowIdx = 0; rowIdx < elaboratedMatchupData.allTrackIds.length; rowIdx++) {
      const trackId = elaboratedMatchupData.allTrackIds[rowIdx] >>> 1;
      const isLap = elaboratedMatchupData.allTrackIds[rowIdx] % 2 === 1;
      const track = getTrackById(metadata.tracks, trackId);

      if ((lapMode === LapModeEnum.Lap && !isLap) || (lapMode === LapModeEnum.Course && isLap)) {
        skipNum++;
        continue;
      }
      if (idx === 0) {
        rows.push([]);
        rows[rowIdx - skipNum].push({
          content: (
            <Link
              to={resolvePage(
                Pages.TrackChart,
                { id: trackId },
                {
                  cat: category !== CategoryEnum.NonShortcut ? category : null,
                  lap: lapMode !== LapModeEnum.Overall ? lapMode : null,
                },
              )}
            >
              <SmallBigTrackFormat
                track={track}
                smallClass="matchup-columns-s1"
                bigClass="matchup-columns-b1"
              />
            </Link>
          ),
          lockedCell: true,
          expandCell: [lapMode === LapModeEnum.Overall && isLap, false],
        });
      }

      const score = playerData.scoreData.find(
        (score) => score.track === trackId && score.isLap === isLap,
      );
      rows[rowIdx - skipNum].push({
        content:
          layoutTypeBig && isLap && lapMode !== LapModeEnum.Lap
            ? null
            : score
              ? formatTime(score.value)
              : "-",
        className: score !== undefined && score.category !== category ? "fallthrough" : "",
        style: {
          fontWeight:
            elaboratedMatchupData.scoresSortedPersonalDeltas[rowIdx][idx] === 0 ? "bold" : "",
        },
      });
      if (layoutTypeBig && lapMode === LapModeEnum.Overall)
        rows[rowIdx - skipNum].push({
          content: isLap ? (score ? formatTime(score.value) : "-") : null,
          className: score !== undefined && score.category !== category ? "fallthrough" : "",
          style: {
            fontWeight:
              elaboratedMatchupData.scoresSortedPersonalDeltas[rowIdx][idx] === 0 ? "bold" : "",
          },
        });

      const isFirst = elaboratedMatchupData.scoresSortedPersonalDeltas[rowIdx][idx] === 0;

      if (idx === 1 && isTwoPlayers) continue;
      rows[rowIdx - skipNum].push({
        content: score
          ? formatTimeDiff(
              isTwoPlayers
                ? isFirst
                  ? (elaboratedMatchupData.scoresSortedPersonalDeltas[rowIdx][1] ?? 0)
                  : -(elaboratedMatchupData.scoresSortedPersonalDeltas[rowIdx][0] ?? 0)
                : differenceMode
                  ? -(elaboratedMatchupData.scoresSortedPersonalDeltasToNext[rowIdx][idx] ?? 0)
                  : -(elaboratedMatchupData.scoresSortedPersonalDeltas[rowIdx][idx] ?? 0),
            )
          : "-",
        style: {
          color: isTwoPlayers
            ? isFirst
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${elaboratedMatchupData.scoresSortedForLoopRgbValue[rowIdx][idx]},${elaboratedMatchupData.scoresSortedForLoopRgbValue[rowIdx][idx]})`,
        },
      });
    }

    footerRows[0].push({
      content: formatTime(playerData.statsData.totalScore),
      style: {
        textDecoration: elaboratedMatchupData.totalTimeDeltas[idx] === 0 ? "underline" : "",
      },
    });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall)
      footerRows[0].push({ content: null, expandCell: [false, true] });
    if (!isTwoPlayers || idx === 0)
      footerRows[0].push({
        content: formatTimeDiff(
          isTwoPlayers
            ? elaboratedMatchupData.totalTimeDeltas[idx] === 0
              ? -elaboratedMatchupData.totalTimeDeltas[1]
              : elaboratedMatchupData.totalTimeDeltas[0]
            : differenceMode
              ? elaboratedMatchupData.totalTimeDeltasToNext[idx]
              : elaboratedMatchupData.totalTimeDeltas[idx],
        ),
        style: {
          color: isTwoPlayers
            ? elaboratedMatchupData.totalTimeDeltas[idx] === 0
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${elaboratedMatchupData.totalTimeRGB[idx]},${elaboratedMatchupData.totalTimeRGB[idx]})`,
        },
      });

    footerRows[1].push({
      content: playerData.statsData.totalRank / scoreCountForFooter,
      style: {
        textDecoration: elaboratedMatchupData.averageFinDeltas[idx] === 0 ? "underline" : "",
      },
    });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall)
      footerRows[1].push({ content: null, expandCell: [false, true] });
    if (!isTwoPlayers || idx === 0) {
      const content = isTwoPlayers
        ? elaboratedMatchupData.averageFinDeltas[idx] === 0
          ? -elaboratedMatchupData.averageFinDeltas[1]
          : elaboratedMatchupData.averageFinDeltas[0]
        : differenceMode
          ? elaboratedMatchupData.averageFinDeltasToNext[idx]
          : elaboratedMatchupData.averageFinDeltas[idx];
      footerRows[1].push({
        content: content > 0 ? "+" + content : content,

        style: {
          color: isTwoPlayers
            ? elaboratedMatchupData.averageFinDeltas[idx] === 0
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${elaboratedMatchupData.averageFinRGB[idx]},${elaboratedMatchupData.averageFinRGB[idx]})`,
        },
      });
    }

    footerRows[2].push({
      content: playerData.statsData.totalStandard / scoreCountForFooter,
      style: {
        textDecoration: elaboratedMatchupData.averageStandardDeltas[idx] === 0 ? "underline" : "",
      },
    });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall)
      footerRows[2].push({ content: null, expandCell: [false, true] });
    if (!isTwoPlayers || idx === 0) {
      const content = isTwoPlayers
        ? elaboratedMatchupData.averageStandardDeltas[idx] === 0
          ? -elaboratedMatchupData.averageStandardDeltas[1]
          : elaboratedMatchupData.averageStandardDeltas[0]
        : differenceMode
          ? elaboratedMatchupData.averageStandardDeltasToNext[idx]
          : elaboratedMatchupData.averageStandardDeltas[idx];
      footerRows[2].push({
        content: content > 0 ? "+" + content : content,

        style: {
          color: isTwoPlayers
            ? elaboratedMatchupData.averageStandardDeltas[idx] === 0
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${elaboratedMatchupData.averageStandardRGB[idx]},${elaboratedMatchupData.averageStandardRGB[idx]})`,
        },
      });
    }

    footerRows[3].push({
      content:
        ((playerData.statsData.totalRecordRatio / scoreCountForFooter) * 100).toFixed(4) + "%",
      style: {
        textDecoration: elaboratedMatchupData.prwrDeltas[idx] === 0 ? "underline" : "",
      },
    });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall)
      footerRows[3].push({ content: null, expandCell: [false, true] });
    if (!isTwoPlayers || idx === 0) {
      const content = isTwoPlayers
        ? elaboratedMatchupData.prwrDeltas[idx] === 0
          ? elaboratedMatchupData.prwrDeltas[1]
          : -elaboratedMatchupData.prwrDeltas[0]
        : differenceMode
          ? elaboratedMatchupData.prwrDeltasToNext[idx]
          : elaboratedMatchupData.prwrDeltas[idx];
      footerRows[3].push({
        content: (content > 0 ? "+" + content.toFixed(4) : content.toFixed(4)) + "%",

        style: {
          color: isTwoPlayers
            ? elaboratedMatchupData.prwrDeltas[idx] === 0
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${elaboratedMatchupData.prwrRGB[idx]},${elaboratedMatchupData.prwrRGB[idx]})`,
        },
      });
    }

    footerRows[4].push({
      content:
        elaboratedMatchupData.tallyWins[idx] +
        " " +
        translate(
          elaboratedMatchupData.tallyWins[idx] === 1
            ? "matchupPageTallyRowWinsSingular"
            : "matchupPageTallyRowWinsPlural",
          lang,
        ),
      style: {
        textDecoration: elaboratedMatchupData.tallyWinsDeltas[idx] === 0 ? "underline" : "",
      },
    });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall)
      footerRows[4].push({ content: null, expandCell: [false, true] });
    if (!isTwoPlayers || idx === 0) {
      const content = isTwoPlayers
        ? elaboratedMatchupData.tallyWinsDeltas[idx] === 0
          ? -elaboratedMatchupData.tallyWinsDeltas[1]
          : elaboratedMatchupData.tallyWinsDeltas[0]
        : differenceMode
          ? elaboratedMatchupData.tallyWinsDeltasToNext[idx]
          : elaboratedMatchupData.tallyWinsDeltas[idx];
      footerRows[4].push({
        content: content > 0 ? "+" + content : content,

        style: {
          color: isTwoPlayers
            ? elaboratedMatchupData.tallyWinsDeltas[idx] === 0
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${elaboratedMatchupData.tallyWinsRGB[idx]},${elaboratedMatchupData.tallyWinsRGB[idx]})`,
        },
      });
    }
  }

  return (
    <>
      {/* Redirect if any id is invalid or API fetch failed */}
      {ids.length < 2 && <Navigate to={resolvePage(Pages.MatchupHome)} />}
      <Link to={resolvePage(Pages.MatchupHome)}>{translate("genericBackButton", lang)}</Link>
      <h1>{translate("matchupPageHeading", lang)}</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row wrap">
          <CategoryRadio value={category} onChange={setCategory} />
          <LapModeRadio includeOverall value={lapMode} onChange={setLapMode} />
        </div>
        {isTwoPlayers ? (
          <></>
        ) : (
          <div className="module-row wrap">
            <RadioButtons
              state={differenceMode}
              setState={setDifferenceMode}
              data={[
                {
                  text: translate("matchupPageDiffColToFirst", lang),
                  value: false,
                },
                {
                  text: translate("matchupPageDiffColToNext", lang),
                  value: true,
                },
              ]}
            />
          </div>
        )}
        <Deferred
          isWaiting={metadata.isLoading || matchupDataIsLoading || elaboratedMatchupData.isLoading}
        >
          <div className="module" ref={tableModule}>
            <ArrayTable headerRows={headerRows} rows={rows} footerRows={footerRows} />
          </div>
        </Deferred>
      </OverwriteColor>
    </>
  );
};

export default MatchupPage;
