import { BlogPost } from "../../api";

export interface BlogPostModuleProps {
  post: BlogPost;
}

const BlogPostModule = ({ post }: BlogPostModuleProps) => {
  return (
    <div className="module">
      <div className="module-header">
        <b>{post.title}</b>
        <br />
        {post.publishedAt.toLocaleString()} - {post.author.username}
      </div>
      <div className="module-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default BlogPostModule;
