import React, { useState, useEffect } from 'react';
import './AccountModal.css';

export default function AccountModal({
  isOpen = false,
  onClose = () => {},
  user = null,
  onUpdateUser = () => {},
  onLogout = () => {},
  onLogin = () => {},
  onOpenAuth = () => {},
  orders = [],
  onOpenWishlist = () => {},
  onOpenCart = () => {}
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'orders' | 'address'

  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Rahul Sharma',
    email: user?.email || 'rahul.sharma@example.com',
    phone: user?.phone || '+91 98765 43210',
    city: 'Mangalore',
    pincode: '575001'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: 'Mangalore',
        pincode: '575001'
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Default mock orders if none placed yet
  const defaultOrders = [
    {
      id: 'FG-ORD-882194',
      date: '04 Oct 2026',
      items: [{ name: 'Personalized Ceramic Magic Coffee Mug', quantity: 2, price: 349 }],
      total: 698,
      status: 'Delivered',
      shippingAddress: 'Kadri Hills, Mangalore, Karnataka - 575004'
    },
    {
      id: 'FG-ORD-771920',
      date: '28 Sep 2026',
      items: [{ name: 'Handcrafted Wooden Engraved Photo Frame', quantity: 1, price: 799 }],
      total: 799,
      status: 'Delivered',
      shippingAddress: 'K.S. Rao Road, Mangalore, Karnataka - 575001'
    }
  ];

  const displayOrders = orders && orders.length > 0 ? orders : defaultOrders;

  const getInitials = (name) => {
    if (!name) return 'FG';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div
      className={`account-modal-backdrop ${isOpen ? 'open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="My Account Dialog"
    >
      <div className="account-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="account-modal-header">
          <div className="account-header-profile">
            <div className="account-avatar-circle">
              {getInitials(user?.name || profileForm.name)}
            </div>
            <div className="account-user-meta">
              <h2>{user?.name || profileForm.name}</h2>
              <span>{user?.email || profileForm.email} • {user?.role === 'admin' ? 'Store Administrator' : 'Artisan Rewards Member'}</span>
            </div>
          </div>

          <button
            type="button"
            className="account-modal-close-btn"
            onClick={onClose}
            aria-label="Close My Account"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="account-tabs-bar" role="tablist">
          <button
            type="button"
            className={`account-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fa-regular fa-user"></i>
            <span>Profile Details</span>
          </button>

          <button
            type="button"
            className={`account-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fa-solid fa-box-archive"></i>
            <span>My Orders ({displayOrders.length})</span>
          </button>

          <button
            type="button"
            className={`account-tab-btn ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            <i className="fa-solid fa-location-dot"></i>
            <span>Saved Addresses</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="account-tab-body">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <div className="account-form-grid">
                <div className="account-form-group">
                  <label className="account-label">Full Name</label>
                  <input
                    type="text"
                    className="account-input"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="account-form-group">
                  <label className="account-label">Email Address</label>
                  <input
                    type="email"
                    className="account-input"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="account-form-group">
                  <label className="account-label">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    className="account-input"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="account-form-group">
                  <label className="account-label">Primary City</label>
                  <input
                    type="text"
                    className="account-input"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button type="submit" className="account-save-btn">
                  Save Changes
                </button>
                {savedSuccess && (
                  <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-check"></i> Profile updated successfully!
                  </span>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="account-orders-list">
              {displayOrders.map((ord) => (
                <div key={ord.id} className="account-order-card">
                  <div className="account-order-top">
                    <span className="account-order-id">{ord.id}</span>
                    <span
                      className={`account-order-status-badge ${
                        ord.status.toLowerCase() === 'delivered'
                          ? 'delivered'
                          : ord.status.toLowerCase() === 'processing'
                          ? 'processing'
                          : 'transit'
                      }`}
                    >
                      ● {ord.status}
                    </span>
                  </div>

                  <div className="account-order-items">
                    {ord.items.map((it, idx) => (
                      <div key={idx} style={{ marginBottom: '3px' }}>
                        {it.name} (x{it.quantity || 1})
                      </div>
                    ))}
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                      Ordered on {ord.date} • {ord.shippingAddress}
                    </div>
                  </div>

                  <div className="account-order-bottom">
                    <span style={{ color: '#64748b' }}>Total Paid</span>
                    <span className="account-order-total">₹{ord.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'address' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="account-address-card">
                <div className="account-address-details">
                  <span className="account-address-tag">Default Delivery</span>
                  <strong>{profileForm.name}</strong>
                  <p>
                    Near City Centre Mall, K.S. Rao Road, Hampankatta<br />
                    Mangalore, Karnataka - 575001<br />
                    Phone: {profileForm.phone}
                  </p>
                </div>
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: '1px solid #fbcfe8',
                    color: '#b8005b',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onClick={() => alert('Address editing opened!')}
                >
                  Edit
                </button>
              </div>

              <div className="account-address-card" style={{ background: '#ffffff', borderStyle: 'dashed' }}>
                <div className="account-address-details">
                  <span className="account-address-tag" style={{ background: '#64748b' }}>Secondary</span>
                  <strong>Office / Workshop</strong>
                  <p>
                    Kadri Hills, Highway Junction<br />
                    Mangalore, Karnataka - 575004<br />
                    Phone: {profileForm.phone}
                  </p>
                </div>
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onClick={() => alert('Address editing opened!')}
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="account-footer-bar">
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#b8005b',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={() => {
                onClose();
                onOpenWishlist();
              }}
            >
              <i className="fa-solid fa-heart"></i> View Wishlist
            </button>

            <button
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#7a2277',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={() => {
                onClose();
                onOpenCart();
              }}
            >
              <i className="fa-solid fa-cart-shopping"></i> View Bag
            </button>
          </div>

          <button
            type="button"
            className="account-logout-btn"
            onClick={() => {
              onClose();
              if (user) {
                onLogout();
              } else {
                if (onOpenAuth) onOpenAuth('login');
              }
            }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>{user ? 'Log Out' : 'Sign In to Your Account'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
