import { useContext } from "react";
import { Link } from "react-router";
import { BlogPost } from "../../api";
import { secondsToDate } from "../../utils/DateUtils";
import { I18nContext } from "../../utils/i18n/i18n";
import { Pages, resolvePage } from "../pages";
import "./BlogPost.css";
import PlayerMention from "./PlayerMention";

export interface BlogPostModuleProps {
  post: BlogPost;
  style?: React.CSSProperties;
}

const BlogPostModule = ({ post, style }: BlogPostModuleProps) => {
  const { lang } = useContext(I18nContext);
  return (
    <div style={style} className="module">
      <div className="module-header">
        {window.location.pathname === "/mkw/" ? (
          <Link to={resolvePage(Pages.BlogPost, { id: post.id })}>
            <b>{post.title}</b>
          </Link>
        ) : (
          <b>{post.title}</b>
        )}
        <br />
        {secondsToDate(post.publishedAt).toLocaleString(lang)} -{" "}
        {post.authorId ? (
          <PlayerMention playerOrId={post.authorId} />
        ) : post.username ? (
          post.username
        ) : (
          "???"
        )}
      </div>
      <div className="blog-post" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default BlogPostModule;
