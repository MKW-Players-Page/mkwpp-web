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
        <div
          style={
            {
              display: "grid",
              gap: "0 16px",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, max(250px, 100%/5)), 1fr))" /* Don't ask me how or why this works */,
            } as React.CSSProperties
          }
        >
          {metadata.cups?.map((cup) => (
            <div key={cup.id} className="module">
              <div className="module-content">
                <b>{cup.name}</b>
                <ul>
                  {cup.tracks.map((trackId) => (
                    <li key={trackId}>
                      <Link to={resolvePage(Pages.TrackChart, { id: trackId })}>
                        {metadata.tracks?.find((track) => track.id === trackId)?.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Deferred>
    </>
  );
};

export default TrackListPage;
