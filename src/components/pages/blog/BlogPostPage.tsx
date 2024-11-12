import { useParams } from "react-router-dom";

import Deferred from "../../widgets/Deferred";
import { BlogPostModule } from "../../widgets";
import { coreApi } from "../../../api";
import { useApi } from "../../../hooks";
import { integerOr } from "../../../utils/Numbers";
import { useContext } from "react";
import { I18nContext } from "../../../utils/i18n/i18n";

const BlogPostPage = () => {
  const { id: idStr } = useParams();
  const id = Math.max(integerOr(idStr, 0), 0);

  const { isLoading, data: post } = useApi(() => coreApi.coreBlogRetrieve({ id }), [id]);
  const { translations, lang } = useContext(I18nContext);

  return (
    <>
      <Deferred isWaiting={isLoading}>
        {post ? (
          <BlogPostModule post={post} />
        ) : (
          <div className="module">
            <div className="module-content">{translations.blogPostPageNonexistant[lang]}</div>
          </div>
        )}
      </Deferred>
    </>
  );
};

export default BlogPostPage;
