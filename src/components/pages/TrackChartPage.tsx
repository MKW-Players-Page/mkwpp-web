import { useContext, useEffect, useRef } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../global/Deferred";
import { CategorySelect, FlagIcon, Icon, LapModeSelect, Tooltip } from "../widgets";
import api from "../../api";
import { CategoryEnum, TimetrialsTracksScoresListLapModeEnum } from "../../api/generated";
import { useApi } from "../../hooks";
import { formatDate, formatTime } from "../../utils/Formatters";
import { getRegionById, getStandardLevel, MetadataContext } from "../../utils/Metadata";
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
import { LapModeEnum } from "../widgets/LapModeSelect";
import { I18nContext, TranslationKey } from "../../utils/i18n/i18n";

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
  const { translations, lang } = useContext(I18nContext);

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
    [category, lapMode, region, id],
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

  const siteHue = getCategorySiteHue(category);

  return (
    <>
      {/* Redirect to courses list if id is invalid or does not exist. */}
      {metadata.tracks && !track && <Navigate to={resolvePage(Pages.TrackList)} />}
      <Link to={resolvePage(Pages.TrackList)}>{"« Track List"}</Link>
      <div
        style={{ justifyContent: "space-between" } as React.CSSProperties}
        className="module-row"
      >
        <div style={{ width: "200px" } as React.CSSProperties}>
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
              {"« " +
                translations[
                  `constantTrackName${prevTrack?.abbr.toUpperCase() ?? "LC"}` as TranslationKey
                ][lang]}
            </Link>
          ) : (
            <></>
          )}
        </div>
        <h1>
          {
            translations[`constantTrackName${track?.abbr.toUpperCase() ?? "LC"}` as TranslationKey][
              lang
            ]
          }
        </h1>
        <div style={{ width: "200px", textAlign: "right" } as React.CSSProperties}>
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
              {translations[
                `constantTrackName${nextTrack?.abbr.toUpperCase() ?? "LC"}` as TranslationKey
              ][lang] + " »"}
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect options={track?.categories} value={category} onChange={setCategory} />
          <LapModeSelect value={lapMode} onChange={setLapMode} />
          <RegionSelectionDropdown onePlayerMin={true} twoPlayerMin={true} ranked={false} value={region} setValue={setRegion} />
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
                {scores?.map((score, idx, arr) => (
                  <>
                    {highlight &&
                    score.value > highlight &&
                    (arr[idx - 1] === undefined || arr[idx - 1].value < highlight) ? (
                      <>
                        <tr ref={highlightElement} key={highlight} className="highlighted">
                          <td />
                          <td>{translations.genericRankingsYourHighlightedValue[lang]}</td>
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
                        <FlagIcon region={getRegionById(metadata, score.player.region ?? 0)} />
                        <Link
                          to={resolvePage(Pages.PlayerProfile, {
                            id: score.player.id,
                          })}
                        >
                          {score.player.alias ?? score.player.name}
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
                  </>
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
