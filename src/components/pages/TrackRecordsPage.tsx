import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { CategorySelect, FlagIcon, Icon, Tooltip } from "../widgets";
import api, { CategoryEnum } from "../../api";
import { useApi } from "../../hooks";
import { formatDate, formatTime } from "../../utils/Formatters";
import { getRegionById, getStandardLevel, MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";

const TrackRecordsPage = () => {
  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.NonShortcut);

  const metadata = useContext(MetadataContext);

  const { user } = useContext(UserContext);

  const { isLoading, data: scores } = useApi(
    () => api.timetrialsRecordsList({ category }),
    [category],
  );

  return (
    <>
      <h1>World Records</h1>
      <CategorySelect value={category} onChange={setCategory} />
      <div className="module">
        <Deferred isWaiting={isLoading || metadata.isLoading}>
          <table>
            <thead>
              <tr>
                <th>Track</th>
                <th>Player</th>
                <th>Course</th>
                <th>Lap</th>
                <th>Standard</th>
                <th>Date</th>
                <th className="icon-cell" />
                <th className="icon-cell" />
                <th className="icon-cell" />
              </tr>
            </thead>
            <tbody>
              {metadata.tracks?.map((track) => [false, true].map((isLap) => {
                const score = scores?.find(
                  (score) => score.track === track.id && score.isLap === isLap
                );
                return (
                  <tr
                    key={`${isLap ? 'l' : 'c'}${track.id}`}
                    className={user && score?.player.id === user.player ? 'highlighted' : ''}
                  >
                    {!isLap && (
                      <td rowSpan={2}>
                        <Link to={resolvePage(Pages.TrackChart, { id: track.id })}>
                          {track.name}
                        </Link>
                      </td>
                    )}
                    <td>
                      {score ? (
                        <>
                          <FlagIcon region={getRegionById(metadata, score.player.region || 0)} />
                          <Link to={resolvePage(Pages.PlayerProfile, { id: score?.player.id })}>
                            {score.player.alias || score.player.name}
                          </Link>
                        </>
                      ) : "-"}
                    </td>
                    {isLap && <td />}
                    <td className={score?.category !== category ? 'fallthrough' : ''}>
                      {score ? formatTime(score.value) : "-"}
                    </td>
                    {!isLap && <td />}
                    <td>{score ? getStandardLevel(metadata, score.standard)?.name : "-"}</td>
                    <td>{score?.date ? formatDate(score.date) : "-"}</td>
                    <td className="icon-cell">{score?.videoLink && (
                      <a href={score.videoLink} target="_blank" rel="noopener noreferrer">
                        <Icon icon="Video" />
                      </a>
                    )}</td>
                    <td className="icon-cell">{score?.ghostLink && (
                      <a href={score.ghostLink} target="_blank" rel="noopener noreferrer">
                        <Icon icon="Ghost" />
                      </a>
                    )}</td>
                    <td className="icon-cell">{score?.comment && (
                      <Tooltip text={score.comment}>
                        <Icon icon="Comment" />
                      </Tooltip>
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

export default TrackRecordsPage;
