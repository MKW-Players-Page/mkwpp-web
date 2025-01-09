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
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../widgets/Table";

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

  const table: ArrayTableCellData[][] = [];
  const tableData: ArrayTableData = {
    iconCellColumns: [-1, -2, -3],
    classNames: [],
  };

  metadata.tracks?.forEach((track) =>
    [false, true].forEach((isLap) => {
      const out: ArrayTableCellData[] = [
        {
          content: isLap ? null : (
            <Link to={resolvePage(Pages.TrackChart, { id: track.id })}>
              {translateTrack(track, lang)}
            </Link>
          ),
          expandCell: [isLap, false],
        },
        { content: "-" },
        { content: isLap ? null : "-", className: "fallthrough" },
        {
          content: isLap ? "-" : null,
          expandCell: [false, !isLap],
          className: "fallthrough",
        },
        { content: "-" },
        { content: "-" },
        { content: null },
        { content: null },
        { content: null },
      ];
      const score = scores?.find((score) => score.track === track.id && score.isLap === isLap);
      if (score === undefined) {
        table.push(out);
        return;
      }

      if (score?.player.id === user?.player)
        tableData.classNames?.push({
          rowIdx: track.id * 2 + (isLap ? 1 : 0),
          className: "highlighted",
        });
      out[1].content = (
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
      out[isLap ? 3 : 2].content = formatTime(score.value);
      out[isLap ? 3 : 2].className = "";
      out[4].content = getStandardLevel(metadata, score.standard)?.name;
      if (score.date) out[5].content = formatDate(score.date);
      if (score.videoLink)
        out[6].content = (
          <a href={score.videoLink} target="_blank" rel="noopener noreferrer">
            <Icon icon="Video" />
          </a>
        );
      if (score.ghostLink)
        out[7].content = (
          <a href={score.ghostLink} target="_blank" rel="noopener noreferrer">
            <Icon icon="Ghost" />
          </a>
        );
      if (score.comment)
        out[8].content = (
          <Tooltip text={score.comment}>
            <Icon icon="Comment" />
          </Tooltip>
        );

      table.push(out);
    }),
  );

  return (
    <>
      <h1>{translateRegionName(region, lang, "Record")}</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row wrap">
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
            <ArrayTable
              headerRows={[
                [
                  { content: translate("trackRecordsPageTrackCol", lang) },
                  { content: translate("trackRecordsPagePlayerCol", lang) },
                  { content: translate("trackRecordsPageCourseCol", lang) },
                  { content: translate("trackRecordsPageLapCol", lang) },
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
