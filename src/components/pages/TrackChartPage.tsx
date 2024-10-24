import { useContext } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { CategorySelect, FlagIcon, Icon, LapModeSelect, Tooltip } from "../widgets";
import api from "../../api";
import { TimetrialsTracksScoresListLapModeEnum } from "../../api/generated";
import { useApi } from "../../hooks";
import { formatDate, formatTime } from "../../utils/Formatters";
import { getRegionById, getStandardLevel, MetadataContext } from "../../utils/Metadata";
import { integerOr } from "../../utils/Numbers";
import { UserContext } from "../../utils/User";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import RegionSelectionDropdown from "../widgets/RegionDropdown";
import { useCategoryParam, useLapModeParam, useRegionParam } from "../../utils/SearchParams";

const TrackChartPage = () => {
  const { id: idStr } = useParams();
  const id = Math.max(integerOr(idStr, 0), 0);

  const { user } = useContext(UserContext);

  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { lapMode, setLapMode } = useLapModeParam(searchParams);
  const { region, setRegion } = useRegionParam(searchParams);

  const metadata = useContext(MetadataContext);
  const track = metadata.tracks?.find((t) => t.id === id);

  const { isLoading, data: scores } = useApi(
    () =>
      api.timetrialsTracksScoresList({
        id,
        category,
        lapMode: lapMode as TimetrialsTracksScoresListLapModeEnum,
        region: region.id,
      }),
    [category, lapMode, region],
  );

  const siteHue = getCategorySiteHue(category);

  return (
    <>
      {/* Redirect to courses list if id is invalid or does not exist. */}
      {metadata.tracks && !track && <Navigate to={resolvePage(Pages.TrackList)} />}
      <Link to={resolvePage(Pages.TrackList)}>{"< Back"}</Link>
      <h1>{track?.name}</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect options={track?.categories} value={category} onChange={setCategory} />
          <LapModeSelect value={lapMode} onChange={setLapMode} />
          <RegionSelectionDropdown ranked={false} value={region} setValue={setRegion} />
        </div>
        <div className="module">
          <Deferred isWaiting={metadata.isLoading || isLoading}>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Time</th>
                  <th>Standard</th>
                  <th>Date</th>
                  <th className="icon-cell" />
                  <th className="icon-cell" />
                  <th className="icon-cell" />
                </tr>
              </thead>
              <tbody className="table-hover-rows">
                {scores?.map((score) => (
                  <tr
                    key={score.id}
                    className={user && score.player.id === user.player ? "highlighted" : ""}
                  >
                    <td>{score.rank}</td>
                    <td>
                      <FlagIcon region={getRegionById(metadata, score.player.region || 0)} />
                      <Link
                        to={resolvePage(Pages.PlayerProfile, {
                          id: score.player.id,
                        })}
                      >
                        {score.player.alias || score.player.name}
                      </Link>
                    </td>
                    <td className={score.category !== category ? "fallthrough" : ""}>
                      {formatTime(score.value)}
                    </td>
                    <td>{getStandardLevel(metadata, score.standard)?.name}</td>
                    <td>{score.date && formatDate(score.date)}</td>
                    <td className="icon-cell">
                      {score?.videoLink && (
                        <a href={score.videoLink} target="_blank" rel="noopener noreferrer">
                          <Icon icon="Video" />
                        </a>
                      )}
                    </td>
                    <td className="icon-cell">
                      {score?.ghostLink && (
                        <a href={score.ghostLink} target="_blank" rel="noopener noreferrer">
                          <Icon icon="Ghost" />
                        </a>
                      )}
                    </td>
                    <td className="icon-cell">
                      {score?.comment && (
                        <Tooltip text={score.comment}>
                          <Icon icon="Comment" />
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default TrackChartPage;
