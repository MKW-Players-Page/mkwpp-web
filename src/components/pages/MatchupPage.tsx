import { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import api, { CategoryEnum, PlayerMatchupScore, PlayerMatchupStats } from "../../api";
import { useApi } from "../../hooks";
import { formatTime, formatTimeDiff } from "../../utils/Formatters";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { integerOr } from "../../utils/Numbers";
import { CategorySelect, FlagIcon } from "../widgets";
import OverwriteColor from "../widgets/OverwriteColor";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import LapModeSelect, { LapModeEnum } from "../widgets/LapModeSelect";
import PlayerSelectDropdown from "../widgets/PlayerSelectDropdown";

export const MatchupHomePage = () => {
  const [id1, setId1] = useState(0);
  const [id2, setId2] = useState(0);

  return (
    <>
      <h1>Matchup</h1>
      <div className="module">
        <div className="module-content">
          <div className="module-row">
            <span>Player&nbsp;1</span>
            <PlayerSelectDropdown setId={setId1} id={id1} />
          </div>
          <div className="module-row">
            <span>Player&nbsp;2</span>
            <PlayerSelectDropdown setId={setId2} id={id2} />
          </div>
          <Link to={resolvePage(Pages.Matchup, { id1: id1, id2: id2 })}>Compare</Link>
        </div>
      </div>
    </>
  );
};

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

  const { isLoading, data: matchup } = useApi(
    () =>
      api.timetrialsMatchupsRetrieve({
        pk1: id1,
        pk2: id2,
        category,
        lapMode,
      }),
    [id1, id2, category, lapMode],
  );

  const scoreClasses = (score?: PlayerMatchupScore) => {
    if (!score) {
      return "";
    }
    return (
      (score.category !== category ? "fallthrough " : "") +
      (score.difference === null || score.difference <= 0 ? "winner" : "loser")
    );
  };

  const diff = (p1Score?: PlayerMatchupScore) => {
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

  const total = (stats: PlayerMatchupStats, metric: keyof PlayerMatchupStats) => {
    return stats[metric];
  };

  const average = (stats: PlayerMatchupStats, metric: keyof PlayerMatchupStats) => {
    return stats.scoreCount > 0 ? stats[metric] / stats.scoreCount : 0;
  };

  const statsRow = (
    label: string,
    metric: keyof PlayerMatchupStats,
    ascending: boolean,
    calcFunc: (stats: PlayerMatchupStats, metric: keyof PlayerMatchupStats) => number,
    displayFunc: (value: number, isDiff: boolean) => string,
  ) => {
    if (!matchup) {
      return <></>;
    }

    const p1Value = calcFunc(matchup.p1.stats, metric);
    const p2Value = calcFunc(matchup.p2.stats, metric);
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
      {(id1 === 0 || id2 === 0 || (!isLoading && !matchup)) && (
        <Navigate to={resolvePage(Pages.MatchupHome)} />
      )}
      <Link to={resolvePage(Pages.MatchupHome)}>&lt; Back</Link>
      <h1>Matchup</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect value={category} onChange={setCategory} />
          <LapModeSelect includeOverall value={lapMode} onChange={setLapMode} />
        </div>
        <div className="module">
          <Deferred isWaiting={metadata.isLoading || isLoading}>
            {matchup && (
              <table>
                <thead>
                  <tr>
                    <th />
                    <th colSpan={cellSpan}>
                      <FlagIcon region={getRegionById(metadata, matchup.p1.region || 0)} />
                      {matchup.p1.alias || matchup.p1.name}
                    </th>
                    <th />
                    <th colSpan={cellSpan}>
                      <FlagIcon region={getRegionById(metadata, matchup.p2.region || 0)} />
                      {matchup.p2.alias || matchup.p2.name}
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
                      const p1Score = matchup.p1.scores.find(
                        (score) => score.track === track.id && score.isLap === isLap,
                      );
                      const p2Score = matchup.p2.scores.find(
                        (score) => score.track === track.id && score.isLap === isLap,
                      );
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
                    <th colSpan={cellSpan}>{matchup.p1.totalWins} win(s)</th>
                    <th className={diffClass(0)}>{matchup.p1.totalTies} draw(s)</th>
                    <th colSpan={cellSpan}>{matchup.p2.totalWins} win(s)</th>
                  </tr>
                </tfoot>
              </table>
            )}
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default MatchupPage;
