// pages/blog.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import React, { useState, useMemo } from 'react';


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
        Tags: data.Tags || [],
        Conference: data.Conference || '',
      });
    });

    return {
      slug,
      Title: data.Title || '',
      Tags: data.Tags || [],
      Text: data.Text || '',
      Year: data.Year || '',
      Conference: data.Conference || '',
    };
  });

  return {
    props: {
      posts,
      tagsMap
    },
  };
}

function BlogPage({ tagsMap }) {
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortKey, setSortKey] = useState('Year'); // 'Year' or 'Title'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  const sortPosts = (posts) => {
    return posts.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (sortKey === 'Year') {
        valA = valA.toString();
        valB = valB.toString();
      }
      if (sortOrder === 'asc') {
        return valA.localeCompare(valB);
      } else {
        return valB.localeCompare(valA);
      }
    });
  };

  const getAllPostsSorted = () => {
    let allPosts = getAllPosts();
    return sortPosts(allPosts);
  };

  const getPostsByTagSorted = (tag) => {
    const postsByTag = tagsMap[tag] || [];
    return sortPosts(postsByTag);
  };

  const filterPosts = (posts) => {
    return posts.filter((post) => {
      const searchContent = `${post.Conference || ''} ${post.Year || ''} ${post.Title || ''} ${post.Text || ''}`.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  };

  return (
    <div className="blog-page">
      <div className='post-find'>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-options">
          <button onClick={() => { setSortKey('Year'); setSortOrder('asc'); }}>
            Year↑
          </button>
          <button onClick={() => { setSortKey('Year'); setSortOrder('desc'); }}>
            Year↓
          </button>
          <button onClick={() => { setSortKey('Title'); setSortOrder('asc'); }}>
            A-Z
          </button>
          <button onClick={() => { setSortKey('Title'); setSortOrder('desc'); }}>
            Z-A
          </button>
        </div>
      </div>

      <div className="tags-list">
        <button onClick={() => handleTagClick(null)} className={selectedTag ? 'active-tag' : ''}>
          All
        </button>
        {Object.keys(tagsMap).map(tag => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={selectedTag === tag ? 'active-tag' : ''}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="blog-post"> 
        <ul>
        {selectedTag
          // ? sortPosts(tagsMap[selectedTag]).map(post => (
          // ? tagsMap[selectedTag].map(post => (
          // ? filterPosts(tagsMap[selectedTag]).map(post => (
          ? filterPosts(getPostsByTagSorted(selectedTag)).map(post => (
            <li key={post.slug}>
              <Link href={`/post/${post.slug}`}>
                {post.Conference && post.Year && post.Title ? `${post.Conference} ${post.Year} | ${post.Title}` : post.Title}
              </Link>
              <br/>{post.Text}
              <br/>
              {post.Tags.map(tag => (
                <button key={tag} onClick={() => handleTagClick(tag)}>
                  {tag}
                </button>
              ))}
            </li>
          ))
          // : getAllPosts().map(post => (
          // : getAllPostsSorted().map(post => (
          // : filterPosts(getAllPostsSorted()).map(post => (
          : filterPosts(getAllPostsSorted()).map(post => (
            <li key={post.slug}>
              <Link href={`/post/${post.slug}`}>
                {post.Conference && post.Year && post.Title ? `${post.Conference} ${post.Year} | ${post.Title}` : post.Title}
              </Link>
              <br/>{post.Text}
              <br/>
              {post.Tags.map(tag => (
                <button key={tag} onClick={() => handleTagClick(tag)}>
                  {tag}
                </button>
              ))}
            </li>
          ))
        }
        </ul>
      </div>
    </div>
  );
}

export default BlogPage;
