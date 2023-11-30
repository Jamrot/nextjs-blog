// pages/blog.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';

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
              <br/>{post.Text}
              <br/>{post.Tags}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// export default BlogPage;

export async function getStaticProps() {
  const files = fs.readdirSync(path.join(process.cwd(), 'markdown'));
  let tagsMap = {};

  const posts = files.map(file => {
    const slug = file.replace('.md', '');
    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), 'markdown', file),
      'utf-8'
    );
    const { data } = matter(markdownWithMeta);
  //   return {
  //     slug,
  //     Title: data.Title,
  //     Tags: data.Tags,
  //     Text: data.Text,
  //   };
  // });
  
  let tags = Array.isArray(data.Tags) ? data.Tags : [data.Tags];
  tags.forEach(tag => {
    if (!tagsMap[tag]) {
      tagsMap[tag] = [];
    }
    tagsMap[tag].push({ 
      slug, 
      Title: data.Title || '', 
      Text: data.Text || '' ,
      Year: data.Year || '',
    });
  });

  return {
    slug,
    Title: data.Title || '',
    Tags: data.Tags || [],
    Text: data.Text || '',
    Year: data.Year || '',
  };
});

  return {
    props: {
      posts,
      tagsMap
    },
  };
}

function TagsPage({ tagsMap }) {
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const getAllPosts = () => {
    const allPosts = Object.values(tagsMap).flat();
    const uniquePosts = [];
    const seenSlugs = new Set();

    allPosts.forEach(post => {
      if (!seenSlugs.has(post.slug)) {
        uniquePosts.push(post);
        seenSlugs.add(post.slug);
      }
    });

    return uniquePosts;
  };

  const sortedPosts = useMemo(() => {
    const postsToSort = selectedTag ? tagsMap[selectedTag] : getAllPosts();
    return postsToSort.slice().sort((a, b) => {
      const yearA = a.Year.toString();
      const yearB = b.Year.toString();
  
      if (sortOrder === 'asc') {
        return yearA.localeCompare(yearB);
      } else {
        return yearB.localeCompare(yearA);
      }
    });
  }, [tagsMap, selectedTag, sortOrder]);
  
  

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="blog-page-content">
      <button onClick={toggleSortOrder}>
        Sort by Year ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>

      <div className="tags-list">
        <button onClick={() => setSelectedTag(null)}>All</button>
        {Object.keys(tagsMap).map(tag => (
          <button key={tag} onClick={() => setSelectedTag(tag)}>
            {tag}
          </button>
        ))}
      </div>
      <div className="blog-page"> 
        <ul>
        {selectedTag
            ? tagsMap[selectedTag].map(post => (
                <li key={post.slug}>
                  <Link href={`/post/${post.slug}`}>
                    {post.Title}
                  </Link>
                  <br/>{post.Text}
                  <br/>{Array.isArray(post.Tags) ? post.Tags.join(', ') : post.Tags}
                </li>
              ))
            : getAllPosts().map(post => (
                <li key={post.slug}>
                  <Link href={`/post/${post.slug}`}>
                    {post.Title}
                  </Link>
                  <br/>{post.Text}
                  <br/>{Array.isArray(post.Tags) ? post.Tags.join(', ') : post.Tags}
                </li>
              ))
          }
        </ul>
      </div>
    </div>
  );
}

export default TagsPage;
