import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../widgets/Deferred";
import { CategorySelect, FlagIcon, Icon, Tooltip } from "../widgets";
import OverwriteColor from "../widgets/OverwriteColor";
import api from "../../api";
import { useApi } from "../../hooks";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import { formatDate, formatTime } from "../../utils/Formatters";
import { useCategoryParam, useRegionParam } from "../../utils/SearchParams";
import { UserContext } from "../../utils/User";
import { getRegionById, getStandardLevel, MetadataContext } from "../../utils/Metadata";
import RegionSelectionDropdown from "../widgets/RegionDropdown";
import { I18nContext, TranslationKey } from "../../utils/i18n/i18n";
import { SettingsContext } from "../../utils/Settings";

const TrackRecordsPage = () => {
  const searchParams = useSearchParams();

  const { category, setCategory } = useCategoryParam(searchParams);
  const { region, setRegion } = useRegionParam(searchParams);

  const metadata = useContext(MetadataContext);
  const { settings } = useContext(SettingsContext);
  const { translations, lang } = useContext(I18nContext);

  const { user } = useContext(UserContext);

  const { isLoading, data: scores } = useApi(
    () => api.timetrialsRecordsList({ category, region: region.id }),
    [category, region, metadata],
    [{ variable: metadata.regions.length, defaultValue: 1 }],
  );

  const siteHue = getCategorySiteHue(category, settings);

  return (
    <>
      {/* This heading will eventually have an i18n key for literally every region indexed */}
      <h1>{translations[`constantRegionRecord${region.code}` as TranslationKey][lang]}</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect value={category} onChange={setCategory} />
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
                  <th>{translations.trackRecordsPageTrackCol[lang]}</th>
                  <th>{translations.trackRecordsPagePlayerCol[lang]}</th>
                  <th>{translations.trackRecordsPageCourseCol[lang]}</th>
                  <th>{translations.trackRecordsPageLapCol[lang]}</th>
                  <th>{translations.trackRecordsPageStandardCol[lang]}</th>
                  <th>{translations.trackRecordsPageDateCol[lang]}</th>
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
                              {
                                translations[
                                  `constantTrackName${track.abbr.toUpperCase()}` as TranslationKey
                                ][lang]
                              }
                            </Link>
                          </td>
                        )}
                        <td>
                          {score ? (
                            <>
                              <FlagIcon
                                showRegFlagRegardless={
                                  region.type === "country" ||
                                  region.type === "subnational" ||
                                  region.type === "subnational_group"
                                }
                                region={getRegionById(metadata, score.player.region || 0)}
                              />
                              <Link to={resolvePage(Pages.PlayerProfile, { id: score?.player.id })}>
                                {score.player.alias ?? score.player.name}
                              </Link>
                            </>
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
