import { useContext, useEffect, useRef } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../widgets/Deferred";
import { Icon, Tooltip } from "../widgets";
import api from "../../api";
import { CategoryEnum, TimetrialsTracksScoresListLapModeEnum } from "../../api/generated";
import { useApi } from "../../hooks";
import { formatDate, formatTime } from "../../utils/Formatters";
import { getStandardLevel, MetadataContext } from "../../utils/Metadata";
import { integerOr } from "../../utils/Numbers";
import { UserContext } from "../../utils/User";
import { getCategorySiteHue, getHighestValid } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import RegionSelectionDropdown from "../widgets/RegionDropdown";
import {
  useCategoryParam,
  useLapModeParam,
  useRegionParam,
  useRowHighlightParam,
} from "../../utils/SearchParams";
import { LapModeEnum, LapModeRadio } from "../widgets/LapModeSelect";
import { I18nContext, translate, translateTrack } from "../../utils/i18n/i18n";
import { SettingsContext } from "../../utils/Settings";
import PlayerMention from "../widgets/PlayerMention";
import { CategoryRadio } from "../widgets/CategorySelect";
import { useInfiniteScroll } from "../../hooks/ScrollHook";

const TrackChartPage = () => {
  const { id: idStr } = useParams();
  const id = Math.max(integerOr(idStr, 0), 0);

  const { user } = useContext(UserContext);

  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams, ["hl"]);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, true, ["hl"]);
  const { region, setRegion } = useRegionParam(searchParams);
  const highlight = useRowHighlightParam(searchParams).highlight;

  const metadata = useContext(MetadataContext);
  const { settings } = useContext(SettingsContext);
  const { lang } = useContext(I18nContext);

  let track,
    prevTrack,
    nextTrack = undefined;
  for (const t of metadata.tracks ?? []) {
    if (t.id === id) track = t;
    if (t.id === id - 1) prevTrack = t;
    if (t.id === id + 1) nextTrack = t;
  }

  const queryParamsBaseForRedirect = {
    reg: region.id !== 1 ? region.code.toLowerCase() : null,
    lap: lapMode !== LapModeEnum.Course ? lapMode : null,
  };
  const prevTrackCat = getHighestValid(category, prevTrack?.categories ?? []);
  const nextTrackCat = getHighestValid(category, nextTrack?.categories ?? []);

  const { isLoading, data: scores } = useApi(
    () =>
      api.timetrialsTracksScoresList({
        id,
        category,
        lapMode: lapMode as TimetrialsTracksScoresListLapModeEnum,
        region: region.id,
      }),
    [category, lapMode, region, id, metadata],
    "trackCharts",
    [{ variable: metadata.regions.length, defaultValue: 1 }],
  );

  const highlightElement = useRef(null);
  useEffect(() => {
    if (highlightElement !== null) {
      (highlightElement.current as unknown as HTMLDivElement)?.scrollIntoView({
        inline: "center",
        block: "center",
      });
    }
  }, [highlightElement, isLoading, metadata.isLoading]);

  const [sliceStart, sliceEnd, tbodyElement] = useInfiniteScroll(35, scores?.length ?? 0, [
    isLoading,
  ]);

  const siteHue = getCategorySiteHue(category, settings);

  return (
    <>
      {/* Redirect to courses list if id is invalid or does not exist. */}
      {metadata.tracks && !track && <Navigate to={resolvePage(Pages.TrackList)} />}
      <Link to={resolvePage(Pages.TrackList)}>
        {translate("trackChartPageTrackListButton", lang)}
      </Link>
      <div style={{ justifyContent: "space-between" }} className="module-row">
        <div style={{ width: "200px" }}>
          {prevTrack !== undefined ? (
            <Link
              to={resolvePage(
                Pages.TrackChart,
                { id: prevTrack.id },
                {
                  ...queryParamsBaseForRedirect,
                  cat: prevTrackCat !== CategoryEnum.NonShortcut ? prevTrackCat : null,
                },
              )}
            >
              {"« " + translateTrack(prevTrack, lang)}
            </Link>
          ) : (
            <></>
          )}
        </div>
        <h1>{translateTrack(track, lang)}</h1>
        <div style={{ width: "200px", textAlign: "right" }}>
          {nextTrack !== undefined ? (
            <Link
              to={resolvePage(
                Pages.TrackChart,
                { id: nextTrack.id },
                {
                  ...queryParamsBaseForRedirect,
                  cat: nextTrackCat !== CategoryEnum.NonShortcut ? nextTrackCat : null,
                },
              )}
            >
              {translateTrack(nextTrack, lang) + " »"}
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
      <OverwriteColor hue={siteHue}>
        <div className="module-row wrap">
          <CategoryRadio options={track?.categories} value={category} onChange={setCategory} />
          <LapModeRadio value={lapMode} onChange={setLapMode} />
          <RegionSelectionDropdown
            onePlayerMin={true}
            twoPlayerMin={true}
            ranked={false}
            value={region}
            setValue={setRegion}
          />
        </div>
        <div className="module">
          <Deferred isWaiting={metadata.isLoading || isLoading}>
            <table>
              <thead>
                <tr>
                  <th>{translate("trackChartPageRankCol", lang)}</th>
                  <th>{translate("trackChartPagePlayerCol", lang)}</th>
                  <th>{translate("trackChartPageTimeCol", lang)}</th>
                  <th>{translate("trackChartPageStandardCol", lang)}</th>
                  <th>{translate("trackChartPageDateCol", lang)}</th>
                  <th className="icon-cell" />
                  <th className="icon-cell" />
                  <th className="icon-cell" />
                </tr>
              </thead>
              <tbody ref={tbodyElement} className="table-hover-rows">
                {scores?.map((score, idx, arr) => {
                  if (idx < sliceStart || idx >= sliceEnd) return <></>;
                  return (
                    <>
                      {highlight &&
                      score.value > highlight &&
                      (arr[idx - 1] === undefined || arr[idx - 1].value < highlight) ? (
                        <>
                          <tr ref={highlightElement} key={highlight} className="highlighted">
                            <td />
                            <td>{translate("genericRankingsYourHighlightedValue", lang)}</td>
                            <td>{formatTime(highlight)}</td>
                            <td />
                            <td />
                            <td />
                            <td />
                            <td />
                          </tr>
                        </>
                      ) : (
                        <></>
                      )}
                      <tr
                        key={score.id}
                        className={
                          score.player.id === user?.player || score.value === highlight
                            ? "highlighted"
                            : ""
                        }
                        ref={score.value === highlight ? highlightElement : undefined}
                      >
                        <td>{score.rank}</td>
                        <td>
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
                    </>
                  );
                })}
              </tbody>
            </table>
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default TrackChartPage;
