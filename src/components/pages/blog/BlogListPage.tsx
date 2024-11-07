import { Link } from "react-router-dom";

import { Pages, resolvePage } from "../Pages";
import Deferred from "../../global/Deferred";
import { coreApi } from "../../../api";
import { useApi } from "../../../hooks";
import { useContext } from "react";
import { I18nContext } from "../../../utils/i18n/i18n";

const BlogListPage = () => {
  const { isLoading, data: posts } = useApi(() => coreApi.coreBlogList());
  const { translations, lang } = useContext(I18nContext);

  return (
    <>
      <h1>{translations.blogListPageHeading[lang]}</h1>
      <div className="module">
        <Deferred isWaiting={isLoading}>
          <table>
            <thead>
              <tr>
                <th>{translations.blogListPageTitleCol[lang]}</th>
                <th>{translations.blogListPageDateCol[lang]}</th>
                <th>{translations.blogListPageAuthorCol[lang]}</th>
              </tr>
            </thead>
            <tbody>
              {posts?.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link to={resolvePage(Pages.BlogPost, { id: post.id })}>{post.title}</Link>
                  </td>
                  <td>{post.publishedAt.toLocaleDateString(lang)}</td>
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
