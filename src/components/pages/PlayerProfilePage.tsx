import { useContext } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../widgets/Deferred";
import { FlagIcon, Icon, Tooltip } from "../widgets";
import api, { CategoryEnum, Region } from "../../api";
import { useApi } from "../../hooks/ApiHook";
import { formatDate, formatTime } from "../../utils/Formatters";
import { getRegionById, getStandardLevel, MetadataContext } from "../../utils/Metadata";
import { integerOr } from "../../utils/Numbers";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import Dropdown, { DropdownData } from "../widgets/Dropdown";
import { useCategoryParam, useLapModeParam, useRegionParam } from "../../utils/SearchParams";
import { LapModeEnum, LapModeRadio } from "../widgets/LapModeSelect";
import {
  I18nContext,
  translate,
  translateRegionName,
  translateRegionNameFull,
  translateStandardName,
} from "../../utils/i18n/i18n";
import { SettingsContext } from "../../utils/Settings";
import { RankingsMetrics } from "./RankingsPage";
import { CategoryRadio } from "../widgets/CategorySelect";
import ArrayTable, { ArrayTableCellData, ArrayTableData, Sort } from "../widgets/Table";
import { SmallBigDateFormat, SmallBigTrackFormat } from "../widgets/SmallBigFormat";

const PlayerProfilePage = () => {
  const { id: idStr } = useParams();
  const id = Math.max(integerOr(idStr, 0), 0);

  const metadata = useContext(MetadataContext);
  const { lang } = useContext(I18nContext);
  const { settings } = useContext(SettingsContext);

  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, false);
  const { region, setRegion } = useRegionParam(searchParams);

  const {
    isLoading: playerLoading,
    data: player,
    error: playerError,
  } = useApi(() => api.timetrialsPlayersRetrieve({ id }), [id], "playerProfile");

  const { isLoading: statsLoading, data: stats } = useApi(
    () =>
      api.timetrialsPlayersStatsRetrieve({
        id,
        category,
        lapMode,
        region: region?.id ?? 1,
      }),
    [id, category, lapMode, region],
    "playerProfileStats",
  );

  const { isLoading: scoresLoading, data: scores } = useApi(
    () => api.timetrialsPlayersScoresList({ id, category, region: region?.id ?? 1 }),
    [id, category, region],
    "playerProfileScores",
  );

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

  const tableData: ArrayTableData = {
    iconCellColumns: [-1, -2, -3],
    rowSortData: [],
  };

  const sortedRows: ArrayTableCellData[][] =
    scores?.map((score, index, arr) => {
      const track = metadata.tracks?.find((track) => track.id === score.track);
      const trackLink = (
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
          <SmallBigTrackFormat
            track={track}
            smallClass="player-profile-columns-s1"
            bigClass="player-profile-columns-b1"
          />
        </Link>
      );
      const timeClassName = score.category !== category ? "fallthrough" : "";
      const timeLink = (
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
      );

      tableData.rowSortData?.push(
        {
          rowIdx: index,
          sortKey: "track",
          sortValue: index + (score.isLap ? -1 : 1),
        },
        {
          rowIdx: index,
          sortKey: "time",
          sortValue: score.value,
        },
        {
          rowIdx: index,
          sortKey: "rank",
          sortValue: score.rank,
        },
        {
          rowIdx: index,
          sortKey: "standard",
          sortValue: score.standard,
        },
        {
          rowIdx: index,
          sortKey: "prwr",
          sortValue: ~~score.recordRatio,
        },
        {
          rowIdx: index,
          sortKey: "date",
          sortValue: +(score.date ?? new Date(0)),
        },
      );

      return [
        {
          content: trackLink,
          expandCell: [
            arr[index - 1] && score.isLap && arr[index - 1].track === score.track,
            false,
          ],
          className: "overall-shown sort-hidden",
        },
        {
          content: trackLink,
          className: "overall-hidden sort-shown",
        },
        {
          content: score.isLap ? null : timeLink,
          className: timeClassName + " overall-shown",
        },
        {
          content: timeLink,
          expandCell: [false, !score.isLap],
          className: timeClassName + " overall-shown",
        },
        {
          content: timeLink,
          className: timeClassName + " overall-hidden",
        },
        { content: score.rank },
        { content: translateStandardName(getStandardLevel(metadata, score.standard), lang) },
        { content: (score.recordRatio * 100).toFixed(2) + "%" },
        {
          content: (
            <SmallBigDateFormat
              date={score.date}
              bigClass="player-profile-columns-b1"
              smallClass="player-profile-columns-s1"
            />
          ),
        },
        {
          content: score.videoLink ? (
            <a href={score.videoLink} target="_blank" rel="noopener noreferrer">
              <Icon icon="Video" />
            </a>
          ) : null,
        },
        {
          content: score.ghostLink ? (
            <a href={score.ghostLink} target="_blank" rel="noopener noreferrer">
              <Icon icon="Ghost" />
            </a>
          ) : null,
        },
        {
          content: score.comment ? (
            <Tooltip text={score.comment}>
              <Icon icon="Comment" />
            </Tooltip>
          ) : null,
        },
      ] as ArrayTableCellData[];
    }) ?? [];

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
        <div className="module-row wrap">
          <CategoryRadio value={category} onChange={setCategory} />
          <LapModeRadio includeOverall value={lapMode} onChange={setLapMode} />
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
                              text: translateRegionName(region, lang),
                              value: region,
                              rightIcon: <FlagIcon region={region} showRegFlagRegardless />,
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
        <div className="module-row wrap">
          <div className="module">
            <Deferred isWaiting={playerLoading}>
              <table>
                <tbody>
                  <tr>
                    <td>{translate("playerProfilePageLocation", lang)}</td>
                    <td>{translateRegionNameFull(metadata, lang, player?.region)}</td>
                  </tr>
                  <tr>
                    <td>{translate("playerProfilePageAlias", lang)}</td>
                    <td>{player?.alias}</td>
                  </tr>
                  <tr>
                    <td>{translate("playerProfilePageDateJoined", lang)}</td>
                    <td>{player?.joinedDate && formatDate(player.joinedDate)}</td>
                  </tr>
                  <tr>
                    <td>{translate("playerProfilePageLastActivity", lang)}</td>
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
                        {translate("playerProfilePageAverageFinishTitle", lang)}
                      </Link>
                    </td>
                    <td>
                      {stats ? (
                        <Link
                          to={resolvePage(
                            Pages.RankingsAverageFinish,
                            {},
                            {
                              ...rankingsRedirectParams,
                              hl: RankingsMetrics.AverageFinish.getHighlightValue(stats),
                            },
                          )}
                        >
                          {RankingsMetrics.AverageFinish.getValueString(stats)}
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
                        {translate("playerProfilePageAverageStandardTitle", lang)}
                      </Link>
                    </td>
                    <td>
                      {stats ? (
                        <Link
                          to={resolvePage(
                            Pages.RankingsAverageStandard,
                            {},
                            {
                              ...rankingsRedirectParams,
                              hl: RankingsMetrics.AverageStandard.getHighlightValue(stats),
                            },
                          )}
                        >
                          {RankingsMetrics.AverageStandard.getValueString(stats)}
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
                        {translate("playerProfilePageAverageRecordRatioTitle", lang)}
                      </Link>
                    </td>
                    <td>
                      {stats ? (
                        <Link
                          to={resolvePage(
                            Pages.RankingsAverageRecordRatio,
                            {},
                            {
                              ...rankingsRedirectParams,
                              hl: RankingsMetrics.AverageRecordRatio.getHighlightValue(stats),
                            },
                          )}
                        >
                          {RankingsMetrics.AverageRecordRatio.getValueString(stats)}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link to={resolvePage(Pages.RankingsTotalTime, {}, rankingsRedirectParams)}>
                        {translate("playerProfilePageTotalTimeTitle", lang)}
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
                              hl: RankingsMetrics.TotalTime.getHighlightValue(stats),
                            },
                          )}
                        >
                          {RankingsMetrics.TotalTime.getValueString(stats)}
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
              <div className="module-content" style={{ overflowY: "auto", maxHeight: 128 }}>
                <p>
                  {player?.bio ? (
                    player.bio.split("\n").map((line: string) => (
                      <>
                        {line}
                        <br />
                      </>
                    ))
                  ) : (
                    <i>{translate("playerProfilePageDefaultBio", lang)}</i>
                  )}
                </p>
              </div>
            </Deferred>
          </div>
        </div>
        <div className="module">
          <Deferred isWaiting={metadata.isLoading || scoresLoading}>
            <ArrayTable
              headerRows={[
                [
                  {
                    content: translate("playerProfilePageTrackColumn", lang),
                    className: "overall-shown sort-hidden",
                    thSort: { sortKey: "track", allowedSort: [Sort.Descending, Sort.Reset] },
                  },
                  {
                    content: translate("playerProfilePageTrackColumn", lang),
                    className: "overall-hidden sort-shown",
                    thSort: { sortKey: "track", allowedSort: [Sort.Descending, Sort.Reset] },
                  },
                  {
                    content: translate("playerProfilePageCourseTimeColumn", lang),
                    className: "overall-shown",
                    thSort: {
                      sortKey: "time",
                      allowedSort: [Sort.Ascending, Sort.Descending, Sort.Reset],
                    },
                  },
                  {
                    content: translate("playerProfilePageLapTimeColumn", lang),
                    className: "overall-shown",
                    thSort: {
                      sortKey: "time",
                      allowedSort: [Sort.Ascending, Sort.Descending, Sort.Reset],
                    },
                  },
                  {
                    content: translate("playerProfilePageTimeColumn", lang),
                    className: "overall-hidden",
                    thSort: {
                      sortKey: "time",
                      allowedSort: [Sort.Ascending, Sort.Descending, Sort.Reset],
                    },
                  },
                  {
                    content: translate("playerProfilePageRankColumn", lang),
                    thSort: {
                      sortKey: "rank",
                      allowedSort: [Sort.Ascending, Sort.Descending, Sort.Reset],
                    },
                  },
                  {
                    content: translate("playerProfilePageStandardColumn", lang),
                    thSort: {
                      sortKey: "standard",
                      allowedSort: [Sort.Ascending, Sort.Descending, Sort.Reset],
                    },
                  },
                  {
                    content: translate("playerProfilePagePRWRColumn", lang),
                    thSort: {
                      sortKey: "prwr",
                      allowedSort: [Sort.Descending, Sort.Ascending, Sort.Reset],
                    },
                  },
                  {
                    content: translate("playerProfilePageDateColumn", lang),
                    thSort: {
                      sortKey: "date",
                      allowedSort: [Sort.Ascending, Sort.Descending, Sort.Reset],
                    },
                  },
                  {
                    content: null,
                  },
                  {
                    content: null,
                  },
                  {
                    content: null,
                  },
                ],
              ]}
              rows={sortedRows}
              tableData={tableData}
              className={"player-profile-table " + lapMode}
            />
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default PlayerProfilePage;
