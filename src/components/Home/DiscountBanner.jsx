import React, { useState, useRef } from 'react';

export function DiscountBanner({ onShopClick = () => {} }) {
  return (
    <div className="weekend-discount-banner">
      {/* Background Soft Glows */}
      <div className="discount-banner-glow glow-left"></div>
      <div className="discount-banner-glow glow-right"></div>

      {/* 1. Left Content Area: Headings, CTA & Price */}
      <div className="discount-content-left">
        {/* Pill Tag */}
        <div className="discount-pill-tag">
          <span className="percent-circle-icon">%</span>
          <span className="pill-label">Weekend Discount</span>
        </div>

        {/* Main Heading */}
        <h2 className="discount-main-title">
          Feel-Good Shopping <br />
          <span className="discount-title-highlight">
            Up To 50% Off
            <svg className="discount-brush-stroke" viewBox="0 0 120 16" fill="none">
              <path
                d="M4,10 Q60,18 116,4"
                stroke="#be187d"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>

        {/* Subtitle */}
        <p className="discount-description">
          Customized gifts, photo prints, personalized accessories and much more directly delivered.
        </p>

        {/* CTA & Price Row */}
        <div className="discount-action-row">
          <button
            type="button"
            className="discount-shop-btn"
            onClick={onShopClick}
            aria-label="Shop weekend discount"
          >
            Shop Now <i className="fa-solid fa-arrow-right"></i>
          </button>

          <div className="discount-from-price">
            <span className="from-label">from</span>
            <div className="price-val-wrap">
              <span className="price-val">₹199</span>
              <svg className="price-underline-doodle" viewBox="0 0 65 10" fill="none">
                <path
                  d="M2,6 Q32,10 62,3"
                  stroke="#be187d"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Column: 3 Feature Badges */}
      <div className="discount-features-middle">
        <div className="discount-feature-card">
          <div className="feature-icon-circle">
            <i className="fa-solid fa-gift"></i>
          </div>
          <div className="feature-card-info">
            <h4 className="feature-title">Personalized Gifts</h4>
            <span className="feature-sub">Made just for you</span>
          </div>
        </div>

        <div className="discount-feature-card">
          <div className="feature-icon-circle">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <div className="feature-card-info">
            <h4 className="feature-title">Fast &amp; Reliable Delivery</h4>
            <span className="feature-sub">Get it on time</span>
          </div>
        </div>

        <div className="discount-feature-card">
          <div className="feature-icon-circle">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div className="feature-card-info">
            <h4 className="feature-title">Premium Quality</h4>
            <span className="feature-sub">Every gift, a special moment</span>
          </div>
        </div>
      </div>

      {/* 3. Right Column: Discount Image & Glossy 50% Badge */}
      <div className="discount-showcase-right">
        {/* Floating Heart */}
        <div className="floating-hamper-heart">
          <i className="fa-solid fa-heart"></i>
        </div>

        {/* Discount Showcase Image */}
        <div className="discount-image-wrapper">
          <img
            src="assets/images/discount.png"
            alt="Feel-Good Shopping Discount"
            className="discount-main-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/assets/images/discount.png";
            }}
          />
        </div>

        {/* Big Glossy Circular 50% OFF Badge */}
        <div className="discount-glossy-badge">
          <div className="glossy-badge-shine"></div>
          <span className="badge-upto">UP TO</span>
          <span className="badge-num">50%</span>
          <span className="badge-off">OFF</span>
        </div>
      </div>
    </div>
  );
}

