import { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { CategorySelect, FlagIcon, LapModeSelect } from "../widgets";
import { LapModeEnum } from "../widgets/LapModeSelect";
import api, { CategoryEnum } from "../../api";
import { TimetrialsTracksTopsListLapModeEnum } from "../../api/generated";
import { useApiArray } from "../../hooks/ApiHook";
import { formatTime } from "../../utils/Formatters";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { integerOr } from "../../utils/Numbers";
import { UserContext } from "../../utils/User";
import ComplexRegionSelection from "../widgets/RegionSelection";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";

export const TrackTopsHomePage = () => {
  const metadata = useContext(MetadataContext);

  return (
    <Deferred isWaiting={metadata.isLoading}>
      {metadata.regions && metadata.cups && (
        <Navigate
          to={resolvePage(Pages.TrackTops, {
            region: metadata.regions[0].code.toLowerCase(),
            cup: metadata.cups[0].id,
          })}
        />
      )}
    </Deferred>
  );
};

const TrackTopsPage = () => {
  const { region: regionCode, cup: cupStr } = useParams();
  const cupId = Math.max(integerOr(cupStr, 0), 0);

  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.NonShortcut);
  const [lapMode, setLapMode] = useState<LapModeEnum>(LapModeEnum.Course);

  const metadata = useContext(MetadataContext);

  const region = metadata.regions?.find((r) => r.code.toLowerCase() === regionCode && r.isRanked);
  const cup = metadata.cups?.find((c) => c.id === cupId);

  const { user } = useContext(UserContext);

  const tops = useApiArray(
    (params) => api.timetrialsTracksTopsList(params),
    4,
    cup?.tracks.map((track) => ({
      id: track,
      category,
      lapMode: lapMode as TimetrialsTracksTopsListLapModeEnum,
      region: region?.id,
    })) || [],
    [category, cup, lapMode, region],
  );

  const siteHue = getCategorySiteHue(category);

  return (
    <>
      {metadata.regions && !region && <Navigate to={resolvePage(Pages.TrackTopsHome)} />}
      {metadata.cups && !metadata.cups.find((cup) => cup.id === cupId) && (
        <Navigate to={resolvePage(Pages.TrackTopsHome)} />
      )}
      <Deferred isWaiting={metadata.isLoading}>
        <OverwriteColor hue={siteHue}>
          <ComplexRegionSelection region={region} cupId={cupId} />
          <div className="module-row">
            <CategorySelect value={category} onChange={setCategory} />
            <LapModeSelect value={lapMode} onChange={setLapMode} />
          </div>
          <div
            className="module-row"
            style={
              {
                justifyContent: "center",
              } as React.CSSProperties
            }
          >
            {metadata.cups?.map((c) => (
              <div
                key={c.id}
                className="module"
                style={
                  {
                    borderRadius: "50%",
                    aspectRatio: "1/1",
                    width: "auto",
                    backgroundColor: c.id === cupId ? "var(--module-border-color)" : "",
                  } as React.CSSProperties
                }
              >
                <div
                  style={
                    {
                      textAlign: "center",
                    } as React.CSSProperties
                  }
                  className="module-content"
                >
                  <Link
                    to={resolvePage(Pages.TrackTops, {
                      region: region?.code.toLowerCase() || 0,
                      cup: c.id,
                    })}
                  >
                    <img
                      style={
                        {
                          aspectRatio: "1/1",
                          height: "60px",
                        } as React.CSSProperties
                      }
                      src={`/mkw/cups/${c.id}.png`}
                      alt="Cup Icon"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div
            className="module-row "
            style={
              {
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
              } as React.CSSProperties
            }
          >
            {cup &&
              metadata.tracks
                ?.filter((track) => cup.tracks.includes(track.id))
                .map((track, index) => (
                  <div key={track.id}>
                    <h1>{track.name}</h1>
                    <div className="module">
                      <Deferred isWaiting={tops[index].isLoading}>
                        <table>
                          <tbody className="table-hover-rows">
                            {tops[index].data?.map((score) => (
                              <tr
                                key={score.id}
                                className={
                                  user && score.player.id === user.player ? "highlighted" : ""
                                }
                              >
                                <td>{score.rank}</td>
                                <td>
                                  <FlagIcon
                                    region={getRegionById(metadata, score.player.region || 0)}
                                  />
                                  <Link
                                    to={resolvePage(Pages.PlayerProfile, {
                                      id: score.player.id,
                                    })}
                                  >
                                    {score.player.alias || score.player.name}
                                  </Link>
                                </td>
                                <td>{formatTime(score.value)}</td>
                              </tr>
                            ))}
                            <tr>
                              <th colSpan={3}>
                                <Link
                                  to={resolvePage(Pages.TrackChartReg, {
                                    id: track.id,
                                    regionCode: region?.code.toLowerCase(),
                                  })}
                                >
                                  View full leaderboards
                                </Link>
                              </th>
                            </tr>
                          </tbody>
                        </table>
                      </Deferred>
                    </div>
                  </div>
                ))}
          </div>
        </OverwriteColor>
      </Deferred>
    </>
  );
};

export default TrackTopsPage;
