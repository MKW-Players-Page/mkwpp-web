import { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { CategoryEnum, PlayerStats } from "../../api";
import { useApi } from "../../hooks";
import { formatTime, formatTimeDiff } from "../../utils/Formatters";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { integerOr } from "../../utils/Numbers";
import { CategorySelect, FlagIcon } from "../widgets";
import OverwriteColor from "../widgets/OverwriteColor";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import LapModeSelect, { LapModeEnum } from "../widgets/LapModeSelect";
import PlayerSelectDropdown from "../widgets/PlayerSelectDropdown";
import {
  compareTwoPlayers,
  getPlayerData,
  MatchupData,
  MatchupScore,
} from "../../utils/MatchupDataCrunch";

interface PlayerSelectFieldProp {
  nth: number;
  setId: React.Dispatch<React.SetStateAction<number>>;
  id: number;
}
const PlayerSelectField = ({ nth, setId, id }: PlayerSelectFieldProp) => {
  return (
    <div className="module-row">
      <span
        style={
          {
            textDecorationColor: id === 0 ? "red" : "white",
            textDecorationLine: id === 0 ? "underline" : "none",
          } as React.CSSProperties
        }
      >
        Player&nbsp;{nth}
      </span>
      <PlayerSelectDropdown setId={setId} id={id} />
    </div>
  );
};

export const MatchupHomePage = () => {
  const idStates = [
    useState(0),
    useState(0),
    useState(0),
    useState(0),
    useState(0),
    useState(0),
    useState(0),
    useState(0),
  ];

  return (
    <>
      <h1>Matchup</h1>
      <div className="module">
        <div className="module-content">
          <PlayerSelectField nth={1} id={idStates[0][0]} setId={idStates[0][1]} />
          <PlayerSelectField nth={2} id={idStates[1][0]} setId={idStates[1][1]} />
          <Link
            className="submit-style"
            to={
              idStates[0][0] === 0 || idStates[1][0] === 0
                ? ""
                : resolvePage(Pages.Matchup, { id1: idStates[0][0], id2: idStates[1][0] })
            }
          >
            Compare
          </Link>
        </div>
      </div>
    </>
  );
};

/*  The code of this function is a little clunky, but it can easily be refactored.
    Mostly waiting on whether this should be used for Rivalries too. */
const MatchupPage = () => {
  const { id1: id1Str, id2: id2Str } = useParams();
  const id1 = Math.max(integerOr(id1Str, 0), 0);
  const id2 = Math.max(integerOr(id2Str, 0), 0);

  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.NonShortcut);
  const [lapMode, setLapMode] = useState<LapModeEnum>(LapModeEnum.Overall);

  const metadata = useContext(MetadataContext);

  const hasCourse = lapMode !== LapModeEnum.Lap;
  const hasLap = lapMode !== LapModeEnum.Course;
  const lapModes = [...(hasCourse ? [false] : []), ...(hasLap ? [true] : [])];
  const cellSpan = lapMode === LapModeEnum.Overall ? 2 : 1;

  const matchupData = [
    useApi(() => getPlayerData(id1, category, lapMode), [id1, category, lapMode]),
    useApi(() => getPlayerData(id2, category, lapMode), [id2, category, lapMode]),
  ];

  const isLoading = matchupData[0].isLoading || matchupData[1].isLoading;

  const newData = compareTwoPlayers(
    metadata.tracks ?? [],
    matchupData[0].data,
    matchupData[1].data,
  );
  if (!isLoading) {
    matchupData[0].data = (newData as MatchupData[])[0];
    matchupData[1].data = (newData as MatchupData[])[1];
  }
  const scoreClasses = (score?: MatchupScore) => {
    if (!score) {
      return "";
    }
    return (
      (score.category !== category ? "fallthrough " : "") +
      (score.difference === null || score.difference <= 0 ? "winner" : "loser")
    );
  };

  const diff = (p1Score?: MatchupScore) => {
    if (p1Score) {
      return p1Score.difference !== null ? formatTimeDiff(p1Score.difference) : "-";
    } else {
      return "-";
    }
  };

  const diffClass = (diff?: number | null) => {
    if (diff === null || diff === undefined) {
      return "";
    }
    return diff === 0 ? "diff-eq" : diff > 0 ? "diff-gt" : "diff-lt";
  };

  const total = (stats: PlayerStats, metric: keyof PlayerStats) => {
    if (stats === undefined || typeof stats[metric] !== "number") return 0;
    return stats[metric] as number;
  };

  const average = (stats: PlayerStats, metric: keyof PlayerStats) => {
    if (
      stats !== undefined &&
      stats !== null &&
      typeof stats[metric] === "number" &&
      stats.scoreCount > 0
    ) {
      return (stats[metric] as number) / stats.scoreCount;
    } else {
      return 0;
    }
  };

  const statsRow = (
    label: string,
    metric: keyof PlayerStats,
    ascending: boolean,
    calcFunc: (stats: PlayerStats, metric: keyof PlayerStats) => number,
    displayFunc: (value: number, isDiff: boolean) => string,
  ) => {
    if (!matchupData) {
      return <></>;
    }

    const p1Value = calcFunc(matchupData[0].data?.statsData as PlayerStats, metric);
    const p2Value = calcFunc(matchupData[1].data?.statsData as PlayerStats, metric);
    const diff = p1Value - p2Value;

    return (
      <tr>
        <th>{label}</th>
        <th colSpan={cellSpan}>{displayFunc(p1Value, false)}</th>
        <th className={diffClass(ascending ? diff : -diff)}>{displayFunc(diff, true)}</th>
        <th colSpan={cellSpan}>{displayFunc(p2Value, false)}</th>
      </tr>
    );
  };

  const siteHue = getCategorySiteHue(category);

  return (
    <>
      {/** Redirect if any id is invalid or API fetch failed */}
      {(id1 === 0 || id2 === 0) && <Navigate to={resolvePage(Pages.MatchupHome)} />}
      <Link to={resolvePage(Pages.MatchupHome)}>&lt; Back</Link>
      <h1>Matchup</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect value={category} onChange={setCategory} />
          <LapModeSelect includeOverall value={lapMode} onChange={setLapMode} />
        </div>
        <div className="module">
          <Deferred isWaiting={metadata.isLoading || isLoading}>
            <table>
              <thead>
                <tr>
                  <th />
                  <th colSpan={cellSpan}>
                    <FlagIcon
                      region={getRegionById(metadata, matchupData[0].data?.playerData.region ?? 0)}
                    />
                    {matchupData[0].data?.playerData.alias ?? matchupData[0].data?.playerData.name}
                  </th>
                  <th />
                  <th colSpan={cellSpan}>
                    <FlagIcon
                      region={getRegionById(metadata, matchupData[1].data?.playerData.region ?? 0)}
                    />
                    {matchupData[1].data?.playerData.alias ?? matchupData[1].data?.playerData.name}
                  </th>
                </tr>
                <tr>
                  <th>Track</th>
                  {hasCourse && <th>Course</th>}
                  {hasLap && <th>Lap</th>}
                  <th>Diff</th>
                  {hasCourse && <th>Course</th>}
                  {hasLap && <th>Lap</th>}
                </tr>
              </thead>
              <tbody className="table-hover-rows">
                {metadata.tracks?.map((track) =>
                  lapModes.map((isLap) => {
                    const p1Score = matchupData[0].data?.scoreData.find(
                      (score) => score.track === track.id && score.isLap === isLap,
                    ) as MatchupScore | undefined;
                    const p2Score = matchupData[1].data?.scoreData.find(
                      (score) => score.track === track.id && score.isLap === isLap,
                    ) as MatchupScore | undefined;
                    return (
                      <tr key={`${isLap ? "l" : "c"}${track.id}`}>
                        {(!isLap || lapMode === LapModeEnum.Lap) && (
                          <td rowSpan={cellSpan}>
                            <Link to={resolvePage(Pages.TrackChart, { id: track.id })}>
                              {track.name}
                            </Link>
                          </td>
                        )}
                        {isLap && lapMode === LapModeEnum.Overall && <td />}
                        <td className={scoreClasses(p1Score)}>
                          {p1Score ? formatTime(p1Score.value) : "-"}
                        </td>
                        {!isLap && lapMode === LapModeEnum.Overall && <td />}
                        <td className={diffClass(p1Score?.difference)}>{diff(p1Score)}</td>
                        {isLap && lapMode === LapModeEnum.Overall && <td />}
                        <td className={scoreClasses(p2Score)}>
                          {p2Score ? formatTime(p2Score.value) : "-"}
                        </td>
                        {!isLap && lapMode === LapModeEnum.Overall && <td />}
                      </tr>
                    );
                  }),
                )}
              </tbody>
              <tfoot>
                {statsRow("Total", "totalScore", true, total, (value, isDiff) =>
                  isDiff ? formatTimeDiff(value) : formatTime(value),
                )}
                {statsRow(
                  "AF",
                  "totalRank",
                  true,
                  average,
                  (value, isDiff) =>
                    (isDiff ? (value < 0 ? "-" : "+") : "") + Math.abs(value).toFixed(4),
                )}
                {statsRow(
                  "ARR",
                  "totalStandard",
                  true,
                  average,
                  (value, isDiff) =>
                    (isDiff ? (value < 0 ? "-" : "+") : "") + Math.abs(value).toFixed(4),
                )}
                {statsRow(
                  "PR:WR",
                  "totalRecordRatio",
                  false,
                  average,
                  (value, isDiff) =>
                    (isDiff ? (value < 0 ? "-" : "+") : "") +
                    (Math.abs(value) * 100).toFixed(4) +
                    "%",
                )}
                <tr>
                  <th>Tally</th>
                  <th colSpan={cellSpan}>
                    {matchupData[0].data !== undefined
                      ? lapMode === "overall"
                        ? matchupData[0].data.isLapStats.wins +
                          matchupData[0].data.isntLapStats.wins
                        : lapMode === "lap"
                          ? matchupData[0].data.isLapStats.wins
                          : matchupData[0].data.isntLapStats.wins
                      : 0}{" "}
                    win(s)
                  </th>
                  <th className={diffClass(0)}>
                    {matchupData[0].data !== undefined
                      ? lapMode === "overall"
                        ? matchupData[0].data.isLapStats.ties +
                          matchupData[0].data.isntLapStats.ties
                        : lapMode === "lap"
                          ? matchupData[0].data.isLapStats.ties
                          : matchupData[0].data.isntLapStats.ties
                      : 0}{" "}
                    draw(s)
                  </th>
                  <th colSpan={cellSpan}>
                    {matchupData[0].data !== undefined
                      ? lapMode === "overall"
                        ? matchupData[0].data.isLapStats.losses +
                          matchupData[0].data.isntLapStats.losses
                        : lapMode === "lap"
                          ? matchupData[0].data.isLapStats.losses
                          : matchupData[0].data.isntLapStats.losses
                      : 0}{" "}
                    win(s)
                  </th>
                </tr>
              </tfoot>
            </table>
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default MatchupPage;
