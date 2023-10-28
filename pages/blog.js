// pages/blog.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

function BlogPage({ posts }) {
  return (
    <div className="blog-page-content"> 
      <div className="blog-page">
        <ul>
          {posts.map((post, index) => (
            <li key={index}>
              <Link href={`/post/${post.slug}`}>
                {post.Title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BlogPage;

export async function getStaticProps() {
  const files = fs.readdirSync(path.join(process.cwd(), 'markdown'));
  const posts = files.map(file => {
    const slug = file.replace('.md', '');
    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), 'markdown', file),
      'utf-8'
    );
    const { data } = matter(markdownWithMeta);
    return {
      slug,
      Title: data.Title,
    };
  });
  return {
    props: {
      posts,
    },
  };
}
