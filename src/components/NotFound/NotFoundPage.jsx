import React, { useState, useEffect } from 'react';
import './NotFoundPage.css';

export default function NotFoundPage({
  onNavigate = () => {},
  products = [],
  onAddToCart = () => {},
  requestedPath = ''
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState(requestedPath || '');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!currentPath && typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname || '');
    }
  }, [requestedPath, currentPath]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (onNavigate) {
      onNavigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else if (onNavigate) {
      onNavigate('/');
    }
  };

  // Recommended products (first 4 products)
  const suggestedProducts = React.useMemo(() => {
    if (Array.isArray(products) && products.length > 0) {
      return products.slice(0, 4);
    }
    // Fallback items if products not loaded yet
    return [
      {
        id: 'rec-1',
        name: 'Personalised Couple Photo Magic Mug',
        category: 'Drinkware',
        price: 499,
        image_url: '/assets/images/cups-product.avif'
      },
      {
        id: 'rec-2',
        name: 'Handcrafted Wooden Memory Frame',
        category: 'Keepsakes',
        price: 899,
        image_url: '/assets/images/packaging-BAoB7sdw.avif'
      },
      {
        id: 'rec-3',
        name: 'Laser Engraved Acrylic LED Night Lamp',
        category: 'Home Decor',
        price: 999,
        image_url: '/assets/images/art-design-DSQXArUp.avif'
      },
      {
        id: 'rec-4',
        name: 'Luxury Engagement Gift Hamper Set',
        category: 'Occasions',
        price: 1499,
        image_url: '/assets/images/engagement-gifts-banner-Crb9Vz0j.png'
      }
    ];
  }, [products]);

  const shortcuts = [
    {
      title: 'Engagement & Wedding',
      desc: 'Bespoke gifts to celebrate special couple milestones.',
      icon: 'fa-solid fa-ring',
      path: '/engagement-gifts'
    },
    {
      title: 'Customised Photo Mugs',
      desc: 'Magic color-changing & ceramic printed mugs.',
      icon: 'fa-solid fa-mug-hot',
      path: '/shop?cat=drinkware'
    },
    {
      title: 'Wooden Keepsakes',
      desc: 'Pine & walnut engraved plaques and frames.',
      icon: 'fa-solid fa-box-archive',
      path: '/shop?cat=wood'
    },
    {
      title: 'Studio Blog & Guides',
      desc: 'Inspirational gifting ideas and occasion tips.',
      icon: 'fa-solid fa-newspaper',
      path: '/blog'
    }
  ];

  return (
    <div className="notfound-page-wrapper">
      {/* ── 1. BREADCRUMBS ──────────────────────────────────────── */}
      <nav className="notfound-breadcrumb-bar" aria-label="Breadcrumb">
        <div className="notfound-breadcrumb-container">
          <ul className="notfound-breadcrumb-list">
            <li>
              <a
                href="/"
                className="notfound-breadcrumb-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate('/');
                }}
              >
                <i className="fa-solid fa-house"></i> Home
              </a>
            </li>
            <li className="notfound-breadcrumb-divider">/</li>
            <li className="notfound-breadcrumb-current" aria-current="page">
              404 Page Not Found
            </li>
          </ul>
        </div>
      </nav>

      {/* ── 2. HERO CENTER STAGE ─────────────────────────────────── */}
      <section className="notfound-hero-section">
        <div className="notfound-visual-wrap">
          <div className="notfound-big-number">
            <span>4</span>
            <div className="notfound-icon-middle" aria-hidden="true">
              <i className="fa-solid fa-gift"></i>
            </div>
            <span>4</span>
          </div>
        </div>

        <div className="notfound-tag">
          <i className="fa-solid fa-triangle-exclamation"></i> Error 404
        </div>

        <h1 className="notfound-title">Oops! This Gift Box Is Empty</h1>

        <p className="notfound-desc">
          The page {currentPath ? <code className="notfound-missing-path">{currentPath}</code> : 'you requested'} could not be found. It may have been moved, renamed, or is temporarily unavailable. Let's get you back on track!
        </p>

        {/* Interactive Search Bar */}
        <div className="notfound-search-container">
          <form className="notfound-search-form" onSubmit={handleSearchSubmit}>
            <i className="fa-solid fa-magnifying-glass notfound-search-icon-left"></i>
            <input
              type="text"
              className="notfound-search-input"
              placeholder="Search personalised gifts, mugs, frames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search for products"
            />
            <button type="submit" className="notfound-search-btn">
              Find Gift
            </button>
          </form>
        </div>

        {/* Action Buttons Row */}
        <div className="notfound-actions-row">
          <button
            type="button"
            className="notfound-btn-primary"
            onClick={() => onNavigate('/')}
          >
            <i className="fa-solid fa-house"></i> Back to Home
          </button>

          <button
            type="button"
            className="notfound-btn-secondary"
            onClick={() => onNavigate('/shop')}
          >
            <i className="fa-solid fa-bag-shopping"></i> Browse Shop
          </button>

          <button
            type="button"
            className="notfound-btn-secondary"
            onClick={() => onNavigate('/blog')}
          >
            <i className="fa-solid fa-newspaper"></i> Read Blog
          </button>

          <button
            type="button"
            className="notfound-btn-secondary"
            onClick={handleGoBack}
            title="Go to previous page"
          >
            <i className="fa-solid fa-arrow-left"></i> Go Back
          </button>
        </div>
      </section>

      {/* ── 3. POPULAR SHORTCUTS ─────────────────────────────────── */}
      <section className="notfound-shortcuts-section">
        <h2 className="notfound-section-title">
          <i className="fa-solid fa-compass"></i> Popular Gift Collections
        </h2>

        <div className="notfound-cards-grid">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="notfound-shortcut-card"
              onClick={() => onNavigate(sc.path)}
            >
              <div className="notfound-card-icon-wrap">
                <i className={sc.icon}></i>
              </div>
              <h3 className="notfound-card-title">{sc.title}</h3>
              <p className="notfound-card-desc">{sc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. SUGGESTED PRODUCTS STRIP ──────────────────────────── */}
      <section className="notfound-suggestions-section">
        <div className="notfound-suggestions-header">
          <h2 className="notfound-suggestions-title">Trending Personalised Gifts</h2>
          <span
            className="notfound-suggestions-link"
            onClick={() => onNavigate('/shop')}
          >
            Explore Full Studio Catalog <i className="fa-solid fa-arrow-right"></i>
          </span>
        </div>

        <div className="notfound-products-grid">
          {suggestedProducts.map((prod) => {
            const img = prod.image_url || prod.image || prod.fallback_image_url || '/assets/images/cups-product.avif';
            return (
              <div
                key={prod.id}
                className="notfound-prod-card"
                onClick={() => onNavigate('/shop')}
              >
                <div className="notfound-prod-img-wrap">
                  <img
                    src={img}
                    alt={prod.name}
                    className="notfound-prod-img"
                    onError={(e) => { e.currentTarget.src = '/assets/images/cups-product.avif'; }}
                  />
                </div>

                <div className="notfound-prod-info">
                  <span className="notfound-prod-cat">{prod.category || 'Gift Studio'}</span>
                  <h4 className="notfound-prod-title">{prod.name}</h4>

                  <div className="notfound-prod-price-row">
                    <span className="notfound-prod-price">₹{prod.price || 499}</span>
                    <button
                      type="button"
                      className="notfound-prod-add-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAddToCart) onAddToCart(prod);
                      }}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
