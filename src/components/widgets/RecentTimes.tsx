import { useContext } from "react";
import { Link } from "react-router-dom";
import api, { CategoryEnum } from "../../api";
import { useApi } from "../../hooks";
import { formatTime } from "../../utils/Formatters";
import { I18nContext, translate, translateCategoryName } from "../../utils/i18n/i18n";
import { getTrackById, MetadataContext } from "../../utils/Metadata";
import { Pages, resolvePage } from "../pages";
import Deferred from "./Deferred";
import ExpandableModule from "./ExpandableModule";
import { LapModeEnum } from "./LapModeSelect";
import PlayerMention from "./PlayerMention";

import "./RecentTimes.css";

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
      heading={
        adjustedRecords
          ? translate("recentTimesRecentRecordsHeading", lang)
          : translate("recentTimesRecentTimesHeading", lang)
      }
    >
      <Deferred isWaiting={recentTimesLoading || metadata.isLoading}>
        <table className="recentTimesTable">
          <thead>
            <th>{translate("recentTimesRecentTimesPlayerCol", lang)}</th>
            <th>{translate("recentTimesRecentTimesTrackCol", lang)}</th>
            <th>{translate("recentTimesRecentTimesTimeCol", lang)}</th>
            <th>{translate("recentTimesRecentTimesDateCol", lang)}</th>
          </thead>
          <tbody>
            {recentTimes?.map((data) => (
              <tr>
                <td>
                  <PlayerMention
                    precalcPlayer={data.player}
                    precalcRegionId={data.player.region ?? undefined}
                    xxFlag={true}
                  />
                </td>
                <td>
                  <Link
                    to={resolvePage(
                      Pages.TrackChart,
                      { id: data.track },
                      {
                        cat: data.category !== CategoryEnum.NonShortcut ? data.category : null,
                        lap: data.isLap ? LapModeEnum.Lap : null,
                      },
                    )}
                  >
                    {getTrackById(metadata.tracks, data.track)?.abbr}&nbsp;
                    {translateCategoryName(data.category, lang)}&nbsp;
                    {data.isLap
                      ? translate("constantLapModeLap", lang)
                      : translate("constantLapModeCourse", lang)}
                  </Link>
                </td>
                <td>
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
                    {formatTime(data.value)}
                  </Link>
                </td>
                <td>{data.date?.toLocaleDateString(lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Deferred>
    </ExpandableModule>
  );
};

export default RecentTimes;
