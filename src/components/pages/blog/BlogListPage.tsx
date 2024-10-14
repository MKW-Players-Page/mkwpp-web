import { Link } from "react-router-dom";

import { Pages, resolvePage } from "../Pages";
import Deferred from "../../global/Deferred";
import { coreApi } from "../../../api";
import { useApi } from "../../../hooks";

const BlogListPage = () => {
  const { isLoading, data: posts } = useApi(() => coreApi.coreBlogList());

  return (
    <>
      <h1>News Archive</h1>
      <div className="module">
        <Deferred isWaiting={isLoading}>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {posts?.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link to={resolvePage(Pages.BlogPost, { id: post.id })}>{post.title}</Link>
                  </td>
                  <td>{post.publishedAt.toLocaleDateString()}</td>
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
