import React, { useState, useRef } from 'react';
import ProductCard from '../UI/ProductCard';

export default function PopularProducts({
  products = [],
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onProductClick = () => {}
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const sliderRef = useRef(null);

  const filteredProducts = activeFilter === 'featured'
    ? products.filter((p) => p.rating >= 4.9)
    : products;

  const scrollSlider = (offset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="popular-products">
      <div className="container">
        <div className="popular-header">
          <h2>Popular Products</h2>
          <div className="popular-filters">
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Items
            </button>
            <button
              type="button"
              className={`filter-btn ${activeFilter === 'featured' ? 'active' : ''}`}
              onClick={() => setActiveFilter('featured')}
            >
              Featured
            </button>
          </div>
        </div>

        <div className="popular-slider-wrapper">
          <button
            type="button"
            className="pop-slider-btn prev desktop-only"
            onClick={() => scrollSlider(-320)}
            aria-label="Previous products"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          <div className="popular-track" ref={sliderRef}>
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onProductClick={onProductClick}
              />
            ))}
          </div>

          <button
            type="button"
            className="pop-slider-btn next desktop-only"
            onClick={() => scrollSlider(320)}
            aria-label="Next products"
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
