import { Link } from "react-router";

import { Pages, resolvePage } from "../Pages";
import Deferred from "../../widgets/Deferred";
import { coreApi } from "../../../api";
import { useApi } from "../../../hooks";
import { useContext } from "react";
import { I18nContext, translate } from "../../../utils/i18n/i18n";

const BlogListPage = () => {
  const { isLoading, data: posts } = useApi(() => coreApi.coreBlogList(), [], "blogPosts");
  const { lang } = useContext(I18nContext);

  return (
    <>
      <h1>{translate("blogListPageHeading", lang)}</h1>
      <div className="module">
        <Deferred isWaiting={isLoading}>
          <table>
            <thead>
              <tr>
                <th>{translate("blogListPageTitleCol", lang)}</th>
                <th>{translate("blogListPageDateCol", lang)}</th>
                <th>{translate("blogListPageAuthorCol", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {posts?.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link to={resolvePage(Pages.BlogPost, { id: post.id })}>{post.title}</Link>
                  </td>
                  <td>{new Date(post.publishedAt * 1000).toLocaleDateString(lang)}</td>
                  <td>{post.author.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Deferred>
      </div>
    </>
  );
};

export default BlogListPage;
