import React, { useState } from 'react';
import './CartDrawer.css';

export default function CartDrawer({
  isOpen = false,
  onClose = () => {},
  cart = [],
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onClearCart = () => {},
  onNavigate = () => {},
  user = null,
  onOrderPlaced = () => {}
}) {
  const [viewState, setViewState] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Checkout form state
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    phone: '',
    address: 'Near City Centre, K.S. Rao Road',
    city: 'Mangalore',
    state: 'Karnataka',
    pincode: '575001',
    paymentMethod: 'upi'
  });

  const [placedOrderRef, setPlacedOrderRef] = useState('');

  if (!isOpen) return null;

  // Subtotal calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const totalItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Free shipping threshold ₹499
  const freeShippingThreshold = 499;
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedPromo?.code === 'FREESHIP';
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : 49;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  // Discount calculation
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discount = Math.round((subtotal * appliedPromo.value) / 100);
    } else if (appliedPromo.type === 'flat') {
      discount = appliedPromo.value;
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'GIFT10' || code === 'SAVE10') {
      setAppliedPromo({ code, type: 'percent', value: 10, label: '10% Gifting Discount' });
      setPromoCode('');
    } else if (code === 'FINE50') {
      setAppliedPromo({ code, type: 'flat', value: 50, label: '₹50 Welcome Voucher' });
      setPromoCode('');
    } else if (code === 'FREESHIP') {
      setAppliedPromo({ code, type: 'free_shipping', value: 0, label: 'Free Express Shipping' });
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code. Try GIFT10 or FINE50');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.name.trim() || !shippingInfo.phone.trim()) {
      alert('Please provide your recipient name and phone number.');
      return;
    }

    const orderId = `FG-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrderRef(orderId);

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...cart],
      total: grandTotal,
      status: 'Processing',
      shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}`,
      paymentMethod: shippingInfo.paymentMethod.toUpperCase()
    };

    onOrderPlaced(newOrder);
    onClearCart();
    setViewState('success');
  };

  const handleCloseAndReset = () => {
    setViewState('cart');
    onClose();
  };

  return (
    <div className={`cart-drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={handleCloseAndReset}>
      <aside className="cart-drawer-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Shopping Cart">
        {/* ─── 1. HEADER ─── */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            {viewState === 'checkout' && (
              <button
                type="button"
                className="cart-drawer-close-btn"
                style={{ width: '32px', height: '32px', marginRight: '6px' }}
                onClick={() => setViewState('cart')}
                title="Back to Bag"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            )}
            <h2>
              {viewState === 'cart' && 'Your Shopping Bag'}
              {viewState === 'checkout' && 'Express Checkout'}
              {viewState === 'success' && 'Order Confirmed!'}
            </h2>
            {viewState === 'cart' && totalItemCount > 0 && (
              <span className="cart-drawer-count-badge">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
            )}
          </div>

          <button
            type="button"
            className="cart-drawer-close-btn"
            onClick={handleCloseAndReset}
            aria-label="Close cart drawer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* ─── VIEW A: CART ITEMS LIST ─── */}
        {viewState === 'cart' && (
          <>
            {/* Free Shipping Bar */}
            {totalItemCount > 0 && (
              <div className="cart-shipping-bar-box">
                <div className="cart-shipping-bar-text">
                  <i className="fa-solid fa-truck-fast"></i>
                  {isFreeShipping ? (
                    <span>🎉 You've unlocked <strong>FREE Express Shipping</strong>!</span>
                  ) : (
                    <span>Add <strong>₹{amountNeeded}</strong> more for <strong>FREE Delivery</strong></span>
                  )}
                </div>
                <div className="cart-progress-track">
                  <div className="cart-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            )}

            {/* Cart Body */}
            <div className="cart-drawer-body">
              {cart.length === 0 ? (
                <div className="cart-empty-state">
                  <div className="cart-empty-icon">
                    <i className="fa-solid fa-bag-shopping"></i>
                  </div>
                  <h3>Your Bag is Empty</h3>
                  <p>Discover personalized mugs, engraved frames, custom wallets, and festive hampers.</p>
                  <button
                    type="button"
                    className="cart-empty-btn"
                    onClick={() => {
                      onClose();
                      onNavigate('/shop');
                    }}
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Explore Best Sellers</span>
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item-card">
                    <div className="cart-item-thumb">
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
                    <div className="cart-item-info">
                      <div className="cart-item-header">
                        <h4 className="cart-item-title">{item.name}</h4>
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => onRemoveItem(item.id)}
                          title="Remove item"
                          aria-label={`Remove ${item.name} from bag`}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </div>

                      <div className="cart-item-bottom">
                        <div className="cart-item-price">
                          ₹{item.price * (item.quantity || 1)}
                        </div>

                        <div className="cart-item-qty-control">
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                            aria-label="Decrease quantity"
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>
                          <span className="cart-qty-val">{item.quantity || 1}</span>
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                            aria-label="Increase quantity"
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Promo & Summary Footer */}
            {cart.length > 0 && (
              <>
                <div className="cart-promo-section">
                  {appliedPromo ? (
                    <div className="cart-promo-applied">
                      <span>🏷️ {appliedPromo.label} ({appliedPromo.code})</span>
                      <button type="button" className="cart-promo-remove" onClick={handleRemovePromo}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="cart-promo-input-row">
                      <input
                        type="text"
                        placeholder="COUPON (e.g. GIFT10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="cart-promo-input"
                      />
                      <button type="submit" className="cart-promo-btn">Apply</button>
                    </form>
                  )}
                  {promoError && (
                    <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px' }}>
                      {promoError}
                    </div>
                  )}
                </div>

                <div className="cart-drawer-footer">
                  <div className="cart-summary-breakdown">
                    <div className="cart-summary-row">
                      <span>Subtotal</span>
                      <strong>₹{subtotal}</strong>
                    </div>

                    {discount > 0 && (
                      <div className="cart-summary-row" style={{ color: '#16a34a' }}>
                        <span>Discount ({appliedPromo?.code})</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}

                    <div className="cart-summary-row">
                      <span>Express Shipping</span>
                      <span>{shippingFee === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${shippingFee}`}</span>
                    </div>

                    <div className="cart-summary-row total-row">
                      <span>Grand Total</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="cart-checkout-btn"
                    onClick={() => setViewState('checkout')}
                  >
                    <span>Proceed to Checkout</span>
                    <span>₹{grandTotal} <i className="fa-solid fa-arrow-right"></i></span>
                  </button>

                  <div className="cart-secure-badge">
                    <i className="fa-solid fa-shield-halved" style={{ color: '#10b981' }}></i>
                    <span>100% Breakage-Free Guarantee &amp; Secure UPI Checkout</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ─── VIEW B: CHECKOUT FLOW ─── */}
        {viewState === 'checkout' && (
          <form className="checkout-view-panel" onSubmit={handleCheckoutSubmit}>
            <div className="checkout-view-body">
              <div className="checkout-step-title">
                <i className="fa-solid fa-location-dot" style={{ color: '#b8005b' }}></i>
                <span>Shipping Address</span>
              </div>

              <div className="checkout-input-grid">
                <div className="full-span">
                  <input
                    type="text"
                    className="checkout-input"
                    placeholder="Recipient Full Name *"
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                    required
                  />
                </div>

                <div className="full-span">
                  <input
                    type="tel"
                    className="checkout-input"
                    placeholder="Phone / WhatsApp Number *"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="full-span">
                  <input
                    type="text"
                    className="checkout-input"
                    placeholder="Street Address, House/Flat No. *"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    className="checkout-input"
                    placeholder="City *"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    className="checkout-input"
                    placeholder="Pincode *"
                    value={shippingInfo.pincode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="checkout-step-title">
                <i className="fa-solid fa-credit-card" style={{ color: '#b8005b' }}></i>
                <span>Payment Method</span>
              </div>

              <div className="payment-methods-list">
                <label className={`payment-radio-card ${shippingInfo.paymentMethod === 'upi' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payMethod"
                    value="upi"
                    checked={shippingInfo.paymentMethod === 'upi'}
                    onChange={() => setShippingInfo({ ...shippingInfo, paymentMethod: 'upi' })}
                  />
                  <div className="payment-card-info">
                    <strong>UPI Fast Pay (Google Pay / PhonePe / Paytm)</strong>
                    <span>Instant payment confirmation with ₹0 gateway fee</span>
                  </div>
                </label>

                <label className={`payment-radio-card ${shippingInfo.paymentMethod === 'cards' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payMethod"
                    value="cards"
                    checked={shippingInfo.paymentMethod === 'cards'}
                    onChange={() => setShippingInfo({ ...shippingInfo, paymentMethod: 'cards' })}
                  />
                  <div className="payment-card-info">
                    <strong>Credit / Debit Card / Net Banking</strong>
                    <span>Visa, Mastercard, RuPay &amp; all major banks</span>
                  </div>
                </label>

                <label className={`payment-radio-card ${shippingInfo.paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payMethod"
                    value="cod"
                    checked={shippingInfo.paymentMethod === 'cod'}
                    onChange={() => setShippingInfo({ ...shippingInfo, paymentMethod: 'cod' })}
                  />
                  <div className="payment-card-info">
                    <strong>Cash on Delivery (COD)</strong>
                    <span>Pay at doorstep when your gift arrives</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-summary-breakdown" style={{ marginBottom: '12px' }}>
                <div className="cart-summary-row total-row" style={{ borderTop: 'none', paddingTop: 0 }}>
                  <span>Total Payable</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button type="submit" className="cart-checkout-btn">
                <span>Place Order &amp; Confirm</span>
                <span><i className="fa-solid fa-lock"></i> Pay ₹{grandTotal}</span>
              </button>
            </div>
          </form>
        )}

        {/* ─── VIEW C: ORDER SUCCESS STATE ─── */}
        {viewState === 'success' && (
          <div className="order-success-view">
            <div className="order-success-icon">
              <i className="fa-solid fa-check"></i>
            </div>
            <h3>Thank You for Your Order!</h3>
            <span className="order-success-ref">Order #{placedOrderRef}</span>
            <p>
              Your personalized keepsakes are now queued for artisan crafting in our Mangalore studio.
              You will receive SMS tracking updates shortly.
            </p>
            <button
              type="button"
              className="cart-empty-btn"
              onClick={handleCloseAndReset}
            >
              <span>Continue Shopping</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
