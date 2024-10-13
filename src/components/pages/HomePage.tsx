import Deferred from "../global/Deferred";
import { coreApi } from "../../api";
import { useApi } from "../../hooks";

const HomePage = () => {
  const { isLoading, data: posts } = useApi(() => coreApi.coreBlogLatestList());

  return (
    <>
      <Deferred isWaiting={isLoading}>
        {posts?.map((post) => (
          <div key={post.id} className="module">
            <div className="module-header">
              <b>{post.title}</b><br />
              {post.publishedAt.toLocaleString()} - {post.author.username}
            </div>
            <div className="module-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        ))}
      </Deferred>
    </>
  );
};

export default HomePage;
