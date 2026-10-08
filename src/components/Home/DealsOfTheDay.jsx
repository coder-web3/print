import React, { useRef } from 'react';
import ProductCard from '../UI/ProductCard';

export default function DealsOfTheDay({
  products = [],
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onProductClick = () => {}
}) {
  const gridRef = useRef(null);

  const scrollDeals = (offset) => {
    if (gridRef.current) {
      gridRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="deals-section">
      <div className="container">
        {/* Header with Subtitle, Title, Description & Arrow Controls */}
        <div className="deals-section-header">
          <div className="deals-title-group">
            <span className="deals-subtitle">LIMITED TIME OFFERS</span>
            <h2 className="deals-main-title">
              Deals Of The <span className="highlight-text">Day</span>
            </h2>
            <p className="deals-desc">
              Grab your favourite products at special prices. Limited time only!
            </p>
          </div>

          <div className="deals-nav-controls">
            <button
              type="button"
              className="deal-nav-btn prev-btn"
              onClick={() => scrollDeals(-320)}
              aria-label="Previous deals"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button
              type="button"
              className="deal-nav-btn next-btn"
              onClick={() => scrollDeals(320)}
              aria-label="Next deals"
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Deals Grid / Slider */}
        <div className="deals-grid" ref={gridRef}>
          {products.length > 0 ? (
            products.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onProductClick={onProductClick}
              />
            ))
          ) : (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#777' }}>
              No deals available today.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
