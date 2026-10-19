import React, { useState } from 'react';
import { OCCASION_PRESET_TEMPLATES } from '../../data/occasionContentData';

export default function OccasionsCmsTab({
  localOccasionsContent,
  setLocalOccasionsContent,
  selectedOccasionId,
  setSelectedOccasionId,
  currentOccasion,
  mediaAssets = [],
  handleSetOccasionAsHomeBanner,
  handleSaveOccasionContent,
  handleCreateNewOccasion,
  handleDeleteOccasion,
  newOccasionForm,
  setNewOccasionForm,
  isNewOccasionModalOpen,
  setIsNewOccasionModalOpen,
  isOccasionSaving,
  onNavigate,
  showNotification
}) {
  const [subTab, setSubTab] = useState('hero');
  const [activeMediaTarget, setActiveMediaTarget] = useState(null); // { section, field, index? }

  // Update top-level field on current occasion
  const updateField = (field, val) => {
    setLocalOccasionsContent((prev) => {
      const occasions = (prev.occasions || []).map((o) => {
        if (o.id === currentOccasion.id) {
          return { ...o, [field]: val };
        }
        return o;
      });
      return { ...prev, occasions };
    });
  };

  // Update section object on current occasion
  const updateSection = (section, field, val) => {
    setLocalOccasionsContent((prev) => {
      const occasions = (prev.occasions || []).map((o) => {
        if (o.id === currentOccasion.id) {
          return {
            ...o,
            [section]: {
              ...(o[section] || {}),
              [field]: val
            }
          };
        }
        return o;
      });
      return { ...prev, occasions };
    });
  };

  // Update item in an array (e.g. features, filterPills, products)
  const updateArrayItem = (section, index, field, val) => {
    setLocalOccasionsContent((prev) => {
      const occasions = (prev.occasions || []).map((o) => {
        if (o.id === currentOccasion.id) {
          const target = o[section];
          if (Array.isArray(target)) {
            const arr = [...target];
            if (arr[index]) arr[index] = { ...arr[index], [field]: val };
            return { ...o, [section]: arr };
          } else if (target && Array.isArray(target.items)) {
            const arr = [...target.items];
            if (arr[index]) arr[index] = { ...arr[index], [field]: val };
            return { ...o, [section]: { ...target, items: arr } };
          } else if (target && Array.isArray(target.features)) {
            const arr = [...target.features];
            if (arr[index]) arr[index] = { ...arr[index], [field]: val };
            return { ...o, [section]: { ...target, features: arr } };
          } else if (target && Array.isArray(target.cards)) {
            const arr = [...target.cards];
            if (arr[index]) arr[index] = { ...arr[index], [field]: val };
            return { ...o, [section]: { ...target, cards: arr } };
          }
        }
        return o;
      });
      return { ...prev, occasions };
    });
  };

  // Add new item to an array
  const addArrayItem = (section, newItem) => {
    setLocalOccasionsContent((prev) => {
      const occasions = (prev.occasions || []).map((o) => {
        if (o.id === currentOccasion.id) {
          const target = o[section];
          if (Array.isArray(target)) {
            return { ...o, [section]: [...target, newItem] };
          } else if (target && Array.isArray(target.items)) {
            return { ...o, [section]: { ...target, items: [...target.items, newItem] } };
          }
        }
        return o;
      });
      return { ...prev, occasions };
    });
    if (showNotification) {
      showNotification('success', 'Item Added', `New item added.`);
    }
  };

  // Remove item from an array
  const removeArrayItem = (section, index) => {
    setLocalOccasionsContent((prev) => {
      const occasions = (prev.occasions || []).map((o) => {
        if (o.id === currentOccasion.id) {
          const target = o[section];
          if (Array.isArray(target)) {
            return { ...o, [section]: target.filter((_, i) => i !== index) };
          } else if (target && Array.isArray(target.items)) {
            return { ...o, [section]: { ...target, items: target.items.filter((_, i) => i !== index) } };
          }
        }
        return o;
      });
      return { ...prev, occasions };
    });
  };

  // Media picker selection handler
  const handleSelectMedia = (assetUrl) => {
    if (!activeMediaTarget) return;
    const { section, field, index } = activeMediaTarget;
    if (index !== undefined && index !== null) {
      updateArrayItem(section, index, field, assetUrl);
    } else if (section) {
      updateSection(section, field, assetUrl);
    } else {
      updateField(field, assetUrl);
    }
    setActiveMediaTarget(null);
    if (showNotification) {
      showNotification('info', 'Image Selected', `Image applied from Media Library.`);
    }
  };

  const occasionsList = localOccasionsContent?.occasions || [];

  return (
    <div className="admin-workspace">
      {/* ── 1. WORKSPACE PAGE HEADER ─────────────────────────────────── */}
      <div className="admin-page-header">
        <div>
          <h1>
            <i className="fa-solid fa-gem" style={{ color: '#db2777' }}></i> Occasions CMS &amp; Detail Pages
          </h1>
          <p className="admin-page-subtitle">
            Configure and edit occasion detail pages (Hero, Filter Pills, Popular Gifts, Mid Hamper Banner, Gifts for Him/Her, Why Choose Us, Reviews, and Newsletter) and feature any occasion on the Homepage.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => setIsNewOccasionModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fa-solid fa-plus"></i> Add New Occasion
          </button>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => onNavigate(`/${currentOccasion.slug || currentOccasion.id}`)}
            title="Preview live occasion detail page"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i> Preview Live Page
          </button>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleSaveOccasionContent}
            disabled={isOccasionSaving}
            style={{
              background: 'linear-gradient(135deg, #c40b90 0%, #db2777 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className={isOccasionSaving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-cloud-arrow-up'}></i>
            {isOccasionSaving ? 'Publishing...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* ── 2. OCCASION SELECTOR & TOP MANAGEMENT BAR ──────────────────── */}
      <div className="admin-occasion-selector-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Active Occasion:
          </span>
          <div className="admin-occasion-pills">
            {occasionsList.map((occ) => {
              const isActive = occ.id === currentOccasion.id;
              return (
                <button
                  key={occ.id}
                  type="button"
                  className={`admin-occasion-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedOccasionId(occ.id)}
                >
                  <i className="fa-solid fa-champagne-glasses"></i>
                  <span>{occ.name}</span>
                  {occ.isHomeBanner && (
                    <span className="admin-home-banner-indicator" title="Featured as Home Page Occasion Banner">
                      <i className="fa-solid fa-house"></i> Home Banner
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {currentOccasion.isHomeBanner ? (
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#047857',
                background: '#ecfdf5',
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid #a7f3d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa-solid fa-circle-check"></i> Featured on Homepage Banner
            </span>
          ) : (
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => handleSetOccasionAsHomeBanner(currentOccasion)}
              title="Set this occasion as the Homepage Feature Banner"
              style={{ fontSize: '12.5px', padding: '6px 14px' }}
            >
              <i className="fa-solid fa-star" style={{ color: '#eab308' }}></i> Feature on Homepage Banner
            </button>
          )}

          {occasionsList.length > 1 && (
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => handleDeleteOccasion(currentOccasion.id)}
              style={{ color: '#dc2626', borderColor: '#fca5a5', fontSize: '12.5px', padding: '6px 12px' }}
              title="Delete this occasion page"
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          )}
        </div>
      </div>

      {/* ── 3. SUB-NAVIGATION FOR OCCASION SECTIONS ─────────────────────── */}
      <div className="admin-cms-subnav" style={{ overflowX: 'auto', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`admin-cms-subtab-btn ${subTab === 'hero' ? 'active' : ''}`}
          onClick={() => setSubTab('hero')}
        >
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#db2777' }}></i> 1. Hero &amp; Quote Banner
        </button>
        <button
          type="button"
          className={`admin-cms-subtab-btn ${subTab === 'filters' ? 'active' : ''}`}
          onClick={() => setSubTab('filters')}
        >
          <i className="fa-solid fa-shapes" style={{ color: '#8b5cf6' }}></i> 2. Filter Pills
        </button>
        <button
          type="button"
          className={`admin-cms-subtab-btn ${subTab === 'popular' ? 'active' : ''}`}
          onClick={() => setSubTab('popular')}
        >
          <i className="fa-solid fa-fire" style={{ color: '#f59e0b' }}></i> 3. Popular Gifts Showcase
        </button>
        <button
          type="button"
          className={`admin-cms-subtab-btn ${subTab === 'midbanner' ? 'active' : ''}`}
          onClick={() => setSubTab('midbanner')}
        >
          <i className="fa-solid fa-gift" style={{ color: '#ec4899' }}></i> 4. Mid Hamper Banner
        </button>
        <button
          type="button"
          className={`admin-cms-subtab-btn ${subTab === 'him' ? 'active' : ''}`}
          onClick={() => setSubTab('him')}
        >
          <i className="fa-solid fa-person" style={{ color: '#0284c7' }}></i> 5. Gifts for Him
        </button>
        <button
          type="button"
          className={`admin-cms-subtab-btn ${subTab === 'her' ? 'active' : ''}`}
          onClick={() => setSubTab('her')}
        >
          <i className="fa-solid fa-person-dress" style={{ color: '#e11d48' }}></i> 6. Gifts for Her
        </button>
        <button
          type="button"
          className={`admin-cms-subtab-btn ${subTab === 'whychoose' ? 'active' : ''}`}
          onClick={() => setSubTab('whychoose')}
        >
          <i className="fa-solid fa-shield-heart" style={{ color: '#10b981' }}></i> 7. Why Choose Us
        </button>
        <button
          type="button"
          className={`admin-cms-subtab-btn ${subTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setSubTab('reviews')}
        >
          <i className="fa-solid fa-comments" style={{ color: '#6366f1' }}></i> 8. Customer Reviews
        </button>
        <button
          type="button"
          className={`admin-cms-subtab-btn ${subTab === 'newsletter' ? 'active' : ''}`}
          onClick={() => setSubTab('newsletter')}
        >
          <i className="fa-solid fa-envelope-open-text" style={{ color: '#d97706' }}></i> 9. Newsletter Strip
        </button>
        <button
          type="button"
          className={`admin-cms-subtab-btn ${subTab === 'general' ? 'active' : ''}`}
          onClick={() => setSubTab('general')}
        >
          <i className="fa-solid fa-gear" style={{ color: '#475569' }}></i> General &amp; Slug
        </button>
      </div>

      {/* ── 4. REUSABLE INLINE MEDIA LIBRARY ASSET PICKER ────────────────── */}
      {activeMediaTarget && (
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '2px solid #c40b90', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px' }}>
              <i className="fa-solid fa-photo-film" style={{ color: '#c40b90' }}></i> Choose Image from Studio Media Library ({mediaAssets.length} assets):
            </div>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => setActiveMediaTarget(null)}
              style={{ padding: '4px 10px', fontSize: '12px' }}
            >
              <i className="fa-solid fa-xmark"></i> Close Picker
            </button>
          </div>
          <div className="admin-media-picker-grid" style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {mediaAssets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                className="admin-media-picker-item"
                onClick={() => handleSelectMedia(asset.url)}
                title={`${asset.name} (${asset.dimensions || 'Image'})`}
              >
                <img src={asset.url} alt={asset.alt || asset.name} />
                <span style={{ fontSize: '11px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {asset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. SUBTAB 1: HERO SECTION & FLOATING QUOTE ─────────────────── */}
      {subTab === 'hero' && (
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div>
              <h3 className="admin-panel-title">Hero Section &amp; Celebration Visual</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Main top celebration banner with headline, romantic script quote, 3 feature pills, and graphic visual.
              </p>
            </div>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '20px' }}>
            <div className="admin-form-group">
              <label>Hero Tagline / Pill</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.hero?.tagline || ''}
                onChange={(e) => updateSection('hero', 'tagline', e.target.value)}
                placeholder="e.g. CELEBRATE TOGETHERNESS"
              />
            </div>
            <div className="admin-form-group">
              <label>CTA Button Text</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.hero?.ctaText || ''}
                onChange={(e) => updateSection('hero', 'ctaText', e.target.value)}
                placeholder="e.g. Explore Collection"
              />
            </div>
            <div className="admin-form-group">
              <label>Title Main (First Word/Part)</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.hero?.titleMain || ''}
                onChange={(e) => updateSection('hero', 'titleMain', e.target.value)}
                placeholder="e.g. Engagement"
              />
            </div>
            <div className="admin-form-group">
              <label>Title Highlight (Pink Accent Text)</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.hero?.titleHighlight || ''}
                onChange={(e) => updateSection('hero', 'titleHighlight', e.target.value)}
                placeholder="e.g. Gifts"
              />
            </div>
            <div className="admin-form-group full-width">
              <label>Hero Description</label>
              <textarea
                className="admin-form-textarea"
                rows={2}
                value={currentOccasion.hero?.description || ''}
                onChange={(e) => updateSection('hero', 'description', e.target.value)}
                placeholder="Thoughtful and personalised gifts to celebrate a beautiful new beginning."
              />
            </div>
            <div className="admin-form-group full-width">
              <label>Floating Script Romantic Quote</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.hero?.floatingQuote || ''}
                onChange={(e) => updateSection('hero', 'floatingQuote', e.target.value)}
                placeholder="e.g. Two Hearts One Beautiful Journey"
              />
            </div>
          </div>

          {/* Hero Visual Image */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#1e293b', marginBottom: '10px' }}>
              Hero Visual Graphic Image (Displayed in floating quote card)
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <img
                src={currentOccasion.hero?.image || '/assets/images/engagement-gifts-banner.png'}
                alt="Hero Visual Preview"
                style={{ width: '140px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                onError={(e) => { e.currentTarget.src = '/assets/images/engagement-gifts-banner.png'; }}
              />
              <div style={{ flex: 1, minWidth: '240px' }}>
                <input
                  type="text"
                  className="admin-form-input"
                  value={currentOccasion.hero?.image || ''}
                  onChange={(e) => updateSection('hero', 'image', e.target.value)}
                  placeholder="e.g. /assets/images/engagement-gifts-banner.png"
                  style={{ marginBottom: '8px' }}
                />
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setActiveMediaTarget({ section: 'hero', field: 'image' })}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="fa-solid fa-photo-film"></i> Choose from Media Library
                </button>
              </div>
            </div>
          </div>

          {/* 3 Hero Feature Pills */}
          <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#1e293b', marginBottom: '10px' }}>
            3 Hero Feature Pills
          </div>
          <div className="admin-form-grid">
            {(currentOccasion.hero?.features || []).map((feat, idx) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <label style={{ fontSize: '12px', color: '#64748b' }}>Feature #{idx + 1}</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={feat.icon || ''}
                    onChange={(e) => updateArrayItem('hero', idx, 'icon', e.target.value)}
                    style={{ width: '60px', textAlign: 'center' }}
                    placeholder="🌸"
                  />
                  <input
                    type="text"
                    className="admin-form-input"
                    value={feat.text || ''}
                    onChange={(e) => updateArrayItem('hero', idx, 'text', e.target.value)}
                    placeholder="e.g. Personalised Gifts"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. SUBTAB 2: QUICK FILTER PILLS ────────────────────────────── */}
      {subTab === 'filters' && (
        <div className="admin-panel-card">
          <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 className="admin-panel-title">Quick Category Filter Pills</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Interactive pills for quick catalog filtering by category tag.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => addArrayItem('filterPills', { id: `cat_${Date.now()}`, label: 'New Filter', icon: 'fa-solid fa-tag' })}
            >
              <i className="fa-solid fa-plus"></i> Add Filter Pill
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {(currentOccasion.filterPills || []).map((pill, idx) => (
              <div key={pill.id || idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    Pill #{idx + 1} ({pill.id})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('filterPills', idx)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}
                    title="Remove filter"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '40px', height: '36px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={pill.icon || 'fa-solid fa-tag'}></i>
                    </div>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={pill.label || ''}
                      onChange={(e) => updateArrayItem('filterPills', idx, 'label', e.target.value)}
                      placeholder="Label e.g. Photo Gifts"
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={pill.icon || ''}
                      onChange={(e) => updateArrayItem('filterPills', idx, 'icon', e.target.value)}
                      placeholder="Icon e.g. fa-solid fa-image"
                      style={{ flex: 1, fontSize: '12px' }}
                    />
                    <input
                      type="text"
                      className="admin-form-input"
                      value={pill.id || ''}
                      onChange={(e) => updateArrayItem('filterPills', idx, 'id', e.target.value)}
                      placeholder="tag id"
                      style={{ width: '90px', fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 7. SUBTAB 3: POPULAR GIFTS SHOWCASE ─────────────────────────── */}
      {subTab === 'popular' && (
        <div className="admin-panel-card">
          <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 className="admin-panel-title">Popular Gifts Showcase Section</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Featured curated product showcase cards displayed right below the category filter pills.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => {
                const newProd = {
                  id: `eng_pop_${Date.now()}`,
                  name: 'New Custom Gift',
                  price: 799,
                  originalPrice: 999,
                  rating: 4.8,
                  reviews: 45,
                  image: '/assets/images/frames.avif',
                  category: 'photo'
                };
                const items = [...(currentOccasion.popularGifts?.items || []), newProd];
                updateSection('popularGifts', 'items', items);
              }}
            >
              <i className="fa-solid fa-plus"></i> Add Product Card
            </button>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '20px' }}>
            <div className="admin-form-group">
              <label>Sub-tagline</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.popularGifts?.tagline || ''}
                onChange={(e) => updateSection('popularGifts', 'tagline', e.target.value)}
                placeholder="TRENDING NOW —"
              />
            </div>
            <div className="admin-form-group">
              <label>Section Heading</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.popularGifts?.heading || ''}
                onChange={(e) => updateSection('popularGifts', 'heading', e.target.value)}
                placeholder="Popular Engagement Gifts"
              />
            </div>
            <div className="admin-form-group">
              <label>View All Link</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.popularGifts?.viewAllLink || ''}
                onChange={(e) => updateSection('popularGifts', 'viewAllLink', e.target.value)}
                placeholder="/shop?cat=gifts"
              />
            </div>
            <div className="admin-form-group">
              <label>Subtitle / Description</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.popularGifts?.subtitle || ''}
                onChange={(e) => updateSection('popularGifts', 'subtitle', e.target.value)}
                placeholder="Make their special moment even more memorable..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(currentOccasion.popularGifts?.items || []).map((prod, idx) => (
              <div key={prod.id || idx} className="admin-occasion-item-card">
                <img
                  src={prod.image || '/assets/images/frames.avif'}
                  alt={prod.name}
                  className="admin-occasion-item-thumb"
                  onError={(e) => { e.currentTarget.src = '/assets/images/frames.avif'; }}
                />
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Product Title</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={prod.name || ''}
                      onChange={(e) => updateArrayItem('popularGifts', idx, 'name', e.target.value)}
                      placeholder="Product Name"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Sale Price (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={prod.price || ''}
                      onChange={(e) => updateArrayItem('popularGifts', idx, 'price', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Old Price (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={prod.originalPrice || ''}
                      onChange={(e) => updateArrayItem('popularGifts', idx, 'originalPrice', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Rating (★)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="admin-form-input"
                      value={prod.rating || ''}
                      onChange={(e) => updateArrayItem('popularGifts', idx, 'rating', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Reviews Count</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={prod.reviews || ''}
                      onChange={(e) => updateArrayItem('popularGifts', idx, 'reviews', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Category Tag</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={prod.category || ''}
                      onChange={(e) => updateArrayItem('popularGifts', idx, 'category', e.target.value)}
                      placeholder="e.g. photo, led, mugs"
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={prod.image || ''}
                      onChange={(e) => updateArrayItem('popularGifts', idx, 'image', e.target.value)}
                      placeholder="Image URL"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => setActiveMediaTarget({ section: 'popularGifts', field: 'image', index: idx })}
                      title="Choose from Media Library"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <i className="fa-solid fa-photo-film"></i> Media
                    </button>
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => {
                        const items = (currentOccasion.popularGifts?.items || []).filter((_, i) => i !== idx);
                        updateSection('popularGifts', 'items', items);
                      }}
                      style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                      title="Delete card"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 8. SUBTAB 4: MID HAMPER FEATURE BANNER ─────────────────────── */}
      {subTab === 'midbanner' && (
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div>
              <h3 className="admin-panel-title">Mid Feature Hamper Banner</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Center callout banner with 3-column layout: Left CTA, Center Hamper Visual with badge, Right 4 Value Pills.
              </p>
            </div>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '20px' }}>
            <div className="admin-form-group">
              <label>Tagline</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.midHamperBanner?.tagline || ''}
                onChange={(e) => updateSection('midHamperBanner', 'tagline', e.target.value)}
                placeholder="MAKE IT EXTRA SPECIAL"
              />
            </div>
            <div className="admin-form-group">
              <label>Floating Badge on Image</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.midHamperBanner?.floatBadge || ''}
                onChange={(e) => updateSection('midHamperBanner', 'floatBadge', e.target.value)}
                placeholder="Happy Engagement ❤️"
              />
            </div>
            <div className="admin-form-group">
              <label>Title Main</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.midHamperBanner?.titleMain || ''}
                onChange={(e) => updateSection('midHamperBanner', 'titleMain', e.target.value)}
                placeholder="Personalised"
              />
            </div>
            <div className="admin-form-group">
              <label>Title Highlight (Pink)</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.midHamperBanner?.titleHighlight || ''}
                onChange={(e) => updateSection('midHamperBanner', 'titleHighlight', e.target.value)}
                placeholder="Engagement Hampers"
              />
            </div>
            <div className="admin-form-group full-width">
              <label>Description</label>
              <textarea
                className="admin-form-textarea"
                rows={2}
                value={currentOccasion.midHamperBanner?.description || ''}
                onChange={(e) => updateSection('midHamperBanner', 'description', e.target.value)}
                placeholder="Curated with love, made for their new beginning."
              />
            </div>
            <div className="admin-form-group">
              <label>CTA Button Text</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.midHamperBanner?.ctaText || ''}
                onChange={(e) => updateSection('midHamperBanner', 'ctaText', e.target.value)}
                placeholder="Shop Hampers"
              />
            </div>
            <div className="admin-form-group">
              <label>CTA Button Link</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.midHamperBanner?.ctaLink || ''}
                onChange={(e) => updateSection('midHamperBanner', 'ctaLink', e.target.value)}
                placeholder="/shop?cat=packaging"
              />
            </div>
          </div>

          {/* Center Hamper Image */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#1e293b', marginBottom: '10px' }}>
              Hamper Center Graphic Image
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <img
                src={currentOccasion.midHamperBanner?.image || '/assets/images/packaging.avif'}
                alt="Hamper Visual"
                style={{ width: '120px', height: '100px', objectFit: 'contain', background: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                onError={(e) => { e.currentTarget.src = '/assets/images/packaging.avif'; }}
              />
              <div style={{ flex: 1, minWidth: '240px' }}>
                <input
                  type="text"
                  className="admin-form-input"
                  value={currentOccasion.midHamperBanner?.image || ''}
                  onChange={(e) => updateSection('midHamperBanner', 'image', e.target.value)}
                  placeholder="e.g. /assets/images/packaging.avif"
                  style={{ marginBottom: '8px' }}
                />
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setActiveMediaTarget({ section: 'midHamperBanner', field: 'image' })}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="fa-solid fa-photo-film"></i> Choose from Media Library
                </button>
              </div>
            </div>
          </div>

          {/* 4 Feature Pills on the Right */}
          <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#1e293b', marginBottom: '10px' }}>
            4 Hamper Right Feature Pills
          </div>
          <div className="admin-form-grid">
            {(currentOccasion.midHamperBanner?.features || []).map((feat, idx) => (
              <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <label style={{ fontSize: '12px', color: '#64748b' }}>Pill #{idx + 1}</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={feat.icon || ''}
                    onChange={(e) => updateArrayItem('midHamperBanner', idx, 'icon', e.target.value)}
                    style={{ width: '60px', textAlign: 'center' }}
                    placeholder="🎁"
                  />
                  <input
                    type="text"
                    className="admin-form-input"
                    value={feat.text || ''}
                    onChange={(e) => updateArrayItem('midHamperBanner', idx, 'text', e.target.value)}
                    placeholder="e.g. Customised Gifts"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 9. SUBTAB 5: GIFTS FOR HIM ─────────────────────────────────── */}
      {subTab === 'him' && (
        <div className="admin-panel-card">
          <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 className="admin-panel-title">Gifts for Him Section</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Showcase of personalized gifts for the groom or partner.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => {
                const newProd = {
                  id: `eng_him_${Date.now()}`,
                  name: 'New Gift for Him',
                  price: 699,
                  originalPrice: 899,
                  rating: 4.8,
                  reviews: 32,
                  image: '/assets/images/wallets.avif',
                  category: 'couple'
                };
                const items = [...(currentOccasion.giftsForHim?.items || []), newProd];
                updateSection('giftsForHim', 'items', items);
              }}
            >
              <i className="fa-solid fa-plus"></i> Add Product Card
            </button>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '20px' }}>
            <div className="admin-form-group">
              <label>Section Heading</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.giftsForHim?.heading || ''}
                onChange={(e) => updateSection('giftsForHim', 'heading', e.target.value)}
                placeholder="Gifts for Him"
              />
            </div>
            <div className="admin-form-group">
              <label>View All Link</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.giftsForHim?.viewAllLink || ''}
                onChange={(e) => updateSection('giftsForHim', 'viewAllLink', e.target.value)}
                placeholder="/shop?search=him"
              />
            </div>
            <div className="admin-form-group full-width">
              <label>Subtitle / Description</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.giftsForHim?.subtitle || ''}
                onChange={(e) => updateSection('giftsForHim', 'subtitle', e.target.value)}
                placeholder="Thoughtful gifts he'll always cherish."
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(currentOccasion.giftsForHim?.items || []).map((prod, idx) => (
              <div key={prod.id || idx} className="admin-occasion-item-card">
                <img
                  src={prod.image || '/assets/images/wallets.avif'}
                  alt={prod.name}
                  className="admin-occasion-item-thumb"
                  onError={(e) => { e.currentTarget.src = '/assets/images/wallets.avif'; }}
                />
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Product Title</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={prod.name || ''}
                      onChange={(e) => updateArrayItem('giftsForHim', idx, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Sale Price (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={prod.price || ''}
                      onChange={(e) => updateArrayItem('giftsForHim', idx, 'price', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Old Price (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={prod.originalPrice || ''}
                      onChange={(e) => updateArrayItem('giftsForHim', idx, 'originalPrice', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Rating (★)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="admin-form-input"
                      value={prod.rating || ''}
                      onChange={(e) => updateArrayItem('giftsForHim', idx, 'rating', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Reviews Count</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={prod.reviews || ''}
                      onChange={(e) => updateArrayItem('giftsForHim', idx, 'reviews', Number(e.target.value))}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={prod.image || ''}
                      onChange={(e) => updateArrayItem('giftsForHim', idx, 'image', e.target.value)}
                      placeholder="Image URL"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => setActiveMediaTarget({ section: 'giftsForHim', field: 'image', index: idx })}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <i className="fa-solid fa-photo-film"></i> Media
                    </button>
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => {
                        const items = (currentOccasion.giftsForHim?.items || []).filter((_, i) => i !== idx);
                        updateSection('giftsForHim', 'items', items);
                      }}
                      style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 10. SUBTAB 6: GIFTS FOR HER ─────────────────────────────────── */}
      {subTab === 'her' && (
        <div className="admin-panel-card">
          <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 className="admin-panel-title">Gifts for Her Section</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Showcase of personalized gifts for the bride or partner.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => {
                const newProd = {
                  id: `eng_her_${Date.now()}`,
                  name: 'New Gift for Her',
                  price: 899,
                  originalPrice: 1199,
                  rating: 4.9,
                  reviews: 40,
                  image: '/assets/images/lamps.avif',
                  category: 'led'
                };
                const items = [...(currentOccasion.giftsForHer?.items || []), newProd];
                updateSection('giftsForHer', 'items', items);
              }}
            >
              <i className="fa-solid fa-plus"></i> Add Product Card
            </button>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '20px' }}>
            <div className="admin-form-group">
              <label>Section Heading</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.giftsForHer?.heading || ''}
                onChange={(e) => updateSection('giftsForHer', 'heading', e.target.value)}
                placeholder="Gifts for Her"
              />
            </div>
            <div className="admin-form-group">
              <label>View All Link</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.giftsForHer?.viewAllLink || ''}
                onChange={(e) => updateSection('giftsForHer', 'viewAllLink', e.target.value)}
                placeholder="/shop?search=her"
              />
            </div>
            <div className="admin-form-group full-width">
              <label>Subtitle / Description</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.giftsForHer?.subtitle || ''}
                onChange={(e) => updateSection('giftsForHer', 'subtitle', e.target.value)}
                placeholder="Beautiful gifts for her special journey."
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(currentOccasion.giftsForHer?.items || []).map((prod, idx) => (
              <div key={prod.id || idx} className="admin-occasion-item-card">
                <img
                  src={prod.image || '/assets/images/lamps.avif'}
                  alt={prod.name}
                  className="admin-occasion-item-thumb"
                  onError={(e) => { e.currentTarget.src = '/assets/images/lamps.avif'; }}
                />
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Product Title</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={prod.name || ''}
                      onChange={(e) => updateArrayItem('giftsForHer', idx, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Sale Price (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={prod.price || ''}
                      onChange={(e) => updateArrayItem('giftsForHer', idx, 'price', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Old Price (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={prod.originalPrice || ''}
                      onChange={(e) => updateArrayItem('giftsForHer', idx, 'originalPrice', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Rating (★)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="admin-form-input"
                      value={prod.rating || ''}
                      onChange={(e) => updateArrayItem('giftsForHer', idx, 'rating', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Reviews Count</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      value={prod.reviews || ''}
                      onChange={(e) => updateArrayItem('giftsForHer', idx, 'reviews', Number(e.target.value))}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={prod.image || ''}
                      onChange={(e) => updateArrayItem('giftsForHer', idx, 'image', e.target.value)}
                      placeholder="Image URL"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => setActiveMediaTarget({ section: 'giftsForHer', field: 'image', index: idx })}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <i className="fa-solid fa-photo-film"></i> Media
                    </button>
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => {
                        const items = (currentOccasion.giftsForHer?.items || []).filter((_, i) => i !== idx);
                        updateSection('giftsForHer', 'items', items);
                      }}
                      style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 11. SUBTAB 7: WHY CHOOSE US ────────────────────────────────── */}
      {subTab === 'whychoose' && (
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div>
              <h3 className="admin-panel-title">Why Choose Us Section</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                4 key value propositions with icons, titles, and descriptions.
              </p>
            </div>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '20px' }}>
            <div className="admin-form-group">
              <label>Tagline</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.whyChoose?.tagline || ''}
                onChange={(e) => updateSection('whyChoose', 'tagline', e.target.value)}
                placeholder="WHY CHOOSE US"
              />
            </div>
            <div className="admin-form-group">
              <label>Heading</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.whyChoose?.heading || ''}
                onChange={(e) => updateSection('whyChoose', 'heading', e.target.value)}
                placeholder="Make Their Moment More Special"
              />
            </div>
            <div className="admin-form-group full-width">
              <label>Subtitle</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.whyChoose?.subtitle || ''}
                onChange={(e) => updateSection('whyChoose', 'subtitle', e.target.value)}
                placeholder="We create personalised gifts that add meaning to life's most beautiful moments."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {(currentOccasion.whyChoose?.cards || []).map((card, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>CARD #{idx + 1}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={card.icon || ''}
                    onChange={(e) => updateArrayItem('whyChoose', idx, 'icon', e.target.value)}
                    placeholder="Icon class e.g. fa-solid fa-gift"
                  />
                  <input
                    type="text"
                    className="admin-form-input"
                    value={card.title || ''}
                    onChange={(e) => updateArrayItem('whyChoose', idx, 'title', e.target.value)}
                    placeholder="Title e.g. Customised Gifts"
                  />
                  <textarea
                    className="admin-form-textarea"
                    rows={2}
                    value={card.desc || ''}
                    onChange={(e) => updateArrayItem('whyChoose', idx, 'desc', e.target.value)}
                    placeholder="Short description"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 12. SUBTAB 8: CUSTOMER REVIEWS ─────────────────────────────── */}
      {subTab === 'reviews' && (
        <div className="admin-panel-card">
          <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 className="admin-panel-title">Customer Reviews &amp; Testimonials Carousel</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Verified customer testimonials displayed in the interactive review carousel.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => {
                const newRev = {
                  id: `rev_${Date.now()}`,
                  name: 'Happy Customer',
                  city: 'Mumbai, India',
                  title: 'Wonderful Experience!',
                  comment: 'The quality of the personalized gifts exceeded my expectations. Prompt delivery!',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                  rating: 5
                };
                const items = [...(currentOccasion.reviews?.items || []), newRev];
                updateSection('reviews', 'items', items);
              }}
            >
              <i className="fa-solid fa-plus"></i> Add Testimonial
            </button>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '20px' }}>
            <div className="admin-form-group">
              <label>Tagline</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.reviews?.tagline || ''}
                onChange={(e) => updateSection('reviews', 'tagline', e.target.value)}
                placeholder="WHAT COUPLES SAY"
              />
            </div>
            <div className="admin-form-group">
              <label>Heading</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.reviews?.heading || ''}
                onChange={(e) => updateSection('reviews', 'heading', e.target.value)}
                placeholder="What Couples Say About Us"
              />
            </div>
            <div className="admin-form-group full-width">
              <label>Subtitle</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.reviews?.subtitle || ''}
                onChange={(e) => updateSection('reviews', 'subtitle', e.target.value)}
                placeholder="Real stories from customers who made their celebration special..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(currentOccasion.reviews?.items || []).map((rev, idx) => (
              <div key={rev.id || idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'; }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a' }}>{rev.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{rev.city}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const items = (currentOccasion.reviews?.items || []).filter((_, i) => i !== idx);
                      updateSection('reviews', 'items', items);
                    }}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                    title="Remove review"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>

                <div className="admin-form-grid">
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Reviewer Name</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={rev.name || ''}
                      onChange={(e) => updateArrayItem('reviews', idx, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>City / Location</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={rev.city || ''}
                      onChange={(e) => updateArrayItem('reviews', idx, 'city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Review Title</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={rev.title || ''}
                      onChange={(e) => updateArrayItem('reviews', idx, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Rating (Stars 1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      className="admin-form-input"
                      value={rev.rating || 5}
                      onChange={(e) => updateArrayItem('reviews', idx, 'rating', Number(e.target.value))}
                    />
                  </div>
                  <div className="full-width">
                    <label style={{ fontSize: '11px', color: '#64748b' }}>Customer Comment</label>
                    <textarea
                      className="admin-form-textarea"
                      rows={2}
                      value={rev.comment || ''}
                      onChange={(e) => updateArrayItem('reviews', idx, 'comment', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 13. SUBTAB 9: NEWSLETTER CALLOUT STRIP ─────────────────────── */}
      {subTab === 'newsletter' && (
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div>
              <h3 className="admin-panel-title">Newsletter Strip</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Bottom occasion subscription banner strip with gift icon, email pill input capsule, and submit button.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Tagline (Uppercase)</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.newsletter?.tagline || ''}
                onChange={(e) => updateSection('newsletter', 'tagline', e.target.value)}
                placeholder="AS PART OF SPECIAL MOMENTS"
              />
            </div>
            <div className="admin-form-group">
              <label>Button Text</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.newsletter?.buttonText || ''}
                onChange={(e) => updateSection('newsletter', 'buttonText', e.target.value)}
                placeholder="Subscribe"
              />
            </div>
            <div className="admin-form-group">
              <label>Headline Main</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.newsletter?.heading || ''}
                onChange={(e) => updateSection('newsletter', 'heading', e.target.value)}
                placeholder="Get Exclusive Offers"
              />
            </div>
            <div className="admin-form-group">
              <label>Headline Highlight (Dark Accent)</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.newsletter?.headingHighlight || ''}
                onChange={(e) => updateSection('newsletter', 'headingHighlight', e.target.value)}
                placeholder="& Gift Ideas"
              />
            </div>
            <div className="admin-form-group full-width">
              <label>Subtitle / Incentive Text</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.newsletter?.subtitle || ''}
                onChange={(e) => updateSection('newsletter', 'subtitle', e.target.value)}
                placeholder="Subscribe to get latest collections, offers and inspirations."
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 14. SUBTAB 10: GENERAL & SLUG ──────────────────────────────── */}
      {subTab === 'general' && (
        <div className="admin-panel-card">
          <div className="admin-panel-header">
            <div>
              <h3 className="admin-panel-title">Occasion Metadata &amp; URL Route</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                Occasion display name, live routing URL slug, and homepage featured status.
              </p>
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Occasion Name *</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. Engagement Gifts"
              />
            </div>
            <div className="admin-form-group">
              <label>URL Slug (Direct Route Path) *</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.slug || ''}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="e.g. engagement-gifts"
              />
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Live URL: <strong>/{currentOccasion.slug || 'engagement-gifts'}</strong>
              </span>
            </div>
            <div className="admin-form-group">
              <label>Menu Tag / Badge</label>
              <input
                type="text"
                className="admin-form-input"
                value={currentOccasion.badge || ''}
                onChange={(e) => updateField('badge', e.target.value)}
                placeholder="GIFTS BY OCCASION"
              />
            </div>
            <div className="admin-form-group">
              <label>Page Publication Status</label>
              <select
                className="admin-form-select"
                value={currentOccasion.status || 'active'}
                onChange={(e) => updateField('status', e.target.value)}
              >
                <option value="active">Active &amp; Published</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── 15. MODAL: CREATE NEW OCCASION ─────────────────────────────── */}
      {isNewOccasionModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsNewOccasionModalOpen(false)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <h3>
                <i className="fa-solid fa-sparkles" style={{ color: '#db2777' }}></i> Create New Occasion Page
              </h3>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setIsNewOccasionModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleCreateNewOccasion}>
              <div className="admin-modal-body">
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                  Choose a ready-to-go preset template or enter custom details. A complete 10-section page will be initialized with matching layout.
                </p>

                <div className="admin-form-group" style={{ marginBottom: '14px' }}>
                  <label>Start from Preset Template</label>
                  <select
                    className="admin-form-select"
                    value={newOccasionForm.templateId}
                    onChange={(e) => {
                      const sel = OCCASION_PRESET_TEMPLATES.find((t) => t.id === e.target.value);
                      if (sel) {
                        setNewOccasionForm({
                          templateId: sel.id,
                          name: sel.name,
                          slug: sel.slug
                        });
                      }
                    }}
                  >
                    {OCCASION_PRESET_TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (Template)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group" style={{ marginBottom: '14px' }}>
                  <label>Occasion Name *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    value={newOccasionForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '');
                      setNewOccasionForm({ ...newOccasionForm, name, slug });
                    }}
                    placeholder="e.g. Wedding Gifts"
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: '16px' }}>
                  <label>URL Slug *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    value={newOccasionForm.slug}
                    onChange={(e) => setNewOccasionForm({ ...newOccasionForm, slug: e.target.value })}
                    placeholder="e.g. wedding-gifts"
                  />
                  <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    Will be accessible at: <strong>/{newOccasionForm.slug || 'slug'}</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => setIsNewOccasionModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn-primary"
                    style={{ background: 'linear-gradient(135deg, #c40b90 0%, #db2777 100%)', color: '#ffffff' }}
                  >
                    <i className="fa-solid fa-plus"></i> Create Occasion
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
