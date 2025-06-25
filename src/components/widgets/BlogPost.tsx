import { useContext } from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../../api";
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
        {new Date(post.publishedAt * 1000).toLocaleString(lang)} -{" "}
        <PlayerMention playerOrId={post.authorId} />
      </div>
      <div className="blog-post" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default BlogPostModule;
