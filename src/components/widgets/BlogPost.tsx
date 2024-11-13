import { useContext } from "react";
import { BlogPost } from "../../api";
import { I18nContext } from "../../utils/i18n/i18n";

export interface BlogPostModuleProps {
  post: BlogPost;
}

const BlogPostModule = ({ post }: BlogPostModuleProps) => {
  const { lang } = useContext(I18nContext);
  return (
    <div className="module">
      <div className="module-header">
        <b>{post.title}</b>
        <br />
        {new Date(post.publishedAt * 1000).toLocaleString(lang)} - {post.author.username}
      </div>
      <div className="module-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default BlogPostModule;
