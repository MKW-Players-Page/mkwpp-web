import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { Pages, resolvePage } from './Pages';
import Deferred from '../global/Deferred';
import { CategorySelect, FlagIcon, LapModeSelect } from '../widgets';
import api, { CategoryEnum } from '../../api';
import { PlayerStats, TimetrialsRankingsListMetricEnum } from '../../api/generated';
import { useApi } from '../../hooks';
import { formatTime } from '../../utils/Formatters';
import { getRegionById, MetadataContext } from '../../utils/Metadata';

export interface RankingsMetric {
  title: string;
  description: string;
  metric: TimetrialsRankingsListMetricEnum;
  getValueString: (player: PlayerStats) => string;
};

export type RankingsMetricMap = {
  [key: string]: RankingsMetric;
};

export const RankingsMetrics: RankingsMetricMap = {
  AverageFinish: {
    title: "Average Finish",
    description:
      "Average Finish (AF for short) is the average of a player's ranking across all tracks.",
    metric: 'total_rank',
    getValueString: (player) => String(player.totalRank / player.scoreCount),
  },
  AverageStandard: {
    title: "ARR",
    description:
      "Average Rank Rating (ARR for short) is the average standard of a player's time across all " +
      "tracks.",
    metric: 'total_standard',
    getValueString: (player) => String(player.totalStandard / player.scoreCount),
  },
  AverageRecordRatio: {
    title: "PR:WR",
    description:
      "Personal Record to World Record ratio (PR:WR) is calculated by dividing the world record " +
      "time by the player's time. Players are ranked by the average of their PR:WR across all " +
      "tracks.",
    metric: 'total_record_ratio',
    getValueString: (player) => (
      (player.totalRecordRatio / player.scoreCount * 100).toFixed(4) + "%"
    ),
  },
  TotalTime: {
    title: "Total Time",
    description: "Total time is the sum of a player's fastest times across all tracks.",
    metric: 'total_score',
    getValueString: (player) => formatTime(player.totalScore),
  },
};

export interface RankingsProps {
  metric: RankingsMetric;
};

const RankingsPage = ({ metric }: RankingsProps) => {
  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.NonShortcut);
  const [lapMode, setLapMode] = useState<boolean>();

  const metadata = useContext(MetadataContext);

  const {
    isLoading,
    data: rankings,
  } = useApi(() => api.timetrialsRankingsList({
    category,
    isLap: lapMode,
    metric: [metric.metric]
  }), [category, lapMode]);

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
              {rankings?.map((player) => (
                <tr key={player.player}>
                  <td>{player.rank}</td>
                  <td>
                    <FlagIcon region={getRegionById(metadata, player.playerRegion || 0)} />
                    <Link to={resolvePage(Pages.PlayerProfile, { id: player.player })}>
                      {player.playerName}
                    </Link>
                  </td>
                  <td>{metric.getValueString(player)}</td>
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
