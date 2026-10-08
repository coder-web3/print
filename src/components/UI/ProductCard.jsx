import React from 'react';

export default function ProductCard({
  product,
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onProductClick = () => {}
}) {
  if (!product) return null;

  const hasDiscount = product.old_price && product.old_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  return (
    <div className="prod-card premium-deal-card">
      {/* 1. Image Area with Badges & Doodles */}
      <div className="prod-img-box">
        {hasDiscount && (
          <span className="badge-sale">-{discountPercent}%</span>
        )}

        <button
          type="button"
          className="wishlist-icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist(product);
          }}
          title="Add to Wishlist"
          aria-label="Add to Wishlist"
        >
          <i className="fa-regular fa-heart"></i>
        </button>

        <a
          href={`#product-${product.id}`}
          onClick={(e) => {
            e.preventDefault();
            onProductClick(product);
          }}
          className="prod-img-link"
        >
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              if (product.fallback_image_url && e.target.src !== product.fallback_image_url) {
                e.target.src = product.fallback_image_url;
              }
            }}
          />
        </a>

        {/* Hand-drawn aesthetic doodle note if present */}
        {product.doodle && (
          <div className="deal-doodle-annotation">
            <span>{product.doodle}</span>
            <svg viewBox="0 0 30 20" width="22" height="15" className="doodle-curve">
              <path d="M5,2 Q15,18 25,8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="2,2" />
              <polygon points="25,5 28,10 22,9" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>

      {/* 2. Product Information Area */}
      <div className="prod-info">
        <span className="prod-cat">{product.cat_name || 'GENERAL'}</span>

        <a
          href={`#product-${product.id}`}
          className="prod-title"
          title={product.name}
          onClick={(e) => {
            e.preventDefault();
            onProductClick(product);
          }}
        >
          {product.name}
        </a>

        <div className="prod-meta">
          <div className="price-box">
            <span className="prod-price">₹{product.price}</span>
            {hasDiscount && (
              <span className="old-price">₹{product.old_price}</span>
            )}
          </div>

          <div className="prod-rating">
            <i className="fa-solid fa-star"></i>
            <span>{product.rating || '4.8'}</span>
            <span className="review-count">({product.reviews_count || '120'})</span>
          </div>
        </div>

        {/* 3. Integrated Add To Cart Pill Bar */}
        <button
          type="button"
          className="deal-cart-action-btn"
          onClick={() => onAddToCart(product)}
        >
          <span className="cart-text">
            <i className="fa-solid fa-cart-shopping"></i> Add to Cart
          </span>
          <span className="cart-arrow-circle">
            <i className="fa-solid fa-arrow-right"></i>
          </span>
        </button>
      </div>
    </div>
  );
}
