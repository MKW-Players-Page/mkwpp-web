import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Pages, resolvePage } from './Pages';
import Deferred from '../global/Deferred';
import api from '../../api';
import { useApi } from '../../hooks/ApiHook';
import { getRegionNameFull, MetadataContext } from '../../utils/Metadata';

const PlayerListPage = () => {
  const { isLoading, data: players } = useApi(() => api.timetrialsPlayersList());

  const metadata = useContext(MetadataContext);

  return (
    <>
      <h1>Players</h1>
      <div className="module">
        <Deferred isWaiting={isLoading}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {players?.map((player) => (
                <tr key={player.id}>
                  <td>
                    <Link to={resolvePage(Pages.PlayerProfile, { id: player.id })}>
                      {player.name}
                    </Link>
                  </td>
                  <td>{getRegionNameFull(metadata, player.region || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Deferred>
      </div>
    </>
  );
};

export default PlayerListPage;
