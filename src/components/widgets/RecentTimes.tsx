import { useContext } from "react";
import { Link } from "react-router-dom";
import api, { CategoryEnum } from "../../api";
import { useApi } from "../../hooks";
import { getCategoryNameTranslationKey, getTrackById } from "../../utils/EnumUtils";
import { formatTime } from "../../utils/Formatters";
import { I18nContext } from "../../utils/i18n/i18n";
import { MetadataContext } from "../../utils/Metadata";
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
  const { translations, lang } = useContext(I18nContext);
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
          ? translations.recentTimesRecentRecordsHeading[lang]
          : translations.recentTimesRecentTimesHeading[lang]
      }
    >
      <Deferred isWaiting={recentTimesLoading || metadata.isLoading}>
        <table className="recentTimesTable">
          <thead>
            <th>{translations.recentTimesRecentTimesPlayerCol[lang]}</th>
            <th>{translations.recentTimesRecentTimesTrackCol[lang]}</th>
            <th>{translations.recentTimesRecentTimesTimeCol[lang]}</th>
            <th>{translations.recentTimesRecentTimesDateCol[lang]}</th>
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
                    {translations[getCategoryNameTranslationKey(data.category)][lang]}&nbsp;
                    {data.isLap
                      ? translations.constantLapModeLap[lang]
                      : translations.constantLapModeCourse[lang]}
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
