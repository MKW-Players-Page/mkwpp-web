import { useContext } from "react";
import { Link } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { FlagIcon } from "../widgets";
import api from "../../api";
import { useApi } from "../../hooks/ApiHook";
import {
  getRegionById,
  getRegionNameFull,
  MetadataContext,
} from "../../utils/Metadata";
import { UserContext } from "../../utils/User";

const PlayerListPage = () => {
  const { isLoading, data: players } = useApi(() =>
    api.timetrialsPlayersList(),
  );

  const metadata = useContext(MetadataContext);

  const { user } = useContext(UserContext);

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
                <tr
                  key={player.id}
                  className={
                    user && player.id === user.player ? "highlighted" : ""
                  }
                >
                  <td>
                    <FlagIcon
                      region={getRegionById(metadata, player.region || 0)}
                    />
                    <Link
                      to={resolvePage(Pages.PlayerProfile, { id: player.id })}
                    >
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
