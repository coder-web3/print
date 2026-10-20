import React, { useState, useEffect, useMemo } from 'react';
import './BlogDetailPage.css';
import { DEFAULT_BLOG_POSTS } from '../../data/blogData';

export default function BlogDetailPage({
  slug = '',
  blogContent = null,
  onNavigate = () => {},
  showNotification = () => {}
}) {
  const [activeSectionId, setActiveSectionId] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const posts = useMemo(() => {
    return blogContent?.posts || DEFAULT_BLOG_POSTS;
  }, [blogContent]);

  // Find active post
  const currentPost = useMemo(() => {
    const found = posts.find((p) => p.slug === slug || p.id === slug);
    return found || posts[0] || DEFAULT_BLOG_POSTS[0];
  }, [posts, slug]);

  // Related articles (other posts in same or general category, excluding current)
  const relatedPosts = useMemo(() => {
    return posts
      .filter((p) => p.id !== currentPost.id && p.status !== 'draft')
      .slice(0, 3);
  }, [posts, currentPost]);

  // Handle active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = currentPost.contentSections || [];
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const secElem = document.getElementById(sections[i].id);
        if (secElem && secElem.offsetTop <= scrollPos) {
          setActiveSectionId(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPost]);

  const scrollToSection = (secId) => {
    setActiveSectionId(secId);
    const elem = document.getElementById(secId);
    if (elem) {
      const yOffset = -90;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleShare = (network) => {
    const url = window.location.href;
    const title = currentPost.title;

    if (network === 'copy') {
      try {
        navigator.clipboard.writeText(url);
        if (showNotification) showNotification('success', 'Link Copied', 'Article link copied to clipboard!');
      } catch {
        if (showNotification) showNotification('info', 'Share Link', url);
      }
    } else if (network === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (network === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (network === 'pinterest') {
      window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(currentPost.featuredImage)}&description=${encodeURIComponent(title)}`, '_blank');
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    if (showNotification) {
      showNotification('success', 'Subscribed', `Thank you for subscribing with ${newsletterEmail}!`);
    }
    setNewsletterEmail('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(`/blog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularCategories = [
    { label: 'Engagement Gifts', path: '/engagement-gifts', icon: 'fa-solid fa-ring' },
    { label: 'Wedding Gifts', path: '/shop?cat=wedding', icon: 'fa-solid fa-wine-glass' },
    { label: 'Birthday Gifts', path: '/shop?cat=birthday', icon: 'fa-solid fa-cake-candles' },
    { label: 'Home Decor Gifts', path: '/shop?cat=home-decor', icon: 'fa-solid fa-house' },
    { label: 'Corporate Gifts', path: '/category/Corporate%20Gifts', icon: 'fa-solid fa-briefcase' }
  ];

  return (
    <div className="blog-detail-wrapper">
      {/* ── 1. BREADCRUMBS ───────────────────────────────────── */}
      <nav className="blog-breadcrumb-nav" aria-label="Breadcrumb">
        <ul className="blog-breadcrumb-list">
          <li>
            <a
              href="#home"
              className="blog-breadcrumb-link"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('/');
              }}
            >
              <i className="fa-solid fa-house" style={{ fontSize: '11px', marginRight: '4px' }}></i>
              Home
            </a>
          </li>
          <li className="blog-breadcrumb-divider">/</li>
          <li>
            <a
              href="#blog"
              className="blog-breadcrumb-link"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('/blog');
              }}
            >
              Blog
            </a>
          </li>
          <li className="blog-breadcrumb-divider">/</li>
          <li>
            <span className="blog-breadcrumb-link">
              {currentPost.category} Gifts
            </span>
          </li>
          <li className="blog-breadcrumb-divider">/</li>
          <li className="blog-breadcrumb-current" aria-current="page">
            {currentPost.title}
          </li>
        </ul>
      </nav>

      {/* ── 2. 3-COLUMN DETAIL LAYOUT ───────────────────────── */}
      <div className="blog-detail-layout">
        {/* Left Sidebar: Table of Contents */}
        <aside className="blog-toc-sidebar">
          <div className="blog-toc-card">
            <h4 className="blog-toc-title">Table of Contents</h4>
            <nav className="blog-toc-nav">
              {(currentPost.tableOfContents || []).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`blog-toc-item ${activeSectionId === item.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Center Main Article Column */}
        <main className="blog-article-content">
          <span className="blog-article-cat-badge">{currentPost.category}</span>
          <h1 className="blog-article-title">
            {currentPost.title}
          </h1>
          <p className="blog-article-lead">{currentPost.excerpt}</p>

          {/* Author & Meta Row */}
          <div className="blog-article-meta-row">
            <div className="blog-author-meta">
              <img
                src={currentPost.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={currentPost.author?.name || 'Author'}
                className="blog-author-avatar"
              />
              <div className="blog-author-info">
                <span className="blog-author-name">By {currentPost.author?.name || 'Fine Gift Studio'}</span>
                <div className="blog-publish-meta">
                  <span>
                    <i className="fa-regular fa-calendar"></i>
                    {currentPost.publishedAt}
                  </span>
                  <span>
                    <i className="fa-regular fa-clock"></i>
                    {currentPost.readTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="blog-share-row">
              <span className="blog-share-label">Share this article:</span>
              <div className="blog-share-btns">
                <button
                  type="button"
                  className="blog-share-btn"
                  title="Share on Facebook"
                  onClick={() => handleShare('facebook')}
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </button>
                <button
                  type="button"
                  className="blog-share-btn"
                  title="Share on Twitter"
                  onClick={() => handleShare('twitter')}
                >
                  <i className="fa-brands fa-twitter"></i>
                </button>
                <button
                  type="button"
                  className="blog-share-btn"
                  title="Share on Pinterest"
                  onClick={() => handleShare('pinterest')}
                >
                  <i className="fa-brands fa-pinterest-p"></i>
                </button>
                <button
                  type="button"
                  className="blog-share-btn"
                  title="Copy Link"
                  onClick={() => handleShare('copy')}
                >
                  <i className="fa-solid fa-link"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Featured Large Image */}
          <div className="blog-article-featured-img-wrap">
            <img
              src={currentPost.featuredImage}
              alt={currentPost.title}
              className="blog-article-featured-img"
            />
          </div>

          {/* Article Sections */}
          <div className="blog-article-sections">
            {(currentPost.contentSections || []).map((sec, idx) => (
              <React.Fragment key={sec.id || idx}>
                <section id={sec.id} className="blog-body-section">
                  <h2 className="blog-section-heading">{sec.heading}</h2>
                  <p className="blog-section-body">{sec.body}</p>
                </section>

                {/* Callout Quote placed right after Introduction */}
                {idx === 0 && currentPost.quote && (
                  <div className="blog-callout-quote-box">
                    <i className="fa-solid fa-quote-left blog-quote-icon"></i>
                    <p className="blog-quote-text">"{currentPost.quote}"</p>
                    <div className="blog-quote-decoration">
                      <div className="blog-quote-line"></div>
                      <i className="fa-solid fa-heart blog-quote-heart"></i>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Article Footer Navigation */}
          <div className="blog-article-footer-nav">
            <button
              type="button"
              className="blog-back-btn"
              onClick={() => {
                if (onNavigate) onNavigate('/blog');
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to All Articles
            </button>
            <button
              type="button"
              className="admin-btn-primary"
              style={{ padding: '10px 20px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={() => {
                if (onNavigate) onNavigate('/shop');
              }}
            >
              <i className="fa-solid fa-gift"></i>
              Shop Personalised Gifts
            </button>
          </div>
        </main>

        {/* Right Sidebar Widgets */}
        <aside className="blog-detail-sidebar">
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

          {/* Widget 2: Related Articles */}
          <div className="blog-widget-card">
            <div className="blog-widget-header">
              <h4 className="blog-widget-title">
                <i className="fa-solid fa-book-open"></i> Related Articles
              </h4>
            </div>

            <div className="blog-related-list">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id || rel.slug}
                  className="blog-related-item"
                  onClick={() => {
                    if (onNavigate) onNavigate(`/blog/${rel.slug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <img
                    src={rel.featuredImage}
                    alt={rel.title}
                    className="blog-related-thumb"
                  />
                  <div className="blog-related-meta">
                    <h5 className="blog-related-title">{rel.title}</h5>
                    <span className="blog-related-time">
                      <i className="fa-regular fa-calendar"></i>
                      {rel.publishedAt} · {rel.readTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

          {/* Widget 4: Popular Categories */}
          <div className="blog-widget-card">
            <div className="blog-widget-header">
              <h4 className="blog-widget-title">Popular Categories</h4>
              <span
                className="blog-widget-link"
                onClick={() => {
                  if (onNavigate) onNavigate('/shop');
                }}
              >
                View All <i className="fa-solid fa-arrow-right"></i>
              </span>
            </div>

            <div className="blog-popular-cats-list">
              {popularCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="blog-popular-cat-item"
                  onClick={() => {
                    if (onNavigate) onNavigate(cat.path);
                  }}
                >
                  <span>
                    <i className={`${cat.icon} cat-ico`}></i>
                    {cat.label}
                  </span>
                  <i className="fa-solid fa-chevron-right cat-arrow"></i>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
