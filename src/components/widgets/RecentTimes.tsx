import { useContext } from "react";
import { Link } from "react-router-dom";
import api, { CategoryEnum } from "../../api";
import { useApi } from "../../hooks";
import { formatDate, formatDateShort, formatTime } from "../../utils/Formatters";
import {
  I18nContext,
  translate,
  translateCategoryName,
  translateTrack,
} from "../../utils/i18n/i18n";
import { getTrackById, MetadataContext } from "../../utils/Metadata";
import { Pages, resolvePage } from "../pages";
import Deferred from "./Deferred";
import ExpandableModule from "./ExpandableModule";
import { LapModeEnum } from "./LapModeSelect";
import PlayerMention from "./PlayerMention";

import "./RecentTimes.css";
import ArrayTable from "./Table";

interface RecentTimesProps {
  records?: boolean;
  limit: number;
}

const RecentTimes = ({ records, limit }: RecentTimesProps) => {
  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);

  const adjustedRecords = !!records;

  const { isLoading: recentTimesLoading, data: recentTimes } = useApi(
    adjustedRecords
      ? () => api.timetrialsRecordsLatestList({ limit })
      : () => api.timetrialsScoresLatestList({ limit }),
    [],
    adjustedRecords ? "recentRecords" : "recentTimes",
  );
  return (
    <ExpandableModule
      style={{ containerType: "inline-size" }}
      heading={
        adjustedRecords
          ? translate("recentTimesRecentRecordsHeading", lang)
          : translate("recentTimesRecentTimesHeading", lang)
      }
    >
      <Deferred isWaiting={recentTimesLoading || metadata.isLoading}>
        <ArrayTable
          className="recent-times-table"
          headerRows={[
            [
              {
                content: translate("recentTimesRecentTimesTrackCol", lang),
                className: "s3",
                lockedCell: true,
              },
              {
                content: translate("recentTimesRecentTimesTrackCol", lang),
                className: "b3",
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
              { content: translate("recentTimesRecentTimesDateCol", lang), className: "b1" },
              { content: translate("recentTimesRecentTimesDateCol", lang), className: "s1 b4" },
            ],
          ]}
          rows={
            recentTimes?.map((data) => {
              const track = getTrackById(metadata.tracks, data.track);
              return [
                {
                  content: (
                    <Link
                      to={resolvePage(
                        Pages.TrackChart,
                        { id: data.track },
                        {
                          cat: data.category !== CategoryEnum.NonShortcut ? data.category : null,
                          lap: data.isLap ? LapModeEnum.Lap : null,
                          hl: data.value,
                        },
                      )}
                    >
                      {track?.abbr}
                    </Link>
                  ),
                  className: "s3",
                  lockedCell: true,
                },
                {
                  content: (
                    <Link
                      to={resolvePage(
                        Pages.TrackChart,
                        { id: data.track },
                        {
                          cat: data.category !== CategoryEnum.NonShortcut ? data.category : null,
                          lap: data.isLap ? LapModeEnum.Lap : null,
                          hl: data.value,
                        },
                      )}
                    >
                      {translateTrack(track, lang)}
                    </Link>
                  ),
                  className: "b3",
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
                      precalcPlayer={data.player}
                      precalcRegionId={data.player.region ?? undefined}
                      xxFlag={true}
                    />
                  ),
                },
                {
                  content: formatTime(data.value),
                },
                {
                  content: formatDate(data.date as Date),
                  className: "b1",
                },
                {
                  content: formatDateShort(data.date as Date),
                  className: "s1 b4",
                },
              ];
            }) ?? [[]]
          }
        />
      </Deferred>
    </ExpandableModule>
  );
};

export default RecentTimes;
