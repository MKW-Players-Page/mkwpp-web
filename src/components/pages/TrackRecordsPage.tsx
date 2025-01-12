import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../widgets/Deferred";
import { Icon, Tooltip } from "../widgets";
import OverwriteColor from "../widgets/OverwriteColor";
import api from "../../api";
import { useApi } from "../../hooks";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import { formatTime } from "../../utils/Formatters";
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
import FormatDateDependable from "../widgets/VariedDate";

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
        TrackCell: 0,
        PlayerName: 1,
        TimeCellSmall: 2,
        CourseTimeCellBig: 3,
        LapTimeCellBig: 4,
        Standards: 5,
        Date: 6,
        VideoLink: 7,
        GhostLink: 8,
        Comment: 9,
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
              <span className="track-records-columns-b2">{translateTrack(track, lang)}</span>
              <span className="track-records-columns-s2">{track.abbr}</span>
            </Link>
          ),
          expandCell: [isLap && big, false],
          className: "",
          lockedCell: true,
        },
        { content: "-" },
        { content: "-", className: "track-records-columns-s1 fallthrough" },
        { content: isLap ? null : "-", className: "track-records-columns-b1 fallthrough" },
        {
          content: isLap ? "-" : null,
          expandCell: [false, !isLap],
          className: "track-records-columns-b1 fallthrough",
        },
        { content: "-" },
        { content: "-" },
        { content: null },
        { content: null },
        { content: null },
      ];
      tableData.classNames?.push({
        rowIdx: (track.id - 1) * 4 + (isLap ? 1 : 0) + (big ? 0 : 2),
        className: big
          ? "track-records-columns-b1"
          : `track-records-columns-s1 ${isLap ? "flap" : "course"}`,
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
        out[Indexes.TimeCellSmall].className = "track-records-columns-s1";
        out[isLap ? Indexes.LapTimeCellBig : Indexes.CourseTimeCellBig].className =
          "track-records-columns-b1";
        out[Indexes.Standards].content = getStandardLevel(metadata, score.standard)?.name;
        if (score.date) {
          out[Indexes.Date].content = (
            <FormatDateDependable
              date={score.date}
              smallClass={"track-records-columns-s1"}
              bigClass={"track-records-columns-b1"}
            />
          );
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
            className="track-records-columns-s1"
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
                    lockedCell: true,
                  },
                  { content: translate("trackRecordsPagePlayerCol", lang) },
                  {
                    content: translate("trackRecordsPageTimeCol", lang),
                    className: "track-records-columns-s1",
                  },
                  {
                    content: translate("trackRecordsPageCourseCol", lang),
                    className: "track-records-columns-b1",
                  },
                  {
                    content: translate("trackRecordsPageLapCol", lang),
                    className: "track-records-columns-b1",
                  },
                  { content: translate("trackRecordsPageStandardCol", lang) },
                  { content: translate("trackRecordsPageDateCol", lang) },
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
