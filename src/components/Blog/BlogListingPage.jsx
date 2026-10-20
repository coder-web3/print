import React, { useState, useMemo } from 'react';
import './BlogListingPage.css';
import { BLOG_CATEGORIES } from '../../data/blogData';

export default function BlogListingPage({
  blogContent = null,
  onNavigate = () => {},
  showNotification = () => {}
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const posts = useMemo(() => {
    return blogContent?.posts || [];
  }, [blogContent]);

  const hero = useMemo(() => {
    return (
      blogContent?.hero || {
        tag: 'OUR BLOG',
        title: 'Thoughtful Ideas',
        titleHighlight: 'for Every Occasion',
        desc: 'Explore gift guides, creative ideas, personalisation tips and inspiration to make every moment special.',
        heroImage: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=85'
      }
    );
  }, [blogContent]);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Exclude drafts from storefront
      if (post.status === 'draft') return false;

      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory =
          post.categorySlug === selectedCategory ||
          post.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === 'gift-ideas' && post.category === 'Gift Ideas') ||
          (selectedCategory === 'occasions' && (post.category === 'Engagement' || post.category === 'Birthday' || post.category === 'Occasions')) ||
          (selectedCategory === 'personalisation' && (post.category === 'Personalisation' || post.category === 'Home Decor')) ||
          (selectedCategory === 'corporate' && post.category === 'Corporate Gifts');
        if (!matchesCategory) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title?.toLowerCase().includes(q);
        const matchesExcerpt = post.excerpt?.toLowerCase().includes(q);
        const matchesCategory = post.category?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesExcerpt && !matchesCategory) return false;
      }

      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Trending Posts (top 5)
  const trendingPosts = useMemo(() => {
    const list = posts.filter((p) => p.status !== 'draft' && p.trending);
    list.sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));
    return list.slice(0, 5);
  }, [posts]);

  // Pagination (6 posts per page matching UI mockup)
  const POSTS_PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = filteredPosts.slice(
    (currentPageNum - 1) * POSTS_PER_PAGE,
    currentPageNum * POSTS_PER_PAGE
  );

  const handlePostClick = (post) => {
    if (onNavigate) {
      onNavigate(`/blog/${post.slug}`);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setCurrentPageNum(1);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    if (showNotification) {
      showNotification('success', 'Subscribed to Blog', `You are now subscribed with ${newsletterEmail}!`);
    }
    setNewsletterEmail('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPageNum(1);
  };

  return (
    <div className="blog-page-wrapper">
      {/* ── 1. HERO SECTION ───────────────────────────────────── */}
      <section className="blog-hero-section">
        <div className="blog-hero-container">
          <div className="blog-hero-content">
            <span className="blog-hero-tag">— {hero.tag || 'OUR BLOG'} —</span>
            <h1 className="blog-hero-title">
              {hero.title || 'Thoughtful Ideas'}
              <span className="title-highlight">{hero.titleHighlight || 'for Every Occasion'}</span>
            </h1>
            <p className="blog-hero-desc">
              {hero.desc || 'Explore gift guides, creative ideas, personalisation tips and inspiration to make every moment special.'}
            </p>
          </div>

          <div className="blog-hero-visual">
            <div className="blog-hero-img-wrap">
              <img
                src={hero.heroImage || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=85'}
                alt="Studio Gift Ideas"
                className="blog-hero-img"
              />
              <div className="blog-hero-badge">
                <i className="fa-solid fa-gift"></i>
                <span>Good Ideas Brighter Moments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CATEGORY FILTER PILLS ──────────────────────────── */}
      <div className="blog-categories-bar">
        <div className="blog-pills-scroll">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`blog-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat.id)}
            >
              <i className={cat.icon}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. MAIN CONTENT: GRID & SIDEBAR ───────────────────── */}
      <div className="blog-main-layout">
        {/* Left Side: Articles Grid + Pagination */}
        <div className="blog-content-left">
          <div className="blog-articles-grid">
            {paginatedPosts.length === 0 ? (
              <div className="blog-empty-state">
                <i className="fa-regular fa-newspaper blog-empty-icon"></i>
                <h3>No articles found</h3>
                <p>Try selecting another category or adjusting your search keyword.</p>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  style={{ marginTop: '12px' }}
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              paginatedPosts.map((post) => (
                <article
                  key={post.id || post.slug}
                  className="blog-post-card"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="blog-card-media">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="blog-card-img"
                      loading="lazy"
                    />
                    <span className="blog-card-cat-badge">{post.category}</span>
                  </div>

                  <div className="blog-card-body">
                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-footer">
                      <div className="blog-card-meta">
                        <span>
                          <i className="fa-regular fa-calendar"></i>
                          {post.publishedAt}
                        </span>
                        <span>
                          <i className="fa-regular fa-clock"></i>
                          {post.readTime}
                        </span>
                      </div>
                      <span className="blog-card-arrow-btn" aria-label="Read Post">
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="blog-pagination">
              <button
                type="button"
                className="blog-page-btn"
                disabled={currentPageNum === 1}
                onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                aria-label="Previous Page"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`blog-page-btn ${currentPageNum === num ? 'active' : ''}`}
                  onClick={() => setCurrentPageNum(num)}
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                className="blog-page-btn"
                disabled={currentPageNum === totalPages}
                onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
                aria-label="Next Page"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Sidebar Widgets */}
        <aside className="blog-sidebar">
          {/* Widget 1: Search Blog */}
          <div className="blog-widget-card">
            <h4 className="blog-widget-title" style={{ marginBottom: '14px' }}>Search Blog</h4>
            <form className="blog-search-box" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="blog-search-input"
                placeholder="Search articles, gift ideas, tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="blog-search-submit-btn" aria-label="Search">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>

          {/* Widget 2: Trending Articles */}
          {trendingPosts.length > 0 && (
            <div className="blog-widget-card">
              <div className="blog-widget-header">
                <h4 className="blog-widget-title">
                  <i className="fa-solid fa-fire-flame-curved"></i> Trending Articles
                </h4>
                <span
                  className="blog-widget-link"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                >
                  View All <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>

              <div className="blog-trending-list">
                {trendingPosts.map((tr, idx) => (
                  <div
                    key={tr.id || tr.slug}
                    className="blog-trending-item"
                    onClick={() => handlePostClick(tr)}
                  >
                    <span className="blog-trending-rank">{idx + 1}</span>
                    <img
                      src={tr.featuredImage}
                      alt={tr.title}
                      className="blog-trending-thumb"
                    />
                    <h5 className="blog-trending-title">{tr.title}</h5>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Widget 3: Newsletter Box */}
          <div className="blog-widget-card blog-newsletter-card">
            <div className="blog-newsletter-header">
              <i className="fa-solid fa-envelope blog-newsletter-ico"></i>
              <h4>Get New Gift Ideas Delivered to Your Inbox</h4>
            </div>
            <p className="blog-newsletter-desc">
              Subscribe to our blog for the latest gift ideas, tips, and special offers.
            </p>
            <form className="blog-newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                className="blog-newsletter-input"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="blog-newsletter-btn" aria-label="Subscribe">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
