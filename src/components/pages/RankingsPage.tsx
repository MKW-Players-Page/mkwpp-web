import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { CategorySelect, FlagIcon, LapModeSelect } from "../widgets";
import api from "../../api";
import { PlayerStats, TimetrialsRankingsListMetricEnum as MetricEnum } from "../../api/generated";
import { useApi } from "../../hooks";
import { formatTime } from "../../utils/Formatters";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import RegionSelectionDropdown from "../widgets/RegionDropdown";
import { useCategoryParam, useLapModeParam, useRegionParam } from "../../utils/SearchParams";

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
    getValueString: (stats) => ((stats.totalRecordRatio / stats.scoreCount) * 100).toFixed(4) + "%",
  },
  TotalTime: {
    title: "Total Time",
    description: "Total time is the sum of a player's fastest times across all tracks.",
    metric: "total_score",
    getValueString: (stats) => formatTime(stats.totalScore),
  },
  TallyPoints: {
    title: "Tally Points",
    description:
      "Tally Points are calculated by the amount of Top 10s a player holds, 1st counts 10pts while 10th counts 1pt.",
    metric: "leaderboard_points",
    getValueString: (stats) => String(stats.leaderboardPoints),
  },
};

export interface RankingsProps {
  metric: RankingsMetric;
}

const RankingsPage = ({ metric }: RankingsProps) => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, false);
  const { region, setRegion } = useRegionParam(searchParams);

  const metadata = useContext(MetadataContext);
  const { user } = useContext(UserContext);

  const { isLoading, data: rankings } = useApi(
    () =>
      api.timetrialsRankingsList({
        category,
        lapMode,
        region: region.id,
        metric: metric.metric,
      }),
    [category, lapMode, region],
  );

  const siteHue = getCategorySiteHue(category);

  return (
    <>
      <h1>{metric.title}</h1>
      <p>{metric.description}</p>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect value={category} onChange={setCategory} />
          <LapModeSelect includeOverall value={lapMode} onChange={setLapMode} />
          <RegionSelectionDropdown ranked={true} value={region} setValue={setRegion} />
        </div>
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
              <tbody className="table-hover-rows">
                {rankings?.map((stats) => (
                  <tr
                    key={stats.player.id}
                    className={user && stats.player.id === user.player ? "highlighted" : ""}
                  >
                    <td>{stats.rank}</td>
                    <td>
                      <FlagIcon region={getRegionById(metadata, stats.player.region ?? 0)} />
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
      </OverwriteColor>
    </>
  );
};

export default RankingsPage;