export function Testimonials({ testimonials = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);

  const defaultReviews = [
    {
      id: 1,
      theme: 'pink',
      quoteBg: '#fdeef7',
      quoteColor: '#be187d',
      title: 'Great Product Quality',
      text: 'The personalized photo frame we ordered for our anniversary was breathtaking. The colors were vibrant and build quality exceeded our expectations!',
      author: 'Adam Stoung',
      role: 'Furniture Designer',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      badgeType: 'gift'
    },
    {
      id: 2,
      theme: 'purple',
      quoteBg: '#ede9fe',
      quoteColor: '#7c3aed',
      title: 'Super Fast Delivery & Support',
      text: 'I needed customized corporate gifts on short notice. The team delivered right on time with flawless printing. Highly recommended for bulk gifts!',
      author: 'Jessica Young',
      role: 'Marketing Stylist',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      badgeType: 'bag'
    },
    {
      id: 3,
      theme: 'amber',
      quoteBg: '#fef3c7',
      quoteColor: '#d97706',
      title: 'Memorable Birthday Gift',
      text: "Ordered a personalized magic mug and t-shirt for my brother's birthday. The print quality didn't fade even after multiple washes. Loved it!",
      author: 'Anna Marios',
      role: 'Creative Director',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      badgeType: 'heart'
    }
  ];

  const items = testimonials && testimonials.length >= 3 ? testimonials : defaultReviews;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const renderCardBadge = (badgeType) => {
    if (badgeType === 'gift') {
      return (
        <div className="review-3d-badge badge-gift" title="Gift Experience">
          <div className="mini-gift-box">
            <span className="mini-ribbon-v"></span>
            <span className="mini-ribbon-h"></span>
            <div className="mini-bow"></div>
          </div>
        </div>
      );
    }
    if (badgeType === 'bag') {
      return (
        <div className="review-3d-badge badge-bag" title="Shopping Bag">
          <div className="mini-bag-box">
            <span className="mini-bag-handle"></span>
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
        </div>
      );
    }
    return (
      <div className="review-3d-badge badge-heart" title="Loved by Customers">
        <div className="mini-heart-box">
          <i className="fa-solid fa-heart"></i>
          <span className="shine-ray ray-1"></span>
          <span className="shine-ray ray-2"></span>
          <span className="shine-ray ray-3"></span>
        </div>
      </div>
    );
  };

  return (
    <div className="reviews-exclusive-section">
      {/* Background Soft Waves & Glow */}
      <div className="reviews-ambient-wave wave-left"></div>
      <div className="reviews-ambient-wave wave-right"></div>

      {/* Header */}
      <div className="reviews-header-center">
        <span className="reviews-pill-tag">TESTIMONIALS</span>
        <h2 className="reviews-main-title">
          Customers Say <span>About Us</span>
        </h2>
        <div className="reviews-title-underline"></div>
        <p className="reviews-sub-text">
          Real stories from happy customers who love our personalised gifts.
        </p>
      </div>

      {/* Main Reviews Showcase with Carousel Arrows */}
      <div className="reviews-carousel-outer">
        {/* Left Arrow */}
        <button
          type="button"
          className="review-arrow-btn arrow-prev"
          onClick={handlePrev}
          aria-label="Previous customer review"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        {/* Cards Grid / Track */}
        <div className="reviews-cards-grid" ref={trackRef}>
          {items.map((item, idx) => {
            const badgeType = item.badgeType || (idx === 0 ? 'gift' : idx === 1 ? 'bag' : 'heart');
            const quoteBg = item.quoteBg || (idx === 0 ? '#fdeef7' : idx === 1 ? '#ede9fe' : '#fef3c7');
            const quoteColor = item.quoteColor || (idx === 0 ? '#be187d' : idx === 1 ? '#7c3aed' : '#d97706');

            return (
              <div key={item.id || idx} className="review-glass-card">
                {/* 3D Micro Illustration Badge on top right edge */}
                {renderCardBadge(badgeType)}

                {/* Top Row: Quote Icon + Rating Stars */}
                <div className="review-card-top-row">
                  <div
                    className="review-quote-circle"
                    style={{ backgroundColor: quoteBg, color: quoteColor }}
                  >
                    <i className="fa-solid fa-quote-left"></i>
                  </div>

                  <div className="review-stars-group">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                </div>

                {/* Title & Review Text */}
                <h4 className="review-card-title">{item.title}</h4>
                <p className="review-card-body">{item.text}</p>

                {/* Author Info */}
                <div className="review-author-row">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="review-author-img"
                    loading="lazy"
                  />
                  <div className="review-author-meta">
                    <h5 className="review-author-name">{item.author}</h5>
                    <span className="review-author-role">{item.role}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          className="review-arrow-btn arrow-next"
          onClick={handleNext}
          aria-label="Next customer review"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      {/* Bottom Slider Pagination Dots */}
      <div className="reviews-pagination-dots">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`review-dot ${activeIndex === i ? 'active' : ''}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
