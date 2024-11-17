import Deferred from "../widgets/Deferred";
import { coreApi } from "../../api";
import { useApi } from "../../hooks";
import { BlogPostModule } from "../widgets";
import DiscordEmbed from "../widgets/DiscordEmbed";

const HomePage = () => {
  const { isLoading: blogpostsLoading, data: posts } = useApi(
    () => coreApi.coreBlogLatestList(),
    [],
    "blogPosts",
  );

  return (
    <>
      <DiscordEmbed />
      <Deferred isWaiting={blogpostsLoading}>
        {posts?.slice(0, 4)?.map((post) => <BlogPostModule post={post} />)}
      </Deferred>
    </>
  );
};

export default HomePage;
