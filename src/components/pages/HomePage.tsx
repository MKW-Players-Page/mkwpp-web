import Deferred from "../widgets/Deferred";
import api, { CategoryEnum, coreApi } from "../../api";
import { useApi } from "../../hooks";
import { BlogPostModule } from "../widgets";
import DiscordEmbed from "../widgets/DiscordEmbed";
import ExpandableModule from "../widgets/ExpandableModule";
import { I18nContext } from "../../utils/i18n/i18n";
import { useContext } from "react";
import CupsList from "../widgets/CupsList";
import PlayerMention from "../widgets/PlayerMention";
import { formatTime } from "../../utils/Formatters";
import { MetadataContext } from "../../utils/Metadata";
import { getCategoryNameTranslationKey, getTrackById } from "../../utils/EnumUtils";
import { Link } from "react-router-dom";
import { Pages, resolvePage } from "./Pages";
import { LapModeEnum } from "../widgets/LapModeSelect";

const HomePage = () => {
  const { translations, lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);

  const { isLoading: blogPostsLoading, data: posts } = useApi(
    () => coreApi.coreBlogLatestList(),
    [],
    "blogPosts",
  );

  const { isLoading: recentTimesLoading, data: recentTimes } = useApi(
    () => api.timetrialsScoresLatestList({ limit: 10 }),
    [],
    "recentTimes",
  );

  /* TODO: Change API endpoint */
  const { isLoading: recentRecordsLoading, data: recentRecords } = useApi(
    () => api.timetrialsScoresLatestList({ limit: 10 }),
    [],
    "recentRecords",
  );

  return (
    <div className="homePageGrid">
      <div style={{ flex: 2, minWidth: "250px" }}>
        <Deferred isWaiting={blogPostsLoading}>
          {posts?.slice(0, 4)?.map((post) => <BlogPostModule post={post} />)}
        </Deferred>
      </div>
      <div style={{ flex: 1 }}>
        <DiscordEmbed />
        <ExpandableModule heading={translations.trackListPageRecentRecordsHeading[lang]}>
          <Deferred isWaiting={recentRecordsLoading || metadata.isLoading}>
            <table>
              <thead>
                <th>{translations.trackListPageRecentRecordsPlayerCol[lang]}</th>
                <th>{translations.trackListPageRecentRecordsTrackCol[lang]}</th>
                <th>{translations.trackListPageRecentRecordsTimeCol[lang]}</th>
                <th>{translations.trackListPageRecentRecordsDateCol[lang]}</th>
              </thead>
              <tbody>
                {recentRecords?.map((data) => (
                  <tr>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <PlayerMention id={data.player.id} />
                    </td>
                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
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
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
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
                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {data.date?.toLocaleDateString(lang)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Deferred>
        </ExpandableModule>
        <ExpandableModule heading={translations.trackListPageRecentTimesHeading[lang]}>
          <Deferred isWaiting={recentTimesLoading || metadata.isLoading}>
            <table>
              <thead>
                <th>{translations.trackListPageRecentTimesPlayerCol[lang]}</th>
                <th>{translations.trackListPageRecentTimesTrackCol[lang]}</th>
                <th>{translations.trackListPageRecentTimesTimeCol[lang]}</th>
                <th>{translations.trackListPageRecentTimesDateCol[lang]}</th>
              </thead>
              <tbody>
                {recentTimes?.map((data) => (
                  <tr>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <PlayerMention id={data.player.id} />
                    </td>
                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
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
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
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
                    <td style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                      {data.date?.toLocaleDateString(lang)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Deferred>
        </ExpandableModule>
      </div>
      <ExpandableModule heading={translations.homePageRecentTrackListPart[lang]}>
        <div className="module-content">
          <CupsList />
        </div>
      </ExpandableModule>
      <ExpandableModule heading={translations.homePageWelcomeHeading[lang]}>
        <div className="module-content">{translations.homePageWelcomeParagraph[lang]}</div>
      </ExpandableModule>
    </div>
  );
};

export default HomePage;
