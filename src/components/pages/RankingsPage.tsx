import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { CategorySelect, FlagIcon, LapModeSelect } from "../widgets";
import { LapModeEnum } from "../widgets/LapModeSelect";
import api, { CategoryEnum } from "../../api";
import {
  PlayerStats,
  TimetrialsRankingsListMetricEnum as MetricEnum,
} from "../../api/generated";
import { useApi } from "../../hooks";
import { formatTime } from "../../utils/Formatters";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";

export interface RankingsMetric {
  title: string;
  description: string;
  metric: MetricEnum;
  getValueString: (player: PlayerStats) => string;
}

export type RankingsMetricMap = {
  [key: string]: RankingsMetric;
};

export const RankingsMetrics: RankingsMetricMap = {
  AverageFinish: {
    title: "Average Finish",
    description:
      "Average Finish (AF for short) is the average of a player's ranking across all tracks.",
    metric: "total_rank",
    getValueString: (stats) => String(stats.totalRank / stats.scoreCount),
  },
  AverageStandard: {
    title: "ARR",
    description:
      "Average Rank Rating (ARR for short) is the average standard of a player's time across all " +
      "tracks.",
    metric: "total_standard",
    getValueString: (stats) => String(stats.totalStandard / stats.scoreCount),
  },
  AverageRecordRatio: {
    title: "PR:WR",
    description:
      "Personal Record to World Record ratio (PR:WR) is calculated by dividing the world record " +
      "time by the player's time. Players are ranked by the average of their PR:WR across all " +
      "tracks.",
    metric: "total_record_ratio",
    getValueString: (stats) =>
      ((stats.totalRecordRatio / stats.scoreCount) * 100).toFixed(4) + "%",
  },
  TotalTime: {
    title: "Total Time",
    description:
      "Total time is the sum of a player's fastest times across all tracks.",
    metric: "total_score",
    getValueString: (stats) => formatTime(stats.totalScore),
  },
};

export interface RankingsProps {
  metric: RankingsMetric;
}

const RankingsPage = ({ metric }: RankingsProps) => {
  const [category, setCategory] = useState<CategoryEnum>(
    CategoryEnum.NonShortcut,
  );
  const [lapMode, setLapMode] = useState<LapModeEnum>(LapModeEnum.Overall);

  const metadata = useContext(MetadataContext);

  const { user } = useContext(UserContext);

  const { isLoading, data: rankings } = useApi(
    () =>
      api.timetrialsRankingsList({
        category,
        lapMode,
        region: 1,
        metric: metric.metric,
      }),
    [category, lapMode],
  );

  return (
    <>
      <h1>{metric.title}</h1>
      <p>{metric.description}</p>
      <CategorySelect value={category} onChange={setCategory} />
      <LapModeSelect includeOverall value={lapMode} onChange={setLapMode} />
      <div className="module">
        <Deferred isWaiting={isLoading}>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>{metric.title}</th>
              </tr>
            </thead>
            <tbody>
              {rankings?.map((stats) => (
                <tr
                  key={stats.player.id}
                  className={
                    user && stats.player.id === user.player ? "highlighted" : ""
                  }
                >
                  <td>{stats.rank}</td>
                  <td>
                    <FlagIcon
                      region={getRegionById(metadata, stats.player.region || 0)}
                    />
                    <Link
                      to={resolvePage(Pages.PlayerProfile, {
                        id: stats.player.id,
                      })}
                    >
                      {stats.player.alias || stats.player.name}
                    </Link>
                  </td>
                  <td>{metric.getValueString(stats)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Deferred>
      </div>
    </>
  );
};

export default RankingsPage;
