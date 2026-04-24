import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load blog posts
    setLoading(false);
  }, [selectedCategory]);

  const categories = ['all', 'Prompting', 'AI Governance', 'Best Practices', 'Case Studies'];

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-4 border-dark p-6 retro-box mb-12">
          <h1 className="text-4xl font-bold font-mono text-dark mb-2">Blog</h1>
          <p className="text-dark">Latest insights and articles</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-4 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 border-3 border-dark font-mono font-bold transition-colors ${
                selectedCategory === cat
                  ? 'retro-btn-primary'
                  : 'retro-btn'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-16 retro-box p-8">
            <p className="text-dark text-lg mb-4">No blog posts yet</p>
            <p className="text-dark/70">Check back soon for latest articles</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blog/${post.id}`)}
                className="border-4 border-dark p-8 retro-box cursor-pointer hover:bg-green-dark/5 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-dark mb-2">{post.title}</h2>
                    <p className="text-dark/70">{post.excerpt}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-dark">
                  <div className="flex gap-4 text-sm text-dark/70 font-mono">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <span className="px-3 py-1 border-2 border-dark text-sm font-mono font-bold">
                    {post.category}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
