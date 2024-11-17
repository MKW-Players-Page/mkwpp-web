import Deferred from "../widgets/Deferred";
import { coreApi } from "../../api";
import { useApi } from "../../hooks";
import { BlogPostModule } from "../widgets";

const HomePage = () => {
  const { isLoading, data: posts } = useApi(() => coreApi.coreBlogLatestList(), [], "blogPosts");

  return (
    <>
      <Deferred isWaiting={isLoading}>
        {posts?.slice(0, 4)?.map((post) => <BlogPostModule post={post} />)}
      </Deferred>
    </>
  );
};

export default HomePage;
