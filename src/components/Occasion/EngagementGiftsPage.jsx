import React, { useState } from 'react';
import './EngagementGiftsPage.css';
import { DEFAULT_OCCASION_DATA } from '../../data/occasionContentData';
import heroVisualImg from '../../assets/images/engagement-gifts-banner.png';
import packagingImg from '../../assets/images/packaging.avif';

export default function EngagementGiftsPage({
  occasionData = DEFAULT_OCCASION_DATA,
  wishlist = [],
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onProductClick = () => {},
  onNavigate = () => {}
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Safely merge incoming occasionData with defaults
  const occasion = {
    ...DEFAULT_OCCASION_DATA,
    ...(occasionData || {}),
    hero: { ...DEFAULT_OCCASION_DATA.hero, ...(occasionData?.hero || {}) },
    filterPills: occasionData?.filterPills || DEFAULT_OCCASION_DATA.filterPills,
    popularGifts: {
      ...DEFAULT_OCCASION_DATA.popularGifts,
      ...(occasionData?.popularGifts || {}),
      items: occasionData?.popularGifts?.items || DEFAULT_OCCASION_DATA.popularGifts.items
    },
    midHamperBanner: {
      ...DEFAULT_OCCASION_DATA.midHamperBanner,
      ...(occasionData?.midHamperBanner || {}),
      features: occasionData?.midHamperBanner?.features || DEFAULT_OCCASION_DATA.midHamperBanner.features
    },
    giftsForHim: {
      ...DEFAULT_OCCASION_DATA.giftsForHim,
      ...(occasionData?.giftsForHim || {}),
      items: occasionData?.giftsForHim?.items || DEFAULT_OCCASION_DATA.giftsForHim.items
    },
    giftsForHer: {
      ...DEFAULT_OCCASION_DATA.giftsForHer,
      ...(occasionData?.giftsForHer || {}),
      items: occasionData?.giftsForHer?.items || DEFAULT_OCCASION_DATA.giftsForHer.items
    },
    whyChoose: {
      ...DEFAULT_OCCASION_DATA.whyChoose,
      ...(occasionData?.whyChoose || {}),
      cards: occasionData?.whyChoose?.cards || DEFAULT_OCCASION_DATA.whyChoose.cards
    },
    reviews: {
      ...DEFAULT_OCCASION_DATA.reviews,
      ...(occasionData?.reviews || {}),
      items: occasionData?.reviews?.items || DEFAULT_OCCASION_DATA.reviews.items
    },
    newsletter: {
      ...DEFAULT_OCCASION_DATA.newsletter,
      ...(occasionData?.newsletter || {})
    }
  };

  // Filter helper
  const filterList = (items = []) => {
    if (!Array.isArray(items)) return [];
    if (activeFilter === 'all') return items;
    return items.filter((item) => item.category === activeFilter);
  };

  const isItemInWishlist = (productId) => {
    return wishlist.some((item) => (item.id || item.product_id) === productId);
  };

  const scrollToCollection = () => {
    const el = document.getElementById('popular-engagement-gifts');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const reviewsList = occasion.reviews?.items || [];

  return (
    <div className="engagement-page-wrapper">
      {/* ─────────────────────────────────────────────────────────────
          1. BREADCRUMBS
          ───────────────────────────────────────────────────────────── */}
      <div className="container">
        <nav className="engagement-breadcrumbs" aria-label="Breadcrumb">
          <button type="button" className="breadcrumb-link" onClick={() => onNavigate('/')}>
            <i className="fa-solid fa-house"></i> Home
          </button>
          <span className="breadcrumb-separator">/</span>
          <button type="button" className="breadcrumb-link" onClick={() => onNavigate('/shop')}>
            Gifts by Occasion
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{occasion.name || 'Engagement Gifts'}</span>
        </nav>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className="engagement-hero-section">
        <div className="container engagement-hero-container">
          <div className="engagement-hero-content">
            <div className="engagement-hero-tag">
              <span className="tag-line"></span>
              <span>{occasion.hero?.tagline || 'CELEBRATE TOGETHERNESS'}</span>
              <span className="tag-line"></span>
            </div>

            <h1 className="engagement-hero-title">
              {occasion.hero?.titleMain || 'Engagement'}{' '}
              <span className="highlight-pink">{occasion.hero?.titleHighlight || 'Gifts'}</span>
            </h1>

            <p className="engagement-hero-desc">
              {occasion.hero?.description || 'Thoughtful and personalised gifts to celebrate a beautiful new beginning.'}
            </p>

            <div className="engagement-hero-features">
              {(occasion.hero?.features || []).map((feat, idx) => (
                <div key={idx} className="hero-feature-item">
                  <span className="feature-icon">{feat.icon}</span>
                  <span>{feat.text}</span>
                </div>
              ))}
            </div>

            <button type="button" className="engagement-cta-btn" onClick={scrollToCollection}>
              <span>{occasion.hero?.ctaText || 'Explore Collection'}</span>
              <span className="btn-arrow-circle">
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </button>
          </div>

          <div className="engagement-hero-visual">
            <div className="hero-visual-card">
              <img
                src={occasion.hero?.image || heroVisualImg}
                alt={`${occasion.name} - ${occasion.hero?.floatingQuote || 'Featured Gifts'}`}
                className="hero-main-banner-img"
              />
              <div className="hero-floating-quote">
                <span className="cursive-script">{occasion.hero?.floatingQuote || 'Two Hearts One Beautiful Journey'}</span>
                <i className="fa-solid fa-heart floating-heart-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. QUICK SUB-THEME FILTER PILLS
          ───────────────────────────────────────────────────────────── */}
      {occasion.filterPills && occasion.filterPills.length > 0 && (
        <section className="engagement-filters-section">
          <div className="container">
            <div className="engagement-filters-scroll">
              {occasion.filterPills.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`filter-pill-btn ${activeFilter === f.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f.id)}
                >
                  <div className="filter-pill-icon-wrap">
                    <i className={f.icon}></i>
                  </div>
                  <span className="filter-pill-label">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. POPULAR GIFTS
          ───────────────────────────────────────────────────────────── */}
      <section id="popular-engagement-gifts" className="engagement-products-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-sub-tag">{occasion.popularGifts?.tagline || 'TRENDING NOW —'}</div>
              <h2 className="section-main-heading">{occasion.popularGifts?.heading || 'Popular Engagement Gifts'}</h2>
              <p className="section-subtitle">
                {occasion.popularGifts?.subtitle || 'Make their special moment even more memorable with our handpicked gifts.'}
              </p>
            </div>
            <div className="section-actions-row">
              <button
                type="button"
                className="section-view-all-btn"
                onClick={() => onNavigate(occasion.popularGifts?.viewAllLink || '/shop?cat=gifts')}
              >
                View All
              </button>
              <div className="slider-arrow-btns">
                <button type="button" className="slider-btn prev" aria-label="Previous">
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button type="button" className="slider-btn next" aria-label="Next">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="engagement-product-grid">
            {filterList(occasion.popularGifts?.items || []).map((prod) => (
              <div key={prod.id} className="engagement-prod-card">
                <button
                  type="button"
                  className={`card-wishlist-btn ${isItemInWishlist(prod.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToWishlist(prod);
                  }}
                  aria-label="Add to Wishlist"
                >
                  <i className={isItemInWishlist(prod.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                </button>

                <div
                  className="card-img-wrap"
                  onClick={() => onProductClick(prod)}
                  role="button"
                  tabIndex={0}
                >
                  <img src={prod.image} alt={prod.name} loading="lazy" />
                </div>

                <div className="card-info-wrap">
                  <h3
                    className="card-prod-title"
                    onClick={() => onProductClick(prod)}
                    title={prod.name}
                  >
                    {prod.name}
                  </h3>

                  <div className="card-price-row">
                    <span className="card-price">₹{prod.price}</span>
                    {prod.originalPrice && (
                      <span className="card-old-price">₹{prod.originalPrice}</span>
                    )}
                    <div className="card-rating-badge">
                      <i className="fa-solid fa-star"></i>
                      <span>{prod.rating}</span>
                      <span className="review-count">({prod.reviews})</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="card-add-cart-btn"
                    onClick={() => onAddToCart(prod)}
                  >
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. MID FEATURE BANNER: PERSONALISED HAMPERS
          ───────────────────────────────────────────────────────────── */}
      {occasion.midHamperBanner && (
        <section className="engagement-hamper-banner-section">
          <div className="container">
            <div className="hamper-banner-card">
              <div className="hamper-banner-left">
                <span className="hamper-tag">{occasion.midHamperBanner?.tagline || 'MAKE IT EXTRA SPECIAL'}</span>
                <h2 className="hamper-title">
                  {occasion.midHamperBanner?.titleMain || 'Personalised'} <br />
                  <span className="highlight-pink">{occasion.midHamperBanner?.titleHighlight || 'Engagement Hampers'}</span>
                </h2>
                <p className="hamper-desc">
                  {occasion.midHamperBanner?.description || 'Curated with love, made for their new beginning.'}
                </p>
                <button
                  type="button"
                  className="hamper-cta-btn"
                  onClick={() => onNavigate(occasion.midHamperBanner?.ctaLink || '/shop?cat=packaging')}
                >
                  <span>{occasion.midHamperBanner?.ctaText || 'Shop Hampers'}</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>

              <div className="hamper-banner-center">
                <div className="hamper-img-wrapper">
                  <img
                    src={occasion.midHamperBanner?.image || packagingImg}
                    alt={occasion.midHamperBanner?.titleHighlight || 'Hampers'}
                    className="hamper-center-img"
                  />
                  {occasion.midHamperBanner?.floatBadge && (
                    <div className="hamper-float-badge">
                      <span>{occasion.midHamperBanner.floatBadge}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="hamper-banner-right">
                {(occasion.midHamperBanner?.features || []).map((feat, idx) => (
                  <div key={idx} className="hamper-feature-pill">
                    <span className="pill-icon">{feat.icon}</span>
                    <span>{feat.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. GIFTS FOR HIM
          ───────────────────────────────────────────────────────────── */}
      {occasion.giftsForHim && occasion.giftsForHim.items && (
        <section className="engagement-products-section">
          <div className="container">
            <div className="section-header-row">
              <div>
                <h2 className="section-main-heading">{occasion.giftsForHim?.heading || 'Gifts for Him'}</h2>
                <p className="section-subtitle">{occasion.giftsForHim?.subtitle || "Thoughtful gifts he'll always cherish."}</p>
              </div>
              <button
                type="button"
                className="section-view-all-btn"
                onClick={() => onNavigate(occasion.giftsForHim?.viewAllLink || '/shop?search=him')}
              >
                View All
              </button>
            </div>

            <div className="engagement-product-grid">
              {filterList(occasion.giftsForHim.items).map((prod) => (
                <div key={prod.id} className="engagement-prod-card">
                  <button
                    type="button"
                    className={`card-wishlist-btn ${isItemInWishlist(prod.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWishlist(prod);
                    }}
                    aria-label="Add to Wishlist"
                  >
                    <i className={isItemInWishlist(prod.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                  </button>

                  <div
                    className="card-img-wrap"
                    onClick={() => onProductClick(prod)}
                    role="button"
                    tabIndex={0}
                  >
                    <img src={prod.image} alt={prod.name} loading="lazy" />
                  </div>

                  <div className="card-info-wrap">
                    <h3
                      className="card-prod-title"
                      onClick={() => onProductClick(prod)}
                      title={prod.name}
                    >
                      {prod.name}
                    </h3>

                    <div className="card-price-row">
                      <span className="card-price">₹{prod.price}</span>
                      {prod.originalPrice && (
                        <span className="card-old-price">₹{prod.originalPrice}</span>
                      )}
                      <div className="card-rating-badge">
                        <i className="fa-solid fa-star"></i>
                        <span>{prod.rating}</span>
                        <span className="review-count">({prod.reviews})</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="card-add-cart-btn"
                      onClick={() => onAddToCart(prod)}
                    >
                      <i className="fa-solid fa-cart-shopping"></i>
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. GIFTS FOR HER
          ───────────────────────────────────────────────────────────── */}
      {occasion.giftsForHer && occasion.giftsForHer.items && (
        <section className="engagement-products-section">
          <div className="container">
            <div className="section-header-row">
              <div>
                <h2 className="section-main-heading">{occasion.giftsForHer?.heading || 'Gifts for Her'}</h2>
                <p className="section-subtitle">{occasion.giftsForHer?.subtitle || 'Beautiful gifts for her special journey.'}</p>
              </div>
              <button
                type="button"
                className="section-view-all-btn"
                onClick={() => onNavigate(occasion.giftsForHer?.viewAllLink || '/shop?search=her')}
              >
                View All
              </button>
            </div>

            <div className="engagement-product-grid">
              {filterList(occasion.giftsForHer.items).map((prod) => (
                <div key={prod.id} className="engagement-prod-card">
                  <button
                    type="button"
                    className={`card-wishlist-btn ${isItemInWishlist(prod.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWishlist(prod);
                    }}
                    aria-label="Add to Wishlist"
                  >
                    <i className={isItemInWishlist(prod.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                  </button>

                  <div
                    className="card-img-wrap"
                    onClick={() => onProductClick(prod)}
                    role="button"
                    tabIndex={0}
                  >
                    <img src={prod.image} alt={prod.name} loading="lazy" />
                  </div>

                  <div className="card-info-wrap">
                    <h3
                      className="card-prod-title"
                      onClick={() => onProductClick(prod)}
                      title={prod.name}
                    >
                      {prod.name}
                    </h3>

                    <div className="card-price-row">
                      <span className="card-price">₹{prod.price}</span>
                      {prod.originalPrice && (
                        <span className="card-old-price">₹{prod.originalPrice}</span>
                      )}
                      <div className="card-rating-badge">
                        <i className="fa-solid fa-star"></i>
                        <span>{prod.rating}</span>
                        <span className="review-count">({prod.reviews})</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="card-add-cart-btn"
                      onClick={() => onAddToCart(prod)}
                    >
                      <i className="fa-solid fa-cart-shopping"></i>
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          8. WHY CHOOSE US
          ───────────────────────────────────────────────────────────── */}
      {occasion.whyChoose && (
        <section className="engagement-why-choose-section">
          <div className="container">
            <div className="why-choose-header text-center">
              <span className="section-sub-tag">— {occasion.whyChoose?.tagline || 'WHY CHOOSE US'} —</span>
              <h2 className="section-main-heading">{occasion.whyChoose?.heading || 'Make Their Moment More Special'}</h2>
              <p className="section-subtitle">
                {occasion.whyChoose?.subtitle || "We create personalised gifts that add meaning to life's most beautiful moments."}
              </p>
            </div>

            <div className="why-choose-grid">
              {(occasion.whyChoose?.cards || []).map((card, idx) => (
                <div key={idx} className="why-card">
                  <div className="why-card-icon-wrap pink">
                    <i className={card.icon || 'fa-solid fa-gift'}></i>
                  </div>
                  <h3 className="why-card-title">{card.title}</h3>
                  <p className="why-card-desc">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          9. HAPPY CUSTOMERS / REVIEWS
          ───────────────────────────────────────────────────────────── */}
      {reviewsList.length > 0 && (
        <section className="engagement-reviews-section">
          <div className="container">
            <div className="reviews-header text-center">
              <span className="section-sub-tag">— {occasion.reviews?.tagline || 'HAPPY CUSTOMERS'} —</span>
              <h2 className="section-main-heading">
                {occasion.reviews?.heading || 'What Couples Say'}{' '}
                <span className="highlight-pink">About Us</span>
              </h2>
              <p className="section-subtitle">
                {occasion.reviews?.subtitle || 'Real stories from customers who made their celebration special with Fine Gift Studio.'}
              </p>
            </div>

            <div className="reviews-carousel-wrap">
              <button
                type="button"
                className="review-arrow-btn prev"
                onClick={() => setActiveReviewIdx((prev) => (prev > 0 ? prev - 1 : reviewsList.length - 1))}
                aria-label="Previous review"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <div className="reviews-cards-row">
                {reviewsList.map((rev, idx) => (
                  <div
                    key={rev.id || idx}
                    className={`review-card ${idx === activeReviewIdx ? 'highlighted' : ''}`}
                  >
                    <div className="review-top-row">
                      <div className="review-stars">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <i key={i} className="fa-solid fa-star"></i>
                        ))}
                      </div>
                      <i className="fa-regular fa-heart review-like-icon"></i>
                    </div>

                    <h3 className="review-title">{rev.title}</h3>
                    <p className="review-comment">"{rev.comment}"</p>

                    <div className="reviewer-profile">
                      <img src={rev.avatar} alt={rev.name} className="reviewer-avatar" />
                      <div>
                        <div className="reviewer-name">{rev.name}</div>
                        <div className="reviewer-city">{rev.city}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="review-arrow-btn next"
                onClick={() => setActiveReviewIdx((prev) => (prev < reviewsList.length - 1 ? prev + 1 : 0))}
                aria-label="Next review"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <div className="review-dots-row">
              {reviewsList.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`review-dot ${i === activeReviewIdx ? 'active' : ''}`}
                  onClick={() => setActiveReviewIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          10. NEWSLETTER CALLOUT BOX
          ───────────────────────────────────────────────────────────── */}
      {occasion.newsletter && (
        <section className="engagement-newsletter-strip">
          <div className="container">
            <div className="newsletter-banner-box">
              <div className="newsletter-box-left">
                <div className="newsletter-gift-icon-wrap">
                  <i className="fa-solid fa-gift"></i>
                </div>
                <div>
                  <span className="newsletter-tagline">{occasion.newsletter?.tagline || 'AS PART OF SPECIAL MOMENTS'}</span>
                  <h3 className="newsletter-headline">
                    {occasion.newsletter?.heading || 'Get Exclusive Offers'}{' '}
                    <span className="highlight-dark">{occasion.newsletter?.headingHighlight || '& Gift Ideas'}</span>
                  </h3>
                  <p className="newsletter-subline">{occasion.newsletter?.subtitle || 'Subscribe to get latest collections, offers and inspirations.'}</p>
                </div>
              </div>

              <div className="newsletter-box-right">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert(`Thank you for subscribing to ${occasion.name || 'our'} updates!`);
                  }}
                  className="newsletter-signup-form"
                >
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="newsletter-input"
                    required
                  />
                  <button type="submit" className="newsletter-submit-btn">
                    <span>{occasion.newsletter?.buttonText || 'Subscribe'}</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
