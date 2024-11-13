import { useContext } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../widgets/Deferred";
import { CategorySelect, FlagIcon, Icon, LapModeSelect, Tooltip } from "../widgets";
import api, { CategoryEnum, Region, Score } from "../../api";
import { useApi } from "../../hooks/ApiHook";
import { formatDate, formatTime } from "../../utils/Formatters";
import {
  getRegionById,
  getRegionNameFull,
  getStandardLevel,
  MetadataContext,
} from "../../utils/Metadata";
import { integerOr } from "../../utils/Numbers";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import Dropdown, { DropdownData } from "../widgets/Dropdown";
import Flag, { Flags } from "../widgets/Flags";
import {
  paramReplace,
  SearchParams,
  useCategoryParam,
  useLapModeParam,
  useRegionParam,
} from "../../utils/SearchParams";
import { LapModeEnum } from "../widgets/LapModeSelect";
import { I18nContext, TranslationKey } from "../../utils/i18n/i18n";
import { SettingsContext } from "../../utils/Settings";

interface ScoreDoubled extends Score {
  precedesRepeat: boolean;
  repeat: boolean;
}

type SortType =
  | "trackAsc"
  | "trackDesc"
  | "lapAsc"
  | "lapDesc"
  | "timeAsc"
  | "timeDesc"
  | "rankAsc"
  | "rankDesc"
  | "stdAsc"
  | "stdDesc"
  | "prwrAsc"
  | "prwrDesc"
  | "dateAsc"
  | "dateDesc";

const Sorting: Record<string, any> = {
  trackAsc: (a: Score, b: Score) => a.track - b.track,
  trackDesc: (a: Score, b: Score) => b.track - a.track,
  lapAsc: (a: Score, b: Score) => (a.isLap ? 1 : 0) - (b.isLap ? 1 : 0),
  lapDesc: (a: Score, b: Score) => (b.isLap ? 1 : 0) - (a.isLap ? 1 : 0),
  rankAsc: (a: Score, b: Score) => a.rank - b.rank,
  rankDesc: (a: Score, b: Score) => b.rank - a.rank,
  timeAsc: (a: Score, b: Score) => a.value - b.value,
  timeDesc: (a: Score, b: Score) => b.value - a.value,
  stdAsc: (a: Score, b: Score) => a.standard - b.standard,
  stdDesc: (a: Score, b: Score) => b.standard - a.standard,
  prwrAsc: (a: Score, b: Score) => a.recordRatio - b.recordRatio,
  prwrDesc: (a: Score, b: Score) => b.recordRatio - a.recordRatio,
  dateAsc: (a: Score, b: Score) =>
    (a.date ? a.date.valueOf() : -1000) - (b.date ? b.date.valueOf() : -1000),
  dateDesc: (a: Score, b: Score) =>
    (b.date ? b.date.valueOf() : -1000) - (a.date ? a.date.valueOf() : -1000),
};

const Filtering = {
  flapOnly: (a: Score) => a.isLap,
  courseOnly: (a: Score) => !a.isLap,
  overall: (a: Score) => true,
};

const useProfileTableSortParam = (searchParams: SearchParams) => {
  const sortType: SortType =
    (Object.keys(Sorting).find((key) => key === searchParams[0].get("sort")) as
      | SortType
      | undefined) ?? "trackAsc";
  return {
    sortType,
    setSortType: (sortType: SortType) => {
      const sort = sortType === "trackAsc" ? undefined : sortType;
      searchParams[1]((prev) => paramReplace(prev, "sort", sort));
    },
  };
};

interface ThSortProps {
  children: string;
  states: SortType[];
  sortType: SortType;
  setSortType: (sortType: SortType) => void;
}

const ThSort = ({ children, states, sortType, setSortType }: ThSortProps) => {
  const stateIndex = states.findIndex((r) => r === sortType);
  const setTo = stateIndex < 0 ? 1 : states.length === stateIndex + 1 ? 0 : stateIndex + 1;
  return (
    <th
      style={{ cursor: "pointer" } as React.CSSProperties}
      onClick={() => {
        setSortType(states[setTo]);
      }}
    >
      {children}
    </th>
  );
};

