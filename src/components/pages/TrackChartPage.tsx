import { useContext, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { Pages, resolvePage } from './Pages';
import Deferred from '../global/Deferred';
import { CategorySelect } from '../widgets';
import api, { CategoryEnum } from '../../api';
import { useApi } from '../../hooks';
import { formatDate, formatTime } from '../../utils/Formatters';
import { MetadataContext } from '../../utils/Metadata';
import { integerOr } from '../../utils/Numbers';
import LapModeSelect from '../widgets/LapModeSelect';

const TrackChartPage = () => {
  const { id: idStr } = useParams();
  const id = Math.max(integerOr(idStr, 0), 0);

  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.NonShortcut);
  const [isLap, setIsLap] = useState<boolean>(false);

  const metadata = useContext(MetadataContext);
  const track = metadata.tracks?.find((t) => t.id === id);

  const { isLoading, data: scores } = useApi(() => api.timetrialsTracksScoresList({
    id,
    category,
    isLap,
  }), [category, isLap]);

  return (
    <>
      {/* Redirect to courses list if id is invalid or does not exist. */}
      {metadata.tracks && !track && <Navigate to={resolvePage(Pages.TrackList)} />}
      <h1>{track?.name}</h1>
      <CategorySelect options={track?.categories} value={category} onChange={setCategory} />
      <LapModeSelect value={isLap} onChange={(mode) => setIsLap(!!mode)} />
      <div className="module">
        <Deferred isWaiting={isLoading}>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Time</th>
                <th>Date</th>
                <th className="col-icon" />
                <th className="col-icon" />
              </tr>
            </thead>
            <tbody>
              {scores?.map((score) => (
                <tr key={score.id}>
                  <td>{score.rank}</td>
                  <td>
                    <Link to={resolvePage(Pages.PlayerProfile, {id: score.player.id})}>
                      {score.player.name}
                    </Link>
                  </td>
                  <td className={score.category !== category ? 'fallthrough' : ''}>
                    {formatTime(score.value)}
                  </td>
                  <td>{score.date && formatDate(score.date)}</td>
                  <td>{score.videoLink && (
                    <a href={score.videoLink} target="_blank" rel="noopener noreferrer">V</a>
                  )}</td>
                  <td>{score.ghostLink && (
                    <a href={score.ghostLink} target="_blank" rel="noopener noreferrer">G</a>
                  )}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Deferred>
      </div>
    </>
  );
};

export default TrackChartPage;
