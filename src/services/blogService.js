import { blogPosts } from '../data/blogData';

export const fetchBlogPosts = async (category = 'All') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = category === 'All'
        ? blogPosts
        : blogPosts.filter((post) => post.category === category);
      resolve(filtered);
    }, 250);
  });
};