const PlayerProfilePage = () => {
  const { id: idStr } = useParams();
  const id = Math.max(integerOr(idStr, 0), 0);

  const metadata = useContext(MetadataContext);
  const { translations, lang } = useContext(I18nContext);
  const { settings } = useContext(SettingsContext);

  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, false);
  const { region, setRegion } = useRegionParam(searchParams);
  const { sortType, setSortType } = useProfileTableSortParam(searchParams);

  const {
    isLoading: playerLoading,
    data: player,
    error: playerError,
  } = useApi(() => api.timetrialsPlayersRetrieve({ id }), [id]);

  const { isLoading: statsLoading, data: stats } = useApi(
    () =>
      api.timetrialsPlayersStatsRetrieve({
        id,
        category,
        lapMode,
        region: region?.id ?? 1,
      }),
    [id, category, lapMode, region],
  );

  const { isLoading: scoresLoading, data: scores } = useApi(
    () => api.timetrialsPlayersScoresList({ id, category, region: region?.id ?? 1 }),
    [id, category, region],
  );

  let sortedScores = scores
    ?.filter(
      lapMode === LapModeEnum.Overall
        ? Filtering.overall
        : lapMode === LapModeEnum.Course
          ? Filtering.courseOnly
          : Filtering.flapOnly,
    )
    .sort(Sorting.lapAsc)
    .sort(Sorting[sortType])
    .map((score, index, arr) => {
      (score as ScoreDoubled).repeat = score.track === arr[index - 1]?.track;
      (score as ScoreDoubled).precedesRepeat = score.track === arr[index + 1]?.track;
      return score as ScoreDoubled;
    });

  const siteHue = getCategorySiteHue(category, settings);

  const getAllRegions = (arr: Region[], startId: number): Region[] => {
    let region = getRegionById(metadata, startId);
    if (region === undefined) return arr;
    arr.push(region);
    if (region.parent === undefined || region.parent === null) return arr;
    return getAllRegions(arr, region.parent);
  };

  const rankingsRedirectParams = {
    reg: region.id !== 1 ? region.code.toLowerCase() : null,
    cat: category !== CategoryEnum.NonShortcut ? category : null,
    lap: lapMode !== LapModeEnum.Overall ? lapMode : null,
  };

  return (
    <>
      {/* Redirect to player list if id is invalid or does not exist. */}
      {playerError && <Navigate to={resolvePage(Pages.PlayerList)} />}
      <h1>
        <FlagIcon
          showRegFlagRegardless={
            region.type === "country" ||
            region.type === "subnational" ||
            region.type === "subnational_group"
          }
          region={getRegionById(metadata, player?.region ?? 0)}
        />
        {player?.name ?? <>&nbsp;</>}
      </h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect value={category} onChange={setCategory} />
          <LapModeSelect includeOverall value={lapMode} onChange={setLapMode} />
          {player?.region !== undefined && player?.region !== null && player?.region !== 1 ? (
            <Dropdown
              data={
                {
                  type: "Normal",
                  defaultItemSet: 0,
                  value: region,
                  valueSetter: setRegion,
                  data: [
                    {
                      id: 0,
                      children: getAllRegions([], player?.region ?? 1)
                        .reverse()
                        .map((region) => {
                          return {
                            type: "DropdownItemData",
                            element: {
                              text: translations[`constantRegion${region.code}` as TranslationKey][
                                lang
                              ],
                              value: region,
                              rightIcon: (
                                <Flag flag={region.code.toLowerCase() as keyof typeof Flags} />
                              ),
                            },
                          };
                        }),
                    },
                  ],
                } as DropdownData
              }
            />
          ) : (
            <></>
          )}
        </div>
        <div className="module-row ">
          <div className="module">
            <Deferred isWaiting={playerLoading}>
              <table>
                <tbody>
                  <tr>
                    <td>{translations.playerProfilePageLocation[lang]}</td>
                    <td>{getRegionNameFull(metadata, translations, lang, player?.region ?? 0)}</td>
                  </tr>
                  <tr>
                    <td>{translations.playerProfilePageAlias[lang]}</td>
                    <td>{player?.alias}</td>
                  </tr>
                  <tr>
                    <td>{translations.playerProfilePageDateJoined[lang]}</td>
                    <td>{player?.joinedDate && formatDate(player.joinedDate)}</td>
                  </tr>
                  <tr>
                    <td>{translations.playerProfilePageLastActivity[lang]}</td>
                    <td>{player?.lastActivity && formatDate(player.lastActivity)}</td>
                  </tr>
                </tbody>
              </table>
            </Deferred>
          </div>
          <div className="module">
            <Deferred isWaiting={statsLoading}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <Link
                        to={resolvePage(Pages.RankingsAverageFinish, {}, rankingsRedirectParams)}
                      >
                        {translations.playerProfilePageAverageFinishTitle[lang]}
                      </Link>
                    </td>
                    <td>
                      {stats && stats.scoreCount > 0 ? (
                        <Link
                          to={resolvePage(
                            Pages.RankingsAverageFinish,
                            {},
                            { ...rankingsRedirectParams, hl: stats.totalRank / stats.scoreCount },
                          )}
                        >
                          {stats.totalRank / stats.scoreCount}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link
                        to={resolvePage(Pages.RankingsAverageStandard, {}, rankingsRedirectParams)}
                      >
                        {translations.playerProfilePageAverageStandardTitle[lang]}
                      </Link>
                    </td>
                    <td>
                      {stats && stats.scoreCount > 0 ? (
                        <Link
                          to={resolvePage(
                            Pages.RankingsAverageStandard,
                            {},
                            {
                              ...rankingsRedirectParams,
                              hl: stats.totalStandard / stats.scoreCount,
                            },
                          )}
                        >
                          {stats.totalStandard / stats.scoreCount}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link
                        to={resolvePage(
                          Pages.RankingsAverageRecordRatio,
                          {},
                          rankingsRedirectParams,
                        )}
                      >
                        {translations.playerProfilePageAverageRecordRatioTitle[lang]}
                      </Link>
                    </td>
                    <td>
                      {stats && stats.scoreCount > 0 ? (
                        <Link
                          to={resolvePage(
                            Pages.RankingsAverageRecordRatio,
                            {},
                            {
                              ...rankingsRedirectParams,
                              hl: ((stats.totalRecordRatio / stats.scoreCount) * 100).toFixed(4),
                            },
                          )}
                        >
                          {((stats.totalRecordRatio / stats.scoreCount) * 100).toFixed(4) + "%"}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link to={resolvePage(Pages.RankingsTotalTime, {}, rankingsRedirectParams)}>
                        {translations.playerProfilePageTotalTimeTitle[lang]}
                      </Link>
                    </td>
                    <td>
                      {stats ? (
                        <Link
                          to={resolvePage(
                            Pages.RankingsTotalTime,
                            {},
                            {
                              ...rankingsRedirectParams,
                              hl: stats.totalScore,
                            },
                          )}
                        >
                          {formatTime(stats.totalScore)}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Deferred>
          </div>
          <div className="module">
            <Deferred isWaiting={playerLoading}>
              {/* Temporary until better solution implemented, like a popup dialog. */}
              <div className="module-content" style={{ overflowY: "scroll", maxHeight: 128 }}>
                <p>
                  {player?.bio ? (
                    player.bio.split("\n").map((line: string) => (
                      <>
                        {line}
                        <br />
                      </>
                    ))
                  ) : (
                    <i>{translations.playerProfilePageDefaultBio[lang]}</i>
                  )}
                </p>
              </div>
            </Deferred>
          </div>
        </div>
        <div className="module">
          <Deferred isWaiting={metadata.isLoading || scoresLoading}>
            <table>
              <thead>
                <tr>
                  <th
                    style={{ cursor: "pointer" } as React.CSSProperties}
                    onClick={() => {
                      setSortType("trackAsc");
                    }}
                  >
                    {translations.playerProfilePageTrackColumn[lang]}
                  </th>
                  {lapMode === LapModeEnum.Overall ? (
                    <>
                      <ThSort
                        states={["trackAsc", "timeAsc", "timeDesc"]}
                        sortType={sortType}
                        setSortType={setSortType}
                      >
                        {translations.playerProfilePageCourseTimeColumn[lang]}
                      </ThSort>
                      <ThSort
                        states={["trackAsc", "timeAsc", "timeDesc"]}
                        sortType={sortType}
                        setSortType={setSortType}
                      >
                        {translations.playerProfilePageLapTimeColumn[lang]}
                      </ThSort>
                    </>
                  ) : (
                    <ThSort
                      states={["trackAsc", "timeAsc", "timeDesc"]}
                      sortType={sortType}
                      setSortType={setSortType}
                    >
                      {translations.playerProfilePageTimeColumn[lang]}
                    </ThSort>
                  )}
                  <ThSort
                    states={["trackAsc", "rankAsc", "rankDesc"]}
                    sortType={sortType}
                    setSortType={setSortType}
                  >
                    {translations.playerProfilePageRankColumn[lang]}
                  </ThSort>
                  <ThSort
                    states={["trackAsc", "stdAsc", "stdDesc"]}
                    sortType={sortType}
                    setSortType={setSortType}
                  >
                    {translations.playerProfilePageStandardColumn[lang]}
                  </ThSort>
                  <ThSort
                    states={["trackAsc", "prwrDesc", "prwrAsc"]}
                    sortType={sortType}
                    setSortType={setSortType}
                  >
                    {translations.playerProfilePagePRWRColumn[lang]}
                  </ThSort>
                  <ThSort
                    states={["trackAsc", "dateAsc", "dateDesc"]}
                    sortType={sortType}
                    setSortType={setSortType}
                  >
                    {translations.playerProfilePageDateColumn[lang]}
                  </ThSort>
                  <th className="icon-cell" />
                  <th className="icon-cell" />
                  <th className="icon-cell" />
                </tr>
              </thead>
              <tbody className="table-hover-rows">
                {sortedScores?.map((score) => {
                  const track = metadata.tracks?.find((r) => r.id === score.track);
                  return (
                    <tr key={`${score.isLap ? "l" : "c"}${score.track}`}>
                      {score.precedesRepeat ? (
                        <td rowSpan={2}>
                          <Link
                            to={resolvePage(
                              Pages.TrackChart,
                              { id: score.track },
                              {
                                reg: region.id !== 1 ? region.code.toLowerCase() : null,
                                cat: category !== CategoryEnum.NonShortcut ? category : null,
                                lap: lapMode === LapModeEnum.Lap ? lapMode : null,
                              },
                            )}
                          >
                            {
                              translations[
                                `constantTrackName${track?.abbr.toUpperCase() ?? "LC"}` as TranslationKey
                              ][lang]
                            }
                          </Link>
                        </td>
                      ) : score.repeat ? (
                        <></>
                      ) : (
                        <td>
                          <Link
                            to={resolvePage(
                              Pages.TrackChart,
                              { id: score.track },
                              {
                                reg: region.id !== 1 ? region.code.toLowerCase() : null,
                                cat: category !== CategoryEnum.NonShortcut ? category : null,
                                lap: lapMode === LapModeEnum.Lap ? lapMode : null,
                              },
                            )}
                          >
                            {
                              translations[
                                `constantTrackName${track?.abbr.toUpperCase() ?? "LC"}` as TranslationKey
                              ][lang]
                            }
                          </Link>
                        </td>
                      )}
                      {score.isLap && lapMode === LapModeEnum.Overall && <td />}
                      <td className={score?.category !== category ? "fallthrough" : ""}>
                        <Link
                          to={resolvePage(
                            Pages.TrackChart,
                            { id: score.track },
                            {
                              reg: region.id !== 1 ? region.code.toLowerCase() : null,
                              cat: category !== CategoryEnum.NonShortcut ? category : null,
                              lap: score.isLap ? LapModeEnum.Lap : null,
                              hl: score.value,
                            },
                          )}
                        >
                          {formatTime(score.value)}
                        </Link>
                      </td>
                      {!score.isLap && lapMode === LapModeEnum.Overall && <td />}
                      <td>{score.rank}</td>
                      <td>{getStandardLevel(metadata, score.standard)?.name}</td>
                      <td>{(score.recordRatio * 100).toFixed(2) + "%"}</td>
                      <td>{score.date ? formatDate(score.date) : "????-??-??"}</td>
                      <td className="icon-cell">
                        {score.videoLink && (
                          <a href={score.videoLink} target="_blank" rel="noopener noreferrer">
                            <Icon icon="Video" />
                          </a>
                        )}
                      </td>
                      <td className="icon-cell">
                        {score.ghostLink && (
                          <a href={score.ghostLink} target="_blank" rel="noopener noreferrer">
                            <Icon icon="Ghost" />
                          </a>
                        )}
                      </td>
                      <td className="icon-cell">
                        {score.comment && (
                          <Tooltip text={score.comment}>
                            <Icon icon="Comment" />
                          </Tooltip>
                        )}
                      </td>
                    </tr>
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

export default PlayerProfilePage;
