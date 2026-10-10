import React from 'react';
import './WishlistModal.css';

export default function WishlistModal({
  isOpen = false,
  onClose = () => {},
  wishlist = [],
  onRemoveFromWishlist = () => {},
  onMoveToCart = () => {},
  onMoveAllToCart = () => {},
  onNavigate = () => {}
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`wishlist-modal-backdrop ${isOpen ? 'open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Wishlist Modal"
    >
      <div className="wishlist-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="wishlist-modal-header">
          <div className="wishlist-header-title-wrap">
            <i className="fa-solid fa-heart" style={{ color: '#b8005b', fontSize: '1.25rem' }}></i>
            <h2>My Wishlist</h2>
            <span className="wishlist-count-badge">
              {wishlist.length} {wishlist.length === 1 ? 'saved item' : 'saved items'}
            </span>
          </div>

          <button
            type="button"
            className="wishlist-close-btn"
            onClick={onClose}
            aria-label="Close Wishlist"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="wishlist-modal-body">
          {wishlist.length === 0 ? (
            <div className="wishlist-empty-state">
              <div className="wishlist-empty-icon">
                <i className="fa-regular fa-heart"></i>
              </div>
              <h3>Your Wishlist is Empty</h3>
              <p>Save items you love so you can easily personalize or purchase them later.</p>
              <button
                type="button"
                className="cart-empty-btn"
                onClick={() => {
                  onClose();
                  onNavigate('/shop');
                }}
              >
                <i className="fa-solid fa-gift"></i>
                <span>Explore Gift Collections</span>
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="wishlist-item-card">
                <div className="wishlist-item-main">
                  <div className="wishlist-item-thumb">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      onError={(e) => {
                        if (item.fallback_image_url && e.target.src !== item.fallback_image_url) {
                          e.target.src = item.fallback_image_url;
                        }
                      }}
                    />
                  </div>

                  <div className="wishlist-item-details">
                    <span className="wishlist-item-cat">{item.cat_name || 'GIFT'}</span>
                    <h4 className="wishlist-item-title" title={item.name}>
                      {item.name}
                    </h4>
                    <div className="wishlist-item-price-row">
                      <span className="wishlist-item-price">₹{item.price}</span>
                      {item.old_price && item.old_price > item.price && (
                        <span className="wishlist-item-old-price">₹{item.old_price}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="wishlist-item-actions">
                  <button
                    type="button"
                    className="wishlist-move-cart-btn"
                    onClick={() => onMoveToCart(item)}
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                    <span>Move to Cart</span>
                  </button>

                  <button
                    type="button"
                    className="wishlist-remove-btn"
                    onClick={() => onRemoveFromWishlist(item.id)}
                    title="Remove from wishlist"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="wishlist-modal-footer">
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Prices &amp; availability are subject to change.
            </span>
            <button
              type="button"
              className="wishlist-add-all-btn"
              onClick={onMoveAllToCart}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Move All to Bag</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
