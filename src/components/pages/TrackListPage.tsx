import { useContext } from "react";
import { Link } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { MetadataContext } from "../../utils/Metadata";

const TrackListPage = () => {
  const metadata = useContext(MetadataContext);

  return (
    <>
      <h1>Courses</h1>
      <Deferred isWaiting={metadata.isLoading}>
        {/* Nasty hardcoded hack to get 2 rows. Maybe add is_retro flag to cup model. */}
        {[0, 4].map((start) => (
          <div key={start} className="module-row">
            {metadata.cups?.slice(start, start + 4).map((cup) => (
              <div key={cup.id} className="module">
                <div className="module-content">
                  <b>{cup.name}</b>
                  <ul>
                    {cup.tracks.map((trackId) => (
                      <li key={trackId}>
                        <Link
                          to={resolvePage(Pages.TrackChart, { id: trackId })}
                        >
                          {
                            metadata.tracks?.find(
                              (track) => track.id === trackId,
                            )?.name
                          }
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ))}
      </Deferred>
    </>
  );
};

export default TrackListPage;
