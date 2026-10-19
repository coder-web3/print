import React, { useRef } from 'react';

// Default studio images mapped to categories so cards NEVER show broken images
const CATEGORY_DEFAULT_IMAGES = {
  'infants': '/assets/images/gifts.avif',
  'boys': '/assets/images/lamps.avif',
  'girls': '/assets/images/frames.avif',
  'men': '/assets/images/wallets.avif',
  'women': '/assets/images/lamps.avif',
  'cups & mugs': '/assets/images/cups-product.avif',
  'celebration': '/assets/images/gifts.avif',
  'festivals': '/assets/images/lamps.avif',
  'corporate gifts': '/assets/images/corporate-gifts.avif',
  'photo frames': '/assets/images/frames.avif',
};

function getCategoryPhoto(cat) {
  if (cat?.image_url && typeof cat.image_url === 'string' && cat.image_url.trim()) {
    return cat.image_url.trim();
  }
  if (cat?.image && typeof cat.image === 'string' && cat.image.trim()) {
    return cat.image.trim();
  }
  const nameKey = (cat?.name || '').trim().toLowerCase();
  return CATEGORY_DEFAULT_IMAGES[nameKey] || '/assets/images/gifts.avif';
}

function getCategoryFallback(cat) {
  if (cat?.fallbackImage && typeof cat.fallbackImage === 'string' && cat.fallbackImage.trim()) {
    return cat.fallbackImage.trim();
  }
  const nameKey = (cat?.name || '').trim().toLowerCase();
  return CATEGORY_DEFAULT_IMAGES[nameKey] || '/assets/images/cups-product.avif';
}

export default function FeaturedCategories({ content = null, categories = [], onCategoryClick = () => {} }) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const hasMoved = useRef(false);

  const subtitle = content?.subtitle || 'EXPLORE OUR COLLECTION';
  const titleMain = content?.titleMain || 'Featured';
  const titleHighlight = content?.titleHighlight || 'Categories';
  const description = content?.description || 'Discover thoughtful and personalised gifts for every occasion.';

  const scroll = (offset) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftPos.current = trackRef.current.scrollLeft;
    trackRef.current.classList.add('active-drag');
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      trackRef.current?.classList.remove('active-drag');
    }
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      trackRef.current?.classList.remove('active-drag');
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 6) {
      hasMoved.current = true;
    }
    trackRef.current.scrollLeft = scrollLeftPos.current - walk;
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
            <span className="cat-section-subtitle">{subtitle}</span>
            <h2 className="cat-section-main-title">
              {titleMain} <span className="highlight-text">{titleHighlight}</span>
            </h2>
            <div className="cat-accent-bar"></div>
            <p className="cat-section-desc">
              {description}
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
        <div
          className="featured-categories-track"
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {categories.map((cat, idx) => {
            const imgSrc = getCategoryPhoto(cat);
            const fallbackSrc = getCategoryFallback(cat);
            const hover3d = cat.hover3dImage || (cat.name === 'Cups & Mugs' ? '/assets/images/cup-3d.png' : null);

            return (
              <div
                key={cat.id || idx}
                className="premium-category-card"
                style={{ animationDelay: `${idx * 0.08}s` }}
                onClick={() => {
                  if (!hasMoved.current) {
                    onCategoryClick(cat);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCategoryClick(cat);
                  }
                }}
              >
                <div className="cat-card-img-container">
                  <div className="cat-card-bg-wrap">
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      loading="lazy"
                      className="cat-card-img"
                      onError={(e) => {
                        if (e.currentTarget.src !== fallbackSrc && !e.currentTarget.src.endsWith(fallbackSrc)) {
                          e.currentTarget.src = fallbackSrc;
                        } else {
                          e.currentTarget.src = '/assets/images/cups-product.avif';
                        }
                      }}
                    />
                  </div>

                  {/* 3D Pop-Out Hover Element */}
                  {hover3d && (
                    <div className="cat-card-3d-hover-wrap">
                      <img
                        src={hover3d}
                        alt={`${cat.name} 3D`}
                        className="cat-card-3d-hover-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
