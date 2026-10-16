import React, { useState } from 'react';
import { dealsAndCollectionsData } from '../../data/mockData';

export default function ProductListsSection({
  content,
  newCollection = [],
  topRated = [],
  bestSellers = [],
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onProductClick = () => {},
  onNavigate = () => {}
}) {
  const col1Title = content?.col1Title || 'New Collection';
  const col1Sub = content?.col1Sub || 'Fresh designs just for you';
  const col2Title = content?.col2Title || 'Top Rated';
  const col2Sub = content?.col2Sub || "Customer's favourite picks";
  const col3Title = content?.col3Title || 'Best Seller';
  const col3Sub = content?.col3Sub || 'Most loved gifts';
  const [wishlistState, setWishlistState] = useState({});

  // Use props if provided and populated, otherwise fallback to exact mockData
  const listNew = newCollection && newCollection.length > 0 ? newCollection : dealsAndCollectionsData.newCollection;
  const listTop = topRated && topRated.length > 0 ? topRated : dealsAndCollectionsData.topRated;
  const listBest = bestSellers && bestSellers.length > 0 ? bestSellers : dealsAndCollectionsData.bestSellers;

  const toggleWishlist = (e, prod) => {
    e.stopPropagation();
    e.preventDefault();
    setWishlistState(prev => ({
      ...prev,
      [prod.id]: !prev[prod.id]
    }));
    onAddToWishlist(prod);
  };

  const renderProductItem = (prod) => {
    const isWished = wishlistState[prod.id];

    return (
      <div key={prod.id} className="collection-product-card" onClick={() => onProductClick(prod)}>
        {/* Left Image Thumbnail */}
        <div className="collection-img-box">
          <img src={prod.image_url} alt={prod.name} loading="lazy" />
          <button
            type="button"
            className={`collection-wishlist-btn ${isWished ? 'active' : ''}`}
            onClick={(e) => toggleWishlist(e, prod)}
            aria-label="Add to wishlist"
          >
            <i className={isWished ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
          </button>
        </div>

        {/* Center Details */}
        <div className="collection-info-box">
          <h4 className="collection-prod-name" title={prod.name}>{prod.name}</h4>
          <span className="collection-prod-cat">{prod.cat_name || 'Personalised'}</span>
          
          <div className="collection-prod-price-row">
            <span className="collection-current-price">₹{prod.price}</span>
            {prod.old_price && (
              <span className="collection-old-price">₹{prod.old_price}</span>
            )}
          </div>

          <div className="collection-rating-row">
            <div className="collection-stars">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <span className="collection-review-count">({prod.reviews_count || 95})</span>
          </div>
        </div>

        {/* Right Cart Action */}
        <div className="collection-action-box">
          <button
            type="button"
            className="collection-cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(prod);
            }}
            title="Add to cart"
            aria-label={`Add ${prod.name} to cart`}
          >
            <i className="fa-solid fa-basket-shopping"></i>
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="deals-collections-section">
      {/* Background Ambience & Decorative Elements */}
      <div className="deals-bg-glow glow-1"></div>
      <div className="deals-bg-glow glow-2"></div>

      <div className="container deals-container">
        {/* Section Header */}
        <div className="collections-section-header">
          <span className="collections-pill-tag">SPECIAL OFFERS</span>
          <h2 className="collections-main-heading">
            Deals & <span>Collections</span>
          </h2>
          <p className="collections-sub-desc">
            Discover our latest arrivals, top-rated favourites and best-selling gifts in one place.
          </p>

          {/* 3D Gift Box floating badge on top right */}
          <div className="collections-floating-gift-badge">
            <div className="floating-gift-box">
              <span className="floating-gift-ribbon-v"></span>
              <span className="floating-gift-ribbon-h"></span>
              <div className="floating-gift-bow"></div>
              <div className="floating-percent-tag">
                <span>%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Columns Grid */}
        <div className="deals-collections-grid">
          {/* Column 1: New Collection */}
          <div className="collection-column-card card-pink">
            <div className="col-header-box">
              <div className="col-badge-icon badge-pink">
                <i className="fa-solid fa-crown"></i>
              </div>
              <div className="col-title-group">
                <h3 className="col-title">{col1Title}</h3>
                <p className="col-sub">{col1Sub}</p>
              </div>
              <button
                type="button"
                className="col-view-all-pill btn-pink-outline"
                onClick={() => onNavigate('/shop?filter=new')}
              >
                View All <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            <div className="col-items-list">
              {listNew.slice(0, 4).map(prod => renderProductItem(prod))}
            </div>
          </div>

          {/* Column 2: Top Rated */}
          <div className="collection-column-card card-gold">
            <div className="col-header-box">
              <div className="col-badge-icon badge-gold">
                <i className="fa-solid fa-star"></i>
              </div>
              <div className="col-title-group">
                <h3 className="col-title">{col2Title}</h3>
                <p className="col-sub">{col2Sub}</p>
              </div>
              <button
                type="button"
                className="col-view-all-pill btn-gold-outline"
                onClick={() => onNavigate('/shop?filter=top-rated')}
              >
                View All <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            <div className="col-items-list">
              {listTop.slice(0, 4).map(prod => renderProductItem(prod))}
            </div>
          </div>

          {/* Column 3: Best Seller */}
          <div className="collection-column-card card-blue">
            <div className="col-header-box">
              <div className="col-badge-icon badge-blue">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <div className="col-title-group">
                <h3 className="col-title">{col3Title}</h3>
                <p className="col-sub">{col3Sub}</p>
              </div>
              <button
                type="button"
                className="col-view-all-pill btn-blue-outline"
                onClick={() => onNavigate('/shop?filter=best-seller')}
              >
                View All <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            <div className="col-items-list">
              {listBest.slice(0, 4).map(prod => renderProductItem(prod))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
