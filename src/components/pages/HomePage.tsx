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
      <ExpandableModule moduleHeight={150} heading={translations.homePageWelcomeHeading[lang]}>
        <div className="module-content">{translations.homePageWelcomeParagraph[lang]}</div>
      </ExpandableModule>
      <DiscordEmbed />
      <Deferred isWaiting={blogpostsLoading}>
        {posts?.slice(0, 4)?.map((post) => <BlogPostModule post={post} />)}
      </Deferred>
    </div>
  );
};

export default HomePage;
