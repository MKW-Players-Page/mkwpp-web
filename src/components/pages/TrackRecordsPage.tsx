import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../widgets/Deferred";
import { Icon, Tooltip } from "../widgets";
import OverwriteColor from "../widgets/OverwriteColor";
import api from "../../api";
import { useApi } from "../../hooks";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import { formatDate, formatDateShort, formatTime } from "../../utils/Formatters";
import { useCategoryParam, useLapModeParam, useRegionParam } from "../../utils/SearchParams";
import { UserContext } from "../../utils/User";
import { getStandardLevel, MetadataContext } from "../../utils/Metadata";
import RegionSelectionDropdown from "../widgets/RegionDropdown";
import { I18nContext, translate, translateRegionName, translateTrack } from "../../utils/i18n/i18n";
import { SettingsContext } from "../../utils/Settings";
import PlayerMention from "../widgets/PlayerMention";
import { CategoryRadio } from "../widgets/CategorySelect";
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../widgets/Table";
import { LapModeEnum, LapModeRadio } from "../widgets/LapModeSelect";

const TrackRecordsPage = () => {
  const searchParams = useSearchParams();

  const { category, setCategory } = useCategoryParam(searchParams);
  const { lapMode, setLapMode } = useLapModeParam(searchParams);
  const { region, setRegion } = useRegionParam(searchParams);

  const metadata = useContext(MetadataContext);
  const { settings } = useContext(SettingsContext);
  const { lang } = useContext(I18nContext);

  const { user } = useContext(UserContext);

  const { isLoading, data: scores } = useApi(
    () => api.timetrialsRecordsList({ category, region: region.id }),
    [category, region, metadata.isLoading],
    "trackRecords",
    [{ variable: metadata.regions.length, defaultValue: 1 }],
  );

  const siteHue = getCategorySiteHue(category, settings);

  const table: ArrayTableCellData[][] = [];
  const tableData: ArrayTableData = {
    iconCellColumns: [-1, -2, -3],
    classNames: [],
  };

  metadata.tracks?.forEach((track) =>
    [
      { isLap: false, big: true },
      { isLap: true, big: true },
      { isLap: false, big: false },
      { isLap: true, big: false },
    ].forEach(({ isLap, big }) => {
      const Indexes = {
        TrackCellBigAndSmall: 0,
        TrackCellXSmall: 1,
        PlayerName: 2,
        TimeCellSmall: 3,
        CourseTimeCellBig: 4,
        LapTimeCellBig: 5,
        Standards: 6,
        DateBig: 7,
        DateSmall: 8,
        VideoLink: 9,
        GhostLink: 10,
        Comment: 11,
      };
      const out: ArrayTableCellData[] = [
        {
          content: (
            <Link
              to={resolvePage(
                Pages.TrackChart,
                { id: track.id },
                { lap: isLap ? LapModeEnum.Lap : null },
              )}
            >
              {translateTrack(track, lang)}
            </Link>
          ),
          expandCell: [isLap && big, false],
          className: "track-records-columns-xbig",
        },
        {
          content: (
            <Link
              to={resolvePage(
                Pages.TrackChart,
                { id: track.id },
                { lap: isLap ? LapModeEnum.Lap : null },
              )}
            >
              {track.abbr}
            </Link>
          ),
          className: "track-records-columns-xsmall",
        },
        { content: "-" },
        { content: "-", className: "track-records-columns-small fallthrough" },
        { content: isLap ? null : "-", className: "track-records-columns-big fallthrough" },
        {
          content: isLap ? "-" : null,
          expandCell: [false, !isLap],
          className: "track-records-columns-big fallthrough",
        },
        { content: "-" },
        { content: "-", className: "track-records-columns-big" },
        { content: "-", className: "track-records-columns-small" },
        { content: null },
        { content: null },
        { content: null },
      ];
      tableData.classNames?.push({
        rowIdx: (track.id - 1) * 4 + (isLap ? 1 : 0) + (big ? 0 : 2),
        className: big
          ? "track-records-columns-big"
          : `track-records-columns-small ${isLap ? "flap" : "course"}`,
      });
      const score = scores?.find((score) => score.track === track.id && score.isLap === isLap);
      if (score !== undefined) {
        if (score?.player.id === user?.player)
          tableData.classNames?.push({
            rowIdx: (track.id - 1) * 4 + (isLap ? 1 : 0) + (big ? 0 : 2),
            className: "highlighted",
          });
        out[Indexes.PlayerName].content = (
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
        );
        out[Indexes.TimeCellSmall].content = out[
          isLap ? Indexes.LapTimeCellBig : Indexes.CourseTimeCellBig
        ].content = formatTime(score.value);
        out[Indexes.TimeCellSmall].className = "track-records-columns-small";
        out[isLap ? Indexes.LapTimeCellBig : Indexes.CourseTimeCellBig].className =
          "track-records-columns-big";
        out[Indexes.Standards].content = getStandardLevel(metadata, score.standard)?.name;
        if (score.date) {
          out[Indexes.DateBig].content = formatDate(score.date);
          out[Indexes.DateSmall].content = formatDateShort(score.date);
        }
        if (score.videoLink)
          out[Indexes.VideoLink].content = (
            <a href={score.videoLink} target="_blank" rel="noopener noreferrer">
              <Icon icon="Video" />
            </a>
          );
        if (score.ghostLink)
          out[Indexes.GhostLink].content = (
            <a href={score.ghostLink} target="_blank" rel="noopener noreferrer">
              <Icon icon="Ghost" />
            </a>
          );
        if (score.comment)
          out[Indexes.Comment].content = (
            <Tooltip text={score.comment}>
              <Icon icon="Comment" />
            </Tooltip>
          );
      }

      table.push(out);
    }),
  );

  return (
    <>
      <h1>{translateRegionName(region, lang, "Record")}</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row wrap">
          <CategoryRadio value={category} onChange={setCategory} />
          <LapModeRadio
            value={lapMode}
            onChange={setLapMode}
            className="track-records-columns-small"
          />
          <RegionSelectionDropdown
            onePlayerMin={false}
            twoPlayerMin={true}
            ranked={false}
            value={region}
            setValue={setRegion}
          />
        </div>
        <div
          className="module"
          style={
            {
              "--hideCourse": lapMode !== LapModeEnum.Course ? "none" : "table-row",
              "--hideFlap": lapMode !== LapModeEnum.Lap ? "none" : "table-row",
            } as React.CSSProperties
          }
        >
          <Deferred isWaiting={isLoading || metadata.isLoading}>
            <ArrayTable
              headerRows={[
                [
                  {
                    content: translate("trackRecordsPageTrackCol", lang),
                    className: "track-records-columns-xbig",
                  },
                  {
                    content: translate("trackRecordsPageTrackCol", lang),
                    className: "track-records-columns-xsmall",
                  },
                  { content: translate("trackRecordsPagePlayerCol", lang) },
                  {
                    content: translate("trackRecordsPageTimeCol", lang),
                    className: "track-records-columns-small",
                  },
                  {
                    content: translate("trackRecordsPageCourseCol", lang),
                    className: "track-records-columns-big",
                  },
                  {
                    content: translate("trackRecordsPageLapCol", lang),
                    className: "track-records-columns-big",
                  },
                  { content: translate("trackRecordsPageStandardCol", lang) },
                  {
                    content: translate("trackRecordsPageDateCol", lang),
                    className: "track-records-columns-big",
                  },
                  {
                    content: translate("trackRecordsPageDateCol", lang),
                    className: "track-records-columns-small",
                  },
                  { content: null },
                  { content: null },
                  { content: null },
                ],
              ]}
              rows={table}
              tableData={tableData}
            />
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default TrackRecordsPage;
