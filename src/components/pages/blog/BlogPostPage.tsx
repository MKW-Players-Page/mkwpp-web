import { Link, useParams } from "react-router-dom";

import Deferred from "../../widgets/Deferred";
import { BlogPostModule } from "../../widgets";
import { coreApi } from "../../../api";
import { useApi } from "../../../hooks";
import { integerOr } from "../../../utils/Numbers";
import { useContext } from "react";
import { I18nContext, translate } from "../../../utils/i18n/i18n";
import { Pages, resolvePage } from "../Pages";

const BlogPostPage = () => {
  const { id: idStr } = useParams();
  const id = Math.max(integerOr(idStr, 0), 0);

  const { isLoading, data: post } = useApi(
    () => coreApi.coreBlogRetrieve({ id }),
    [id],
    "blogPosts",
  );
  const { lang } = useContext(I18nContext);

  return (
    <>
      <Link to={resolvePage(Pages.BlogList)}>{translate("genericBackButton", lang)}</Link>
      <Deferred isWaiting={isLoading}>
        {post ? (
          <BlogPostModule post={post} />
        ) : (
          <div className="module">
            <div className="module-content">{translate("blogPostPageNonexistant", lang)}</div>
          </div>
        )}
      </Deferred>
    </>
  );
};

export default BlogPostPage;
