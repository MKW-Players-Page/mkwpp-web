import { useContext } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../widgets/Deferred";
import { FlagIcon, Icon, Tooltip } from "../widgets";
import { useApi } from "../../hooks/ApiHook";
import { formatLapMode, formatTime } from "../../utils/Formatters";
import { MetadataContext } from "../../utils/Metadata";
import { integerOr } from "../../utils/Numbers";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import Dropdown, { DropdownData } from "../widgets/Dropdown";
import { useCategoryParam, useLapModeParam, useRegionParam } from "../../utils/SearchParams";
import { LapModeRadio } from "../widgets/LapModeSelect";
import { LapModeEnum, CategoryEnum, Region, RegionType, Timesheet, Player } from "../../api";
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
  } = useApi(() => Player.getPlayer(id), [id], "playerProfile");

  const { isLoading: timesheetLoading, data: timesheet } = useApi(
    () => Timesheet.get(id, category, lapMode, region?.id ?? 1),
    [id, category, lapMode, region],
    "playerProfileTimesheet",
  );

  const siteHue = getCategorySiteHue(category, settings);

  const getAllRegions = (arr: Region[], startId: number): Region[] => {
    let region = metadata.getRegionById(startId);
    if (region === undefined) return arr;
    arr.push(region);
    if (region.parentId === undefined || region.parentId === null) return arr;
    return getAllRegions(arr, region.parentId);
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
    timesheet?.times?.map((score, index, arr) => {
      const track = metadata.tracks?.find((track) => track.id === score.trackId);
      const trackLink = (
        <Link
          to={resolvePage(
            Pages.TrackChart,
            { id: score.trackId },
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
            { id: score.trackId },
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
          sortValue: metadata.getStandardLevel(score.stdLvlCode)?.value,
        },
        {
          rowIdx: index,
          sortKey: "prwr",
          sortValue: ~~score.prwr,
        },
        {
          rowIdx: index,
          sortKey: "date",
          sortValue: +new Date(score.date ?? 0),
        },
      );

      return [
        {
          content: trackLink,
          expandCell: [
            arr[index - 1] && score.isLap && arr[index - 1].trackId === score.trackId,
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
        { content: translateStandardName(score.stdLvlCode, lang) },
        { content: (score.prwr * 100).toFixed(2) + "%" },
        {
          content: (
            <SmallBigDateFormat
              date={new Date(score.date)}
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
            region.regionType === RegionType.Country ||
            region.regionType === RegionType.Subnational ||
            region.regionType === RegionType.SubnationalGroup
          }
          region={metadata.getRegionById(player?.regionId ?? 0)}
        />
        {player?.name ?? <>&nbsp;</>}
      </h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row wrap">
          <CategoryRadio value={category} onChange={setCategory} />
          <LapModeRadio includeOverall value={lapMode} onChange={setLapMode} />
          {player?.regionId !== undefined && player?.regionId !== null && player?.regionId !== 1 ? (
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
                      children: getAllRegions([], player?.regionId ?? 1)
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
                    <td>{translateRegionNameFull(metadata, lang, player?.regionId)}</td>
                  </tr>
                  <tr>
                    <td>{translate("playerProfilePageAlias", lang)}</td>
                    <td>{player?.alias}</td>
                  </tr>
                  <tr>
                    <td>{translate("playerProfilePageDateJoined", lang)}</td>
                    <td>{new Date(player?.joinedDate ?? 0).toLocaleDateString(lang)}</td>
                  </tr>
                  <tr>
                    <td>{translate("playerProfilePageLastActivity", lang)}</td>
                    <td>{new Date(player?.lastActivity ?? 0).toLocaleDateString(lang)}</td>
                  </tr>
                </tbody>
              </table>
            </Deferred>
          </div>
          <div className="module">
            <Deferred isWaiting={timesheetLoading}>
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
                      <Link
                        to={resolvePage(
                          Pages.RankingsAverageFinish,
                          {},
                          {
                            ...rankingsRedirectParams,
                            hl: RankingsMetrics.AverageFinish.getHighlightValue(timesheet?.af ?? 0),
                          },
                        )}
                      >
                        {RankingsMetrics.AverageFinish.getValueString(timesheet?.af ?? 0)}
                      </Link>
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
                      <Link
                        to={resolvePage(
                          Pages.RankingsAverageStandard,
                          {},
                          {
                            ...rankingsRedirectParams,
                            hl: RankingsMetrics.AverageStandard.getHighlightValue(
                              timesheet?.arr ?? 0,
                            ),
                          },
                        )}
                      >
                        {RankingsMetrics.AverageStandard.getValueString(timesheet?.arr ?? 0)}
                      </Link>
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
                      <Link
                        to={resolvePage(
                          Pages.RankingsAverageRecordRatio,
                          {},
                          {
                            ...rankingsRedirectParams,
                            hl: RankingsMetrics.AverageRecordRatio.getHighlightValue(
                              timesheet?.prwr ?? 0,
                            ),
                          },
                        )}
                      >
                        {RankingsMetrics.AverageRecordRatio.getValueString(timesheet?.prwr ?? 0)}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Link to={resolvePage(Pages.RankingsTotalTime, {}, rankingsRedirectParams)}>
                        {translate("playerProfilePageTotalTimeTitle", lang)}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={resolvePage(
                          Pages.RankingsTotalTime,
                          {},
                          {
                            ...rankingsRedirectParams,
                            hl: RankingsMetrics.TotalTime.getHighlightValue(
                              timesheet?.totalTime ?? 0,
                            ),
                          },
                        )}
                      >
                        {RankingsMetrics.TotalTime.getValueString(timesheet?.totalTime ?? 0)}
                      </Link>
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
          <Deferred isWaiting={metadata.isLoading || timesheetLoading}>
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
              className={"player-profile-table " + formatLapMode(lapMode).toLowerCase()}
            />
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default PlayerProfilePage;
