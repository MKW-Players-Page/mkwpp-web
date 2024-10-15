import Deferred from "../global/Deferred";
import { coreApi } from "../../api";
import { useApi } from "../../hooks";
import { BlogPostModule } from "../widgets";

const HomePage = () => {
  const { isLoading, data: posts } = useApi(() => coreApi.coreBlogLatestList());

  return (
    <>
      <Deferred isWaiting={isLoading}>
        {posts?.map((post) => <BlogPostModule post={post} />)}
      </Deferred>
    </>
  );
};

export default HomePage;
