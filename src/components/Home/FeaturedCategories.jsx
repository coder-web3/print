import React, { useRef } from 'react';

export default function FeaturedCategories({ categories = [], onCategoryClick = () => {} }) {
  const trackRef = useRef(null);

  const scroll = (offset) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="featured-categories-section">
      {/* Subtle ambient curved ribbon in background */}
      <div className="cat-ambient-glow"></div>
      <div className="cat-ribbon-curve"></div>

      <div className="container">
        {/* Header with Title, Accent Bar, Subtitle & Arrow Controls */}
        <div className="featured-cat-header">
          <div className="featured-cat-title-group">
            <span className="cat-section-subtitle">EXPLORE OUR COLLECTION</span>
            <h2 className="cat-section-main-title">
              Featured <span className="highlight-text">Categories</span>
            </h2>
            <div className="cat-accent-bar"></div>
            <p className="cat-section-desc">
              Discover thoughtful and personalised gifts for every occasion.
            </p>
          </div>

          <div className="cat-nav-controls">
            <button
              type="button"
              className="cat-nav-btn prev-btn"
              onClick={() => scroll(-280)}
              aria-label="Previous categories"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button
              type="button"
              className="cat-nav-btn next-btn"
              onClick={() => scroll(280)}
              aria-label="Next categories"
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Carousel Slider Track */}
        <div className="featured-categories-track" ref={trackRef}>
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="premium-category-card"
              style={{ animationDelay: `${idx * 0.08}s` }}
              onClick={() => onCategoryClick(cat)}
            >
              <div className="cat-card-img-container">
                <div className="cat-card-bg-wrap">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="cat-card-img"
                    onError={(e) => {
                      if (cat.fallbackImage && e.target.src !== cat.fallbackImage) {
                        e.target.src = cat.fallbackImage;
                      }
                    }}
                  />
                </div>

                {/* 3D Pop-Out Hover Element */}
                {cat.hover3dImage && (
                  <div className="cat-card-3d-hover-wrap">
                    <img
                      src={cat.hover3dImage}
                      alt={`${cat.name} 3D`}
                      className="cat-card-3d-hover-img"
                      loading="lazy"
                    />
                    <div className="cat-card-3d-glow"></div>
                  </div>
                )}

                {/* Floating Glowing Icon Badge */}
                <div className="cat-floating-icon-badge">
                  <i className={cat.icon || 'fa-solid fa-layer-group'}></i>
                </div>
              </div>

              <div className="cat-card-footer">
                <span className="cat-card-name">{cat.name}</span>
                <span className="cat-card-arrow">
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
