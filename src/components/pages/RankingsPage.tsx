import { useState } from 'react';
import { Link } from 'react-router-dom';

import Deferred from '../global/Deferred';
import { CategorySelect } from '../widgets';
import api, { CategoryEnum } from '../../api';
import { PlayerStats, TimetrialsRankingsListMetricEnum } from '../../api/generated';
import { useApi } from '../../hooks';
import { formatTime } from '../../utils/Formatters';
import { Pages, resolvePage } from './Pages';
import LapModeSelect from '../widgets/LapModeSelect';

export interface RankingsMetric {
  title: string;
  metric: TimetrialsRankingsListMetricEnum;
  getValueString: (player: PlayerStats) => string;
};

export type RankingsMetricMap = {
  [key: string]: RankingsMetric;
};

export const RankingsMetrics: RankingsMetricMap = {
  AverageFinish: {
    title: "Average Finish",
    metric: 'average_finish',
    getValueString: (player) => String(player.totalRank / player.scoreCount),
  },
  TotalTime: {
    title: "Total Time",
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
