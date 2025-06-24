import { useContext } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../widgets/Deferred";
import { LapModeRadio } from "../widgets/LapModeSelect";
import { useApiArray } from "../../hooks/ApiHook";
import { formatTime } from "../../utils/Formatters";
import { MetadataContext } from "../../utils/Metadata";
import { integerOr } from "../../utils/Numbers";
import { UserContext } from "../../utils/User";
import ComplexRegionSelection from "../widgets/RegionSelection";
import { getCategorySiteHue, getHighestValid } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import { useCategoryParam, useLapModeParam } from "../../utils/SearchParams";
import { I18nContext, translate, translateTrack } from "../../utils/i18n/i18n";
import { SettingsContext } from "../../utils/Settings";
import PlayerMention from "../widgets/PlayerMention";
import { CategoryRadio } from "../widgets/CategorySelect";
import { CupsListNoTracks } from "../widgets/CupsList";
import { Region, RegionType, Score, LapModeEnum, CategoryEnum } from "../../api";

export const TrackTopsHomePage = () => {
  const metadata = useContext(MetadataContext);

  return (
    <Deferred isWaiting={metadata.isLoading}>
      {metadata.regions && metadata.cups && (
        <Navigate
          replace
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

  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { lapMode, setLapMode } = useLapModeParam(searchParams);

  const metadata = useContext(MetadataContext);
  const { settings } = useContext(SettingsContext);
  const { lang } = useContext(I18nContext);

  const region =
    metadata.regions.find((r) => r.code.toLowerCase() === regionCode && r.isRanked) ??
    Region.worldDefault();
  const cup = metadata.cups?.find((c) => c.id === cupId);

  const { user } = useContext(UserContext);

  const tops = useApiArray(
    (params) =>
      Score.getChart(
        params.trackId,
        category,
        lapMode === LapModeEnum.Lap,
        region.id,
        undefined,
        10,
      ),
    4,
    cup?.trackIds.map((track) => ({
      trackId: track,
    })) || [],
    [category, cup, lapMode, region, metadata.isLoading],
    "trackTop10s",
  );

  const siteHue = getCategorySiteHue(category, settings);

  return (
    <>
      {metadata.regions && !region && <Navigate to={resolvePage(Pages.TrackTopsHome)} />}
      {metadata.cups && !metadata.cups.find((cup) => cup.id === cupId) && (
        <Navigate to={resolvePage(Pages.TrackTopsHome)} />
      )}
      <Deferred isWaiting={metadata.isLoading}>
        <OverwriteColor hue={siteHue}>
          <ComplexRegionSelection
            region={region}
            cupId={cupId}
            currentLap={lapMode}
            currentCategory={category}
          />
          <div className="module-row wrap">
            <CategoryRadio value={category} onChange={setCategory} />
            <LapModeRadio value={lapMode} onChange={setLapMode} />
          </div>
          <CupsListNoTracks
            currentCup={cup?.id ?? 0}
            currentRegion={region}
            currentLap={lapMode}
            currentCategory={category}
          />
          <div
            className="module-row"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, max(340px, 100%/5)), 1fr))",
            }}
          >
            {cup &&
              metadata.tracks
                ?.filter((track) => cup.trackIds.includes(track.id))
                .map((track, index) => {
                  const trackCategory = getHighestValid(category, track?.categories ?? []);
                  return (
                    <div key={track.id}>
                      <h1>{translateTrack(track, lang)}</h1>
                      <div className="module">
                        <Deferred isWaiting={tops[index].isLoading}>
                          <table>
                            <tbody className="table-hover-rows">
                              {tops[index].data?.map((score) => (
                                <tr
                                  key={score.id}
                                  className={
                                    user && score.player.id === user.playerId ? "highlighted" : ""
                                  }
                                >
                                  <td>{score.rank}</td>
                                  <td>
                                    <PlayerMention
                                      playerOrId={score.player}
                                      regionOrId={score.player.regionId ?? undefined}
                                      xxFlag
                                      showRegFlagRegardless={
                                        region.regionType === RegionType.Country ||
                                        region.regionType === RegionType.Subnational ||
                                        region.regionType === RegionType.SubnationalGroup
                                      }
                                    />
                                  </td>
                                  <td>{formatTime(score.value)}</td>
                                </tr>
                              ))}
                              <tr>
                                <th colSpan={3}>
                                  <Link
                                    to={resolvePage(
                                      Pages.TrackChart,
                                      {
                                        id: track.id,
                                      },
                                      {
                                        cat:
                                          trackCategory !== CategoryEnum.NonShortcut
                                            ? trackCategory
                                            : null,
                                        lap: lapMode !== LapModeEnum.Course ? lapMode : null,
                                        reg: region?.id !== 1 ? region?.code.toLowerCase() : null,
                                      },
                                    )}
                                  >
                                    {translate("trackTopsPageViewFullLeaderboards", lang)}
                                  </Link>
                                </th>
                              </tr>
                            </tbody>
                          </table>
                        </Deferred>
                      </div>
                    </div>
                  );
                })}
          </div>
        </OverwriteColor>
      </Deferred>
    </>
  );
};

export default TrackTopsPage;
