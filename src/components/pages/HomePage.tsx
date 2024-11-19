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
      <ExpandableModule style={{ order: 1 }} heading={translations.homePageWelcomeHeading[lang]}>
        <div className="module-content">{translations.homePageWelcomeParagraph[lang]}</div>
      </ExpandableModule>
      <div style={{ order: 3, flex: 1 }}>
        <DiscordEmbed />
        <ExpandableModule heading={"recent records"}>
          <div className="module-content">test</div>
        </ExpandableModule>
        <ExpandableModule heading={"recent times"}>
          <div className="module-content">test</div>
        </ExpandableModule>
        <ExpandableModule heading={"test"}>
          <div className="module-content">test</div>
        </ExpandableModule>
      </div>
      <div style={{ order: 2, flex: 3 }}>
        <Deferred isWaiting={blogpostsLoading}>
          {posts?.slice(0, 4)?.map((post) => <BlogPostModule post={post} />)}
        </Deferred>
      </div>
    </div>
  );
};

export default HomePage;
