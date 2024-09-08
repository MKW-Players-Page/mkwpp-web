import { useContext } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { Pages, resolvePage } from './Pages';
import Deferred from '../global/Deferred';
import api from '../../api';
import { useApi } from '../../hooks/ApiHook';
import { formatDate, formatTime } from '../../utils/Formatters';
import { getRegionNameFull, MetadataContext } from '../../utils/Metadata';
import { integerOr } from '../../utils/Numbers';

const PlayerProfilePage = () => {
  const { id: idStr } = useParams();
  const id = Math.max(integerOr(idStr, 0), 0);

  const metadata = useContext(MetadataContext);

  const {
    isLoading: playerLoading,
    data: player,
    error: playerError,
  } = useApi(() => api.timetrialsPlayersRetrieve({ id }));

  const {
    isLoading: scoresLoading,
    data: scores
  } = useApi(() => api.timetrialsPlayersScoresList({ id, category: 'nonsc' }));

  return (
    <>
      {/* Redirect to player list if id is invalid or does not exist. */}
      {playerError && <Navigate to={resolvePage(Pages.PlayerList)} />}
      <h1>{player?.name || <>&nbsp;</>}</h1>
      <div className="module-row">
        <div className="module">
          <Deferred isWaiting={playerLoading}>
            <table>
              <tbody>
                <tr>
                  <td>Location</td>
                  <td>{getRegionNameFull(metadata, player?.region || 0)}</td>
                </tr>
                <tr>
                  <td>Alias</td>
                  <td>{player?.alias}</td>
                </tr>
                <tr>
                  <td>Date joined</td>
                  <td>{player?.joinedDate && formatDate(player.joinedDate)}</td>
                </tr>
                <tr>
                  <td>Last activity</td>
                  <td>{player?.lastActivity && formatDate(player.lastActivity)}</td>
                </tr>
              </tbody>
            </table>
          </Deferred>
        </div>
        <div className="module">
          <Deferred isWaiting={playerLoading}>
            {/* Temporary until better solution implemented, like a popup dialog. */}
            <div className="module-content" style={{overflowY: 'scroll', maxHeight: 128}}>
              <p>
                {player?.bio ? player.bio.split('\n').map((line: string) => (
                  <>{line}<br /></>
                )) : (
                  <i>This player doesn't have anything to say about themselves...</i>
                )}
              </p>
            </div>
          </Deferred>
        </div>
      </div>
      <div className="module">
        <Deferred isWaiting={metadata.isLoading && scoresLoading}>
          <table>
            <thead>
              <tr>
                <th>Track</th>
                <th>Course</th>
                <th>Lap</th>
                <th>Rank</th>
                <th>Date</th>
                <th className="col-icon" />
                <th className="col-icon" />
              </tr>
            </thead>
            <tbody>
              {metadata.tracks?.map((track) => [false, true].map((isLap) => {
                const score = scores?.find(
                  (score) => score.track === track.id && score.isLap === isLap
                );
                return (
                  <tr key={`${isLap ? 'l' : 'c'}${track.id}`}>
                    {!isLap && (
                      <td rowSpan={2}>
                        <Link to={resolvePage(Pages.TrackChart, { id: track.id })}>
                          {track.name}
                        </Link>
                      </td>
                    )}
                    {isLap && <td />}
                    <td>{score ? formatTime(score.value) : "-"}</td>
                    {!isLap && <td />}
                    <td>{score?.rank || '-'}</td>
                    <td>{score?.date ? formatDate(score.date) : "-"}</td>
                    <td>{score?.videoLink && (
                      <a href={score.videoLink} target="_blank" rel="noopener noreferrer">V</a>
                    )}</td>
                    <td>{score?.ghostLink && (
                      <a href={score.ghostLink} target="_blank" rel="noopener noreferrer">G</a>
                    )}</td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </Deferred>
      </div>
    </>
  );
};

export default PlayerProfilePage;
