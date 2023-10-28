// pages/post/[slug].js
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function PostPage({ mdxSource }) {
  return (
    <div className="content">
      <MDXRemote {...mdxSource} />
    </div>);
}

export default PostPage;

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join(process.cwd(), 'markdown'));
  const paths = files.map(file => ({
    params: { slug: file.replace('.md', '') },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'markdown', `${slug}.md`),
    'utf-8'
  );
  const { content } = matter(markdownWithMeta);
  const mdxSource = await serialize(content);
  return {
    props: {
      mdxSource,
    },
  };
}
