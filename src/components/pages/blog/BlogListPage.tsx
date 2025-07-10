import { Link } from "react-router-dom";

import { Pages, resolvePage } from "../Pages";
import Deferred from "../../widgets/Deferred";
import { useApi } from "../../../hooks";
import { useContext } from "react";
import { I18nContext, translate } from "../../../utils/i18n/i18n";
import { BlogPost } from "../../../api";
import PlayerMention from "../../widgets/PlayerMention";
import { secondsToDate } from "../../../utils/DateUtils";

const BlogListPage = () => {
  const { isLoading, data: posts } = useApi(() => BlogPost.getList(2147483647), [], "blogPosts");
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
                  <td>{secondsToDate(post.publishedAt).toLocaleString(lang)}</td>
                  <td>
                    <PlayerMention playerOrId={post.authorId} />
                  </td>
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
