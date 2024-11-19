import Deferred from "../widgets/Deferred";
import { coreApi } from "../../api";
import { useApi } from "../../hooks";
import { BlogPostModule } from "../widgets";
import DiscordEmbed from "../widgets/DiscordEmbed";
import ExpandableModule from "../widgets/ExpandableModule";
import { I18nContext } from "../../utils/i18n/i18n";
import { useContext } from "react";

const HomePage = () => {
  const { translations, lang } = useContext(I18nContext);

  const { isLoading: blogpostsLoading, data: posts } = useApi(
    () => coreApi.coreBlogLatestList(),
    [],
    "blogPosts",
  );

  return (
    <div className="homePageGrid">
      <div style={{ flex: 3, minWidth: "250px" }}>
        <Deferred isWaiting={blogpostsLoading}>
          {posts?.slice(0, 4)?.map((post) => <BlogPostModule post={post} />)}
        </Deferred>
      </div>
      <div style={{ flex: 1 }}>
        <DiscordEmbed />
        <ExpandableModule heading={translations.homePageRecentRecordsHeading[lang]}>
          <div className="module-content"></div>
        </ExpandableModule>
        <ExpandableModule heading={translations.homePageRecentTimesHeading[lang]}>
          <div className="module-content"></div>
        </ExpandableModule>
      </div>
      <ExpandableModule heading={translations.homePageWelcomeHeading[lang]}>
        <div className="module-content">{translations.homePageWelcomeParagraph[lang]}</div>
      </ExpandableModule>
    </div>
  );
};

export default HomePage;
