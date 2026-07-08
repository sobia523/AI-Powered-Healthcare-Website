import { blogPosts } from '../data/blogData';

export const fetchBlogPosts = async (category = 'All') => {
  try {
    const res = await fetch('/api/blog');
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    return category === 'All'
      ? data
      : data.filter((post) => post.category === category);
  } catch (err) {
    console.warn('Failed to fetch blogs from API, falling back to static local data:', err);
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = category === 'All'
          ? blogPosts
          : blogPosts.filter((post) => post.category === category);
        resolve(filtered);
      }, 250);
    });
  }
};
