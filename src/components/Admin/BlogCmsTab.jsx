import React, { useState } from 'react';
import { BLOG_CATEGORIES, DEFAULT_BLOG_CONTENT, DEFAULT_BLOG_POSTS } from '../../data/blogData';

export default function BlogCmsTab({
  localBlogContent,
  setLocalBlogContent,
  handleSaveBlogContent,
  isBlogSaving = false,
  onNavigate,
  showNotification
}) {
  const [activeSubTab, setActiveSubTab] = useState('posts'); // 'posts' | 'hero'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingPost, setEditingPost] = useState(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);

  const posts = localBlogContent?.posts || DEFAULT_BLOG_POSTS;
  const hero = localBlogContent?.hero || DEFAULT_BLOG_CONTENT.hero;

  // KPIs
  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftsCount = posts.filter((p) => p.status === 'draft').length;
  const trendingCount = posts.filter((p) => p.trending).length;

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    if (categoryFilter !== 'all' && post.categorySlug !== categoryFilter && post.category !== categoryFilter) {
      return false;
    }
    if (statusFilter !== 'all' && post.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title?.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt?.toLowerCase().includes(q);
      const matchCat = post.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchCat) return false;
    }
    return true;
  });

  // Hero section update
  const handleUpdateHero = (field, val) => {
    setLocalBlogContent((prev) => ({
      ...prev,
      hero: {
        ...(prev.hero || DEFAULT_BLOG_CONTENT.hero),
        [field]: val
      }
    }));
  };

  // Open editor for a new post
  const handleOpenCreateModal = () => {
    const newId = `post-${Date.now()}`;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setEditingPost({
      id: newId,
      slug: 'new-gift-ideas-article',
      title: 'New Thoughtful Gift Guide',
      titleHighlight: '',
      category: 'Gift Ideas',
      categorySlug: 'gift-ideas',
      excerpt: 'Discover creative and inspiring gift ideas crafted to celebrate every milestone.',
      featuredImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=85',
      author: {
        name: 'Fine Gift Studio',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      },
      publishedAt: today,
      readTime: '5 min read',
      trending: false,
      trendingRank: null,
      status: 'published',
      quote: 'A thoughtful gift is more than just a present — it is a memory they will cherish forever.',
      tableOfContents: [
        { id: 'introduction', label: 'Introduction' },
        { id: 'section-1', label: '1. Curated Gift Selections' },
        { id: 'conclusion', label: 'Conclusion' }
      ],
      contentSections: [
        {
          id: 'introduction',
          heading: 'Introduction',
          body: 'Every special occasion deserves a gift that brings warmth, memories, and authentic personal meaning.'
        },
        {
          id: 'section-1',
          heading: '1. Curated Gift Selections',
          body: 'Personalised gifts combine bespoke craftsmanship with heartfelt sentiment to make anyone feel uniquely celebrated.'
        },
        {
          id: 'conclusion',
          heading: 'Conclusion',
          body: 'Choose from our studio collections to turn ordinary moments into unforgettable milestones.'
        }
      ]
    });
    setIsEditorModalOpen(true);
  };

  // Open editor for an existing post
  const handleOpenEditModal = (post) => {
    setEditingPost(JSON.parse(JSON.stringify(post)));
    setIsEditorModalOpen(true);
  };

  // Save changes from editor modal into local state
  const handleSaveModalPost = () => {
    if (!editingPost.title.trim()) {
      alert('Article title cannot be empty.');
      return;
    }
    const rawSlug = (editingPost.slug || '').trim() || (editingPost.title || '').trim();
    const slug = rawSlug
      .toLowerCase()
      .replace(/^\/?blog\//i, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Synchronize Table of Contents with Content Sections
    const updatedToc = (editingPost.contentSections || []).map((sec) => ({
      id: sec.id,
      label: sec.heading
    }));

    const finalPost = {
      ...editingPost,
      slug,
      tableOfContents: updatedToc
    };

    setLocalBlogContent((prev) => {
      const currentPosts = prev.posts || DEFAULT_BLOG_POSTS;
      const index = currentPosts.findIndex((p) => p.id === finalPost.id);
      let updatedPosts;
      if (index >= 0) {
        updatedPosts = [...currentPosts];
        updatedPosts[index] = finalPost;
      } else {
        updatedPosts = [finalPost, ...currentPosts];
      }
      return {
        ...prev,
        posts: updatedPosts
      };
    });

    setIsEditorModalOpen(false);
    if (showNotification) {
      showNotification('success', 'Post Updated', `"${finalPost.title}" ready to publish.`);
    }
  };

  // Delete post
  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setLocalBlogContent((prev) => ({
        ...prev,
        posts: (prev.posts || DEFAULT_BLOG_POSTS).filter((p) => p.id !== postId)
      }));
      if (showNotification) {
        showNotification('info', 'Article Removed', 'Post deleted from local content.');
      }
    }
  };

  // Toggle trending
  const handleToggleTrending = (postId) => {
    setLocalBlogContent((prev) => {
      const updated = (prev.posts || DEFAULT_BLOG_POSTS).map((p) => {
        if (p.id === postId) {
          const nextTrending = !p.trending;
          return {
            ...p,
            trending: nextTrending,
            trendingRank: nextTrending ? (p.trendingRank || 5) : null
          };
        }
        return p;
      });
      return { ...prev, posts: updated };
    });
  };

  // Toggle published / draft
  const handleToggleStatus = (postId) => {
    setLocalBlogContent((prev) => {
      const updated = (prev.posts || DEFAULT_BLOG_POSTS).map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            status: p.status === 'published' ? 'draft' : 'published'
          };
        }
        return p;
      });
      return { ...prev, posts: updated };
    });
  };

  // Add section inside editor modal
  const handleAddEditorSection = () => {
    const secId = `sec-${Date.now()}`;
    const nextIndex = (editingPost.contentSections?.length || 0) + 1;
    setEditingPost((prev) => ({
      ...prev,
      contentSections: [
        ...(prev.contentSections || []),
        {
          id: secId,
          heading: `${nextIndex}. New Section Heading`,
          body: 'Write your article section content here.'
        }
      ]
    }));
  };

  // Update section inside editor modal
  const handleUpdateEditorSection = (index, field, val) => {
    setEditingPost((prev) => {
      const sections = [...(prev.contentSections || [])];
      if (sections[index]) {
        sections[index] = { ...sections[index], [field]: val };
      }
      return { ...prev, contentSections: sections };
    });
  };

  // Move section inside editor modal
  const handleMoveEditorSection = (index, dir) => {
    setEditingPost((prev) => {
      const sections = [...(prev.contentSections || [])];
      const targetIndex = dir === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) return prev;
      const temp = sections[index];
      sections[index] = sections[targetIndex];
      sections[targetIndex] = temp;
      return { ...prev, contentSections: sections };
    });
  };

  // Delete section inside editor modal
  const handleDeleteEditorSection = (index) => {
    setEditingPost((prev) => {
      const sections = [...(prev.contentSections || [])];
      sections.splice(index, 1);
      return { ...prev, contentSections: sections };
    });
  };

  return (
    <div className="admin-cms-workspace">
      {/* ── TOP HEADER BAR ────────────────────────────────────── */}
      <div className="admin-workspace-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-newspaper" style={{ color: '#db2777' }}></i>
            Blog &amp; Gift Articles CMS
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
            Manage the studio blog listing page, article content, table of contents, and hero banner settings.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => {
              if (onNavigate) onNavigate('/blog');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            <span>View Live Blog</span>
          </button>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handleOpenCreateModal}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fdf2f8', color: '#db2777', borderColor: '#fce7f3' }}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Write Article</span>
          </button>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleSaveBlogContent}
            disabled={isBlogSaving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: '#db2777', borderColor: '#db2777' }}
          >
            <i className={`fa-solid ${isBlogSaving ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'}`}></i>
            <span>{isBlogSaving ? 'Saving...' : 'Save & Publish All'}</span>
          </button>
        </div>
      </div>

      {/* ── KPI STATS CARDS ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            <i className="fa-solid fa-newspaper"></i>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Total Articles</span>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{totalPosts}</h3>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Published</span>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{publishedCount}</h3>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            <i className="fa-solid fa-clock"></i>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Drafts</span>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{draftsCount}</h3>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            <i className="fa-solid fa-fire"></i>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Trending Highlights</span>
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{trendingCount}</h3>
          </div>
        </div>
      </div>

      {/* ── SUBTAB TOGGLES ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('posts')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 700,
            color: activeSubTab === 'posts' ? '#db2777' : '#64748b',
            borderBottom: activeSubTab === 'posts' ? '2px solid #db2777' : '2px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fa-solid fa-list"></i>
          <span>Articles Manager ({totalPosts})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('hero')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 700,
            color: activeSubTab === 'hero' ? '#db2777' : '#64748b',
            borderBottom: activeSubTab === 'hero' ? '2px solid #db2777' : '2px solid transparent',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className="fa-solid fa-image"></i>
          <span>Blog Hero Banner &amp; Intro</span>
        </button>
      </div>

      {/* ── SUBTAB 1: ARTICLES MANAGER ────────────────────────── */}
      {activeSubTab === 'posts' && (
        <div>
          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '18px', background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
              <input
                type="text"
                placeholder="Search articles by title, category, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-form-input"
                style={{ paddingLeft: '38px', height: '40px' }}
              />
            </div>

            <div style={{ width: '180px' }}>
              <select
                className="admin-form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ height: '40px' }}
              >
                <option value="all">All Categories</option>
                {BLOG_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div style={{ width: '160px' }}>
              <select
                className="admin-form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ height: '40px' }}
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Articles Table */}
          <div className="admin-panel-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                    <th style={{ padding: '14px 16px' }}>Article</th>
                    <th style={{ padding: '14px 16px' }}>Category</th>
                    <th style={{ padding: '14px 16px' }}>Date &amp; Time</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center' }}>Trending</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '40px 16px', textAlign: 'center', color: '#64748b' }}>
                        No articles match the current filter or search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                        {/* Article Info */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <img
                              src={post.featuredImage}
                              alt={post.title}
                              style={{ width: '64px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                            />
                            <div>
                              <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', marginBottom: '2px' }}>
                                {post.title}
                              </strong>
                              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                /blog/{post.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#fdf2f8', color: '#db2777', fontWeight: 700, fontSize: '11px', border: '1px solid #fce7f3' }}>
                            {post.category}
                          </span>
                        </td>

                        {/* Date & Time */}
                        <td style={{ padding: '14px 16px', color: '#64748b' }}>
                          <div>{post.publishedAt}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{post.readTime}</div>
                        </td>

                        {/* Trending Toggle */}
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleTrending(post.id)}
                            style={{
                              background: post.trending ? '#fef2f2' : '#f8fafc',
                              color: post.trending ? '#ef4444' : '#cbd5e1',
                              border: post.trending ? '1px solid #fecaca' : '1px solid #e2e8f0',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px'
                            }}
                            title={post.trending ? 'Remove from Trending list' : 'Feature in Trending list'}
                          >
                            <i className="fa-solid fa-fire"></i>
                          </button>
                        </td>

                        {/* Status Toggle */}
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(post.id)}
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: post.status === 'published' ? '#f0fdf4' : '#fffbeb',
                              color: post.status === 'published' ? '#16a34a' : '#d97706',
                              border: post.status === 'published' ? '1px solid #bbf7d0' : '1px solid #fde68a'
                            }}
                          >
                            {post.status === 'published' ? 'Published' : 'Draft'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              className="admin-btn-secondary"
                              onClick={() => {
                                if (onNavigate) onNavigate(`/blog/${post.slug}`);
                              }}
                              style={{ padding: '6px 10px', fontSize: '12px' }}
                              title="View on storefront"
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="admin-btn-secondary"
                              onClick={() => handleOpenEditModal(post)}
                              style={{ padding: '6px 10px', fontSize: '12px' }}
                              title="Edit Article"
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              style={{
                                padding: '6px 10px',
                                fontSize: '12px',
                                borderRadius: '6px',
                                border: '1px solid #fecaca',
                                background: '#fff1f2',
                                color: '#dc2626',
                                cursor: 'pointer'
                              }}
                              title="Delete Article"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBTAB 2: HERO BANNER SETTINGS ────────────────────── */}
      {activeSubTab === 'hero' && (
        <div className="admin-panel-card" style={{ maxWidth: '850px' }}>
          <div className="admin-panel-header">
            <h3 className="admin-panel-title">
              <i className="fa-solid fa-palette" style={{ color: '#db2777' }}></i> Blog Listing Hero Banner Settings
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Customize the headline, subtitle, and aesthetic showcase photograph at the top of the blog.
            </p>
          </div>

          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div className="admin-form-group">
              <label>Small Top Tag / Eyebrow</label>
              <input
                type="text"
                className="admin-form-input"
                value={hero.tag || ''}
                onChange={(e) => handleUpdateHero('tag', e.target.value)}
                placeholder="OUR BLOG"
              />
            </div>

            <div className="admin-form-group">
              <label>Main Headline</label>
              <input
                type="text"
                className="admin-form-input"
                value={hero.title || ''}
                onChange={(e) => handleUpdateHero('title', e.target.value)}
                placeholder="Thoughtful Ideas"
              />
            </div>

            <div className="admin-form-group">
              <label>Headline Highlight (Vibrant Pink Text)</label>
              <input
                type="text"
                className="admin-form-input"
                value={hero.titleHighlight || ''}
                onChange={(e) => handleUpdateHero('titleHighlight', e.target.value)}
                placeholder="for Every Occasion"
              />
            </div>

            <div className="admin-form-group full-width" style={{ gridColumn: '1 / -1' }}>
              <label>Hero Description / Subtitle</label>
              <textarea
                className="admin-form-textarea"
                rows={2}
                value={hero.desc || ''}
                onChange={(e) => handleUpdateHero('desc', e.target.value)}
                placeholder="Explore gift guides, creative ideas, personalisation tips and inspiration..."
              />
            </div>

            <div className="admin-form-group full-width" style={{ gridColumn: '1 / -1' }}>
              <label>Hero Showcase Image URL</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="admin-form-input"
                  value={hero.heroImage || ''}
                  onChange={(e) => handleUpdateHero('heroImage', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{ flex: 1 }}
                />
                {hero.heroImage && (
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => handleUpdateHero('heroImage', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=85')}
                  >
                    Reset Image
                  </button>
                )}
              </div>
              {hero.heroImage && (
                <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', maxHeight: '200px', border: '1px solid #e2e8f0' }}>
                  <img
                    src={hero.heroImage}
                    alt="Hero Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. ARTICLE EDIT / WRITE MODAL ─────────────────────── */}
      {isEditorModalOpen && editingPost && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '920px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  <i className="fa-solid fa-pen-fancy" style={{ color: '#db2777', marginRight: '8px' }}></i>
                  {editingPost.id.startsWith('post-') ? 'Edit Blog Article' : 'Write New Article'}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Configure details, table of contents, and rich story sections.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#94a3b8', cursor: 'pointer', padding: '4px 8px' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Article Title *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    placeholder="e.g. 10 Unique Engagement Gift Ideas for a Perfect Start"
                  />
                </div>

                <div className="admin-form-group">
                  <label>URL Slug</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={editingPost.slug || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    placeholder="10-unique-engagement-gift-ideas"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Display Category</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={editingPost.category || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    placeholder="e.g. Engagement, Gift Ideas"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category Filter Group</label>
                  <select
                    className="admin-form-select"
                    value={editingPost.categorySlug || 'gift-ideas'}
                    onChange={(e) => setEditingPost({ ...editingPost, categorySlug: e.target.value })}
                  >
                    {BLOG_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Reading Time Estimate</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={editingPost.readTime || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                    placeholder="5 min read"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Publish Date</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={editingPost.publishedAt || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, publishedAt: e.target.value })}
                    placeholder="Oct 18, 2026"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Publication Status</label>
                  <select
                    className="admin-form-select"
                    value={editingPost.status || 'published'}
                    onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value })}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden from Storefront)</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div className="admin-form-group">
                <label>Summary / Excerpt (Shows on Cards &amp; Subtitle)</label>
                <textarea
                  className="admin-form-textarea"
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Make their new journey special with thoughtful and personalised gifts..."
                />
              </div>

              {/* Featured Image */}
              <div className="admin-form-group">
                <label>Featured Cover Image URL</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={editingPost.featuredImage || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, featuredImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    style={{ flex: 1 }}
                  />
                  {editingPost.featuredImage && (
                    <img
                      src={editingPost.featuredImage}
                      alt="Cover Preview"
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              {/* Highlight Quote */}
              <div className="admin-form-group">
                <label>Featured Quote / Highlight Callout</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={editingPost.quote || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, quote: e.target.value })}
                  placeholder="A thoughtful gift is more than just a present — it's a memory they'll cherish forever."
                />
              </div>

              {/* Content Sections (Table of Contents & Paragraphs) */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                      Article Content Sections ({editingPost.contentSections?.length || 0})
                    </h4>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      These sections automatically generate the sticky Table of Contents and article chapters.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={handleAddEditorSection}
                    style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span>Add Section</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(editingPost.contentSections || []).map((sec, idx, arr) => (
                    <div
                      key={sec.id || idx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fce7f3', color: '#db2777', fontWeight: 700, fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={sec.heading || ''}
                            onChange={(e) => handleUpdateEditorSection(idx, 'heading', e.target.value)}
                            placeholder="Section Title (e.g. 1. Personalised Couple Gifts)"
                            style={{ fontWeight: 700, fontSize: '13px', flex: 1 }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveEditorSection(idx, 'up')}
                            style={{ padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                            title="Move Up"
                          >
                            <i className="fa-solid fa-arrow-up" style={{ fontSize: '10px' }}></i>
                          </button>
                          <button
                            type="button"
                            disabled={idx === arr.length - 1}
                            onClick={() => handleMoveEditorSection(idx, 'down')}
                            style={{ padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: idx === arr.length - 1 ? 'not-allowed' : 'pointer' }}
                            title="Move Down"
                          >
                            <i className="fa-solid fa-arrow-down" style={{ fontSize: '10px' }}></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEditorSection(idx)}
                            style={{ padding: '4px 6px', borderRadius: '4px', border: '1px solid #fecaca', background: '#fff1f2', cursor: 'pointer', color: '#dc2626' }}
                            title="Delete Section"
                          >
                            <i className="fa-solid fa-trash-can" style={{ fontSize: '10px' }}></i>
                          </button>
                        </div>
                      </div>

                      <textarea
                        className="admin-form-textarea"
                        rows={3}
                        value={sec.body || ''}
                        onChange={(e) => handleUpdateEditorSection(idx, 'body', e.target.value)}
                        placeholder="Write detailed paragraphs, tips, or product recommendations for this section..."
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#f8fafc' }}>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setIsEditorModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleSaveModalPost}
                style={{ background: '#db2777', borderColor: '#db2777', padding: '8px 20px' }}
              >
                <i className="fa-solid fa-check" style={{ marginRight: '6px' }}></i>
                Apply Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
