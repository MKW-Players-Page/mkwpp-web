import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../hooks";
import { formatTime } from "../../utils/Formatters";
import { I18nContext, translate, translateCategoryName } from "../../utils/i18n/i18n";
import { MetadataContext } from "../../utils/Metadata";
import { Pages, resolvePage } from "../pages";
import Deferred from "./Deferred";
import ExpandableModule from "./ExpandableModule";
import { CategoryEnum, LapModeEnum, Score } from "../../api";
import PlayerMention from "./PlayerMention";

import "./RecentTimes.css";
import { SmallBigDateFormat, SmallBigTrackFormat } from "./SmallBigFormat";
import ArrayTable, { ArrayTableCellData } from "./Table";
import { secondsToDate } from "../../utils/DateUtils";
import RadioButtons from "./RadioButtons";

interface RecentTimesProps {
  limit: number;
}

const RecentTimes = ({ limit }: RecentTimesProps) => {
  const { lang } = useContext(I18nContext);
  const [records, setRecords] = useState(false);
  const metadata = useContext(MetadataContext);

  const { isLoading: recentTimesLoading, data } = useApi(
    () =>
      Score.getRecent(limit, records).then((scores) =>
        scores.reduce(
          (acc, data, index) => {
            const track = metadata.getTrackById(data.trackId);
            acc.rows.push([
              {
                content: (
                  <Link
                    to={resolvePage(
                      Pages.TrackChart,
                      { id: data.trackId },
                      {
                        cat: data.category !== CategoryEnum.NonShortcut ? data.category : null,
                        lap: data.isLap ? LapModeEnum.Lap : null,
                        hl: data.value,
                      },
                    )}
                  >
                    <SmallBigTrackFormat track={track} bigClass="b3" smallClass="s3" />
                  </Link>
                ),
                lockedCell: true,
              },
              {
                content: translateCategoryName(data.category, lang),
                className: "b2",
              },
              {
                content: data.isLap
                  ? translate("constantLapModeLap", lang)
                  : translate("constantLapModeCourse", lang),
                className: "b1",
              },
              {
                content: (
                  <PlayerMention
                    playerOrId={data.player}
                    regionOrId={data.player.regionId ?? undefined}
                    xxFlag
                  />
                ),
              },
              {
                content: formatTime(data.value),
              },
              {
                content: (
                  <SmallBigDateFormat
                    date={secondsToDate(data.date)}
                    smallClass={"s1 b4"}
                    bigClass={"b1"}
                  />
                ),
                className: "",
              },
            ]);
            acc.rowKeys.push(String(index));
            return acc;
          },
          { rows: [] as ArrayTableCellData[][], rowKeys: [] as string[] },
        ),
      ),
    [metadata.isLoading, records, limit],
    records ? "recentRecords" : "recentTimes",
  );

  return (
    <ExpandableModule
      style={{ containerType: "inline-size" }}
      heading={
        records
          ? translate("recentTimesRecentRecordsHeading", lang)
          : translate("recentTimesRecentTimesHeading", lang)
      }
    >
      <RadioButtons
        data={[
          { text: "All", value: false },
          { text: "Records", value: true },
        ]}
        state={records}
        setState={setRecords}
        className="recent-times-input"
      />
      <Deferred isWaiting={recentTimesLoading || metadata.isLoading}>
        <ArrayTable
          className="recent-times-table"
          headerRows={[
            [
              {
                content: translate("recentTimesRecentTimesTrackCol", lang),
                lockedCell: true,
              },
              {
                content: translate("recentTimesRecentTimesCategoryCol", lang),
                className: "b2",
              },
              {
                content: translate("recentTimesRecentTimesLapModeCol", lang),
                className: "b1",
              },
              { content: translate("recentTimesRecentTimesPlayerCol", lang) },
              { content: translate("recentTimesRecentTimesTimeCol", lang) },
              { content: translate("recentTimesRecentTimesDateCol", lang) },
            ],
          ]}
          tableData={{ rowKeys: data?.rowKeys ?? [] }}
          rows={data?.rows ?? [[]]}
        />
      </Deferred>
    </ExpandableModule>
  );
};

export default RecentTimes;
