import { useEffect, useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';
import { blogCategories } from '../data/blogData';
import { fetchBlogPosts } from '../services/blogService';

function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const data = await fetchBlogPosts(activeCategory);
      setPosts(data);
      setLoading(false);
    };

    loadPosts();
  }, [activeCategory]);

  return (
    <>
      <ScrollReveal className="section">
        <div className="blog-toolbar">
          <div>
            <p className="muted">Healthy insights and practical guidance</p>
            <h1 className="section-title">Health Blog</h1>
          </div>
          <div className="category-filter">
            {blogCategories.map((category) => (
              <button
                key={category}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="card">Loading health articles...</div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-meta">
                  <span>{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <p className="muted">{post.date}</p>
                <RippleButton variant="secondary">Read More</RippleButton>
              </article>
            ))}
          </div>
        )}
      </ScrollReveal>
    </>
  );
}

export default BlogPage;
