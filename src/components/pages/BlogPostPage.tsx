import { useParams } from "react-router-dom";

import Deferred from "../global/Deferred";
import { BlogPostModule } from "../widgets";
import { coreApi } from "../../api";
import { useApi } from "../../hooks";
import { integerOr } from "../../utils/Numbers";

const BlogPostPage = () => {
  const { id: idStr } = useParams();
  const id = Math.max(integerOr(idStr, 0), 0);

  const { isLoading, data: post } = useApi(() => coreApi.coreBlogRetrieve({ id }), [id]);

  return (
    <Deferred isWaiting={isLoading}>
      {post ? (
        <BlogPostModule post={post} />
      ) : (
        <div className="module">
          <div className="module-content">
            The archive you requested does not appear to exist...
          </div>
        </div>
      )}
    </Deferred>
  );
};

export default BlogPostPage;
