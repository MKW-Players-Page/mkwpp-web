import { useContext, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { CategorySelect, FlagIcon, LapModeSelect } from "../widgets";
import api from "../../api";
import {
  CategoryEnum,
  PlayerStats,
  TimetrialsRankingsListMetricEnum as MetricEnum,
} from "../../api/generated";
import { useApi } from "../../hooks";
import { formatTime } from "../../utils/Formatters";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import RegionSelectionDropdown from "../widgets/RegionDropdown";
import {
  useCategoryParam,
  useLapModeParam,
  useRegionParam,
  useRowHighlightParam,
} from "../../utils/SearchParams";
import { LapModeEnum } from "../widgets/LapModeSelect";

export interface RankingsMetric {
  title: string;
  description: string;
  metric: MetricEnum;
  metricOrder: number;
  getHighlightValue: (player: PlayerStats) => number;
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
    metricOrder: +1,
    getHighlightValue: (stats) => +(stats.totalRank / stats.scoreCount).toFixed(4),
    getValueString: (stats) => String(stats.totalRank / stats.scoreCount),
  },
  AverageStandard: {
    title: "ARR",
    description:
      "Average Rank Rating (ARR for short) is the average standard of a player's time across all " +
      "tracks.",
    metric: "total_standard",
    metricOrder: +1,
    getHighlightValue: (stats) => +(stats.totalStandard / stats.scoreCount).toFixed(4),
    getValueString: (stats) => String(stats.totalStandard / stats.scoreCount),
  },
  AverageRecordRatio: {
    title: "PR:WR",
    description:
      "Personal Record to World Record ratio (PR:WR) is calculated by dividing the world record " +
      "time by the player's time. Players are ranked by the average of their PR:WR across all " +
      "tracks.",
    metric: "total_record_ratio",
    metricOrder: -1,
    getHighlightValue: (stats) => +((stats.totalRecordRatio / stats.scoreCount) * 100).toFixed(4),
    getValueString: (stats) => ((stats.totalRecordRatio / stats.scoreCount) * 100).toFixed(4) + "%",
  },
  TotalTime: {
    title: "Total Time",
    description: "Total time is the sum of a player's fastest times across all tracks.",
    metric: "total_score",
    metricOrder: +1,
    getHighlightValue: (stats) => stats.totalScore,
    getValueString: (stats) => formatTime(stats.totalScore),
  },
  TallyPoints: {
    title: "Tally Points",
    description:
      "Tally Points is the sum of points gained by a Player on Track Top 10s. Each rank in a Top " +
      "10 is worth (11 - rank) points, meaning 1st place gains 10pts, 2nd place gains 9pts, and " +
      "so on. Everyone outside of the Top 10 gains no points.",
    metric: "leaderboard_points",
    metricOrder: -1,
    getHighlightValue: (stats) => stats.leaderboardPoints,
    getValueString: (stats) => String(stats.leaderboardPoints),
  },
};

export interface RankingsProps {
  metric: RankingsMetric;
}

const RankingsPage = ({ metric }: RankingsProps) => {
  const searchParams = useSearchParams();
  let { category, setCategory } = useCategoryParam(searchParams);
  let { lapMode, setLapMode } = useLapModeParam(searchParams, false);
  const { region, setRegion } = useRegionParam(searchParams);
  const { highlight, setHighlight } = useRowHighlightParam(searchParams);
  const wrappedSetLapMode = setLapMode;
  setLapMode = (lapMode: LapModeEnum) => {
    setHighlight(-1);
    wrappedSetLapMode(lapMode);
  };
  const wrappedSetCategory = setCategory;
  setCategory = (category: CategoryEnum) => {
    setHighlight(-1);
    wrappedSetCategory(category);
  };

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

  const highlightElement = useRef(null);
  useEffect(() => {
    if (highlightElement !== null) {
      (highlightElement.current as unknown as HTMLDivElement)?.scrollIntoView({
        inline: "center",
        block: "center",
      });
    }
  }, [highlightElement, isLoading]);

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
                {rankings?.map((stats, idx, arr) => (
                  <>
                    {highlight &&
                    ((metric.metricOrder < 0 &&
                      metric.getHighlightValue(stats) < highlight &&
                      (arr[idx - 1] === undefined ||
                        metric.getHighlightValue(arr[idx - 1]) > highlight)) ||
                      (metric.metricOrder > 0 &&
                        metric.getHighlightValue(stats) > highlight &&
                        (arr[idx - 1] === undefined ||
                          metric.getHighlightValue(arr[idx - 1]) < highlight))) ? (
                      <>
                        <tr ref={highlightElement} key={highlight} className="highlighted">
                          <td />
                          <td>Your Highlighted Value</td>
                          <td>
                            {metric.metric === "total_record_ratio"
                              ? highlight.toFixed(4) + "%"
                              : metric.metric === "total_score"
                                ? formatTime(highlight)
                                : highlight}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}
                    <tr
                      key={stats.player.id}
                      className={
                        stats.player.id === user?.player ||
                        metric.getHighlightValue(stats) === highlight
                          ? "highlighted"
                          : ""
                      }
                      ref={
                        metric.getHighlightValue(stats) === highlight ? highlightElement : undefined
                      }
                    >
                      <td>{stats.rank}</td>
                      <td>
                        <FlagIcon region={getRegionById(metadata, stats.player.region ?? 0)} />
                        <Link
                          to={resolvePage(Pages.PlayerProfile, {
                            id: stats.player.id,
                          })}
                        >
                          {stats.player.alias ?? stats.player.name}
                        </Link>
                      </td>
                      <td>{metric.getValueString(stats)}</td>
                    </tr>
                  </>
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
