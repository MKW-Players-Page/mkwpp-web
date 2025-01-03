import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../widgets/Deferred";
import { Icon, Tooltip } from "../widgets";
import OverwriteColor from "../widgets/OverwriteColor";
import api from "../../api";
import { useApi } from "../../hooks";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import { formatDate, formatTime } from "../../utils/Formatters";
import { useCategoryParam, useRegionParam } from "../../utils/SearchParams";
import { UserContext } from "../../utils/User";
import { getStandardLevel, MetadataContext } from "../../utils/Metadata";
import RegionSelectionDropdown from "../widgets/RegionDropdown";
import { I18nContext, translate, translateRegionName, translateTrack } from "../../utils/i18n/i18n";
import { SettingsContext } from "../../utils/Settings";
import PlayerMention from "../widgets/PlayerMention";
import { CategoryRadio } from "../widgets/CategorySelect";

const TrackRecordsPage = () => {
  const searchParams = useSearchParams();

  const { category, setCategory } = useCategoryParam(searchParams);
  const { region, setRegion } = useRegionParam(searchParams);

  const metadata = useContext(MetadataContext);
  const { settings } = useContext(SettingsContext);
  const { lang } = useContext(I18nContext);

  const { user } = useContext(UserContext);

  const { isLoading, data: scores } = useApi(
    () => api.timetrialsRecordsList({ category, region: region.id }),
    [category, region, metadata],
    "trackRecords",
    [{ variable: metadata.regions.length, defaultValue: 1 }],
  );

  const siteHue = getCategorySiteHue(category, settings);

  return (
    <>
      <h1>{translateRegionName(region, lang, "Record")}</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategoryRadio value={category} onChange={setCategory} />
          <RegionSelectionDropdown
            onePlayerMin={false}
            twoPlayerMin={true}
            ranked={false}
            value={region}
            setValue={setRegion}
          />
        </div>
        <div className="module">
          <Deferred isWaiting={isLoading || metadata.isLoading}>
            <table>
              <thead>
                <tr>
                  <th>{translate("trackRecordsPageTrackCol", lang)}</th>
                  <th>{translate("trackRecordsPagePlayerCol", lang)}</th>
                  <th>{translate("trackRecordsPageCourseCol", lang)}</th>
                  <th>{translate("trackRecordsPageLapCol", lang)}</th>
                  <th>{translate("trackRecordsPageStandardCol", lang)}</th>
                  <th>{translate("trackRecordsPageDateCol", lang)}</th>
                  <th className="icon-cell" />
                  <th className="icon-cell" />
                  <th className="icon-cell" />
                </tr>
              </thead>
              <tbody className="table-hover-rows">
                {metadata.tracks?.map((track) =>
                  [false, true].map((isLap) => {
                    const score = scores?.find(
                      (score) => score.track === track.id && score.isLap === isLap,
                    );
                    return (
                      <tr
                        key={`${isLap ? "l" : "c"}${track.id}`}
                        className={user && score?.player.id === user.player ? "highlighted" : ""}
                      >
                        {!isLap && (
                          <td rowSpan={2}>
                            <Link to={resolvePage(Pages.TrackChart, { id: track.id })}>
                              {translateTrack(track, lang)}
                            </Link>
                          </td>
                        )}
                        <td>
                          {score ? (
                            <PlayerMention
                              precalcPlayer={score.player}
                              precalcRegionId={score.player.region ?? undefined}
                              xxFlag={true}
                              showRegFlagRegardless={
                                region.type === "country" ||
                                region.type === "subnational" ||
                                region.type === "subnational_group"
                              }
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        {isLap && <td />}
                        <td className={score?.category !== category ? "fallthrough" : ""}>
                          {score ? formatTime(score.value) : "-"}
                        </td>
                        {!isLap && <td />}
                        <td>{score ? getStandardLevel(metadata, score.standard)?.name : "-"}</td>
                        <td>{score?.date ? formatDate(score.date) : "-"}</td>
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
                    );
                  }),
                )}
              </tbody>
            </table>
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default TrackRecordsPage;
