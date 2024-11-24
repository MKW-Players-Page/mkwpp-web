import Deferred from "../widgets/Deferred";
import { coreApi } from "../../api";
import { useApi } from "../../hooks";
import { BlogPostModule } from "../widgets";
import DiscordEmbed from "../widgets/DiscordEmbed";
import ExpandableModule from "../widgets/ExpandableModule";
import { I18nContext } from "../../utils/i18n/i18n";
import { useContext } from "react";
import CupsList from "../widgets/CupsList";
import RecentTimes from "../widgets/RecentTimes";

const HomePage = () => {
  const { translations, lang } = useContext(I18nContext);

  const { isLoading: blogPostsLoading, data: posts } = useApi(
    () => coreApi.coreBlogLatestList(),
    [],
    "blogPosts",
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
        <RecentTimes records={true} limit={30} />
        <RecentTimes records={false} limit={30} />
      </div>
      <ExpandableModule heading={translations.homePageRecentTrackListPart[lang]}>
        <div className="module-content">
          <CupsList />
        </div>
      </ExpandableModule>
      <ExpandableModule heading={translations.homePageWelcomeHeading[lang]}>
        <div className="module-content">
          <h2>{translations.homePageWelcomeParagraphHeading[lang]}</h2>
          <p>{translations.homePageWelcomeParagraph1[lang]}</p>
          <p>{translations.homePageWelcomeParagraph2[lang]}</p>
          <p>{translations.homePageWelcomeParagraph3[lang]}</p>
          <p>{translations.homePageWelcomeParagraph4[lang]}</p>
          <p>{translations.homePageWelcomeParagraph5[lang]}</p>
          <p>{translations.homePageWelcomeParagraph6[lang]}</p>
        </div>
      </ExpandableModule>
    </div>
  );
};

export default HomePage;
