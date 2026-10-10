import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

// Default mock orders if none placed yet
const DEFAULT_ORDERS = [
  {
    id: 'FG-ORD-882194',
    date: '04 Oct 2026',
    estDelivery: '08 Oct 2026',
    items: [
      { name: 'Personalized Ceramic Magic Coffee Mug', quantity: 2, price: 349, img: '/assets/cups.avif' }
    ],
    subtotal: 698,
    shipping: 0,
    total: 698,
    status: 'Delivered',
    courier: 'BlueDart Express',
    awb: 'BLUEDART-88910245',
    shippingAddress: 'Kadri Hills, Highway Junction, Mangalore, Karnataka - 575004'
  },
  {
    id: 'FG-ORD-771920',
    date: '28 Sep 2026',
    estDelivery: '02 Oct 2026',
    items: [
      { name: 'Handcrafted Wooden Engraved Photo Frame', quantity: 1, price: 799, img: '/assets/mockup.avif' }
    ],
    subtotal: 799,
    shipping: 0,
    total: 799,
    status: 'Delivered',
    courier: 'Delhivery Surface',
    awb: 'DELHIVERY-44102998',
    shippingAddress: 'Near City Centre Mall, K.S. Rao Road, Mangalore, Karnataka - 575001'
  }
];

// Default saved addresses
const DEFAULT_ADDRESSES = [
  {
    id: 'addr_1',
    isDefault: true,
    tag: 'Home',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    addressLine1: 'Flat 402, Green Valley Apartments, Kadri Hills',
    landmark: 'Opposite Kadri Temple Arch',
    city: 'Mangalore',
    state: 'Karnataka',
    pincode: '575004'
  },
  {
    id: 'addr_2',
    isDefault: false,
    tag: 'Office / Studio',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    addressLine1: '3rd Floor, Crystal Commercial Tower, K.S. Rao Road',
    landmark: 'Near Hampankatta Circle',
    city: 'Mangalore',
    state: 'Karnataka',
    pincode: '575001'
  }
];

export default function UserDashboard({
  user = null,
  orders = [],
  wishlist = [],
  cart = [],
  onNavigate = () => {},
  onOpenAuth = () => {},
  onLogout = () => {},
  onUpdateUser = () => {},
  onAddToCart = () => {},
  onRemoveWishlist = () => {},
  showNotification = () => {}
}) {
  // Navigation tabs: 'overview' | 'orders' | 'addresses' | 'wishlist' | 'profile' | 'coupons'
  const [activeTab, setActiveTab] = useState('overview');

  // Filter chips in Orders tab
  const [ordersFilter, setOrdersFilter] = useState('all'); // 'all' | 'delivered' | 'intransit' | 'processing'

  // Saved addresses state with localStorage persistence
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem('finegift_addresses');
      return stored ? JSON.parse(stored) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  });

  // Track Package Modal
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Address edit modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    id: '',
    tag: 'Home',
    name: '',
    phone: '',
    addressLine1: '',
    landmark: '',
    city: 'Mangalore',
    state: 'Karnataka',
    pincode: '575001',
    isDefault: false
  });

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: 'Mangalore',
    dob: '1995-08-15',
    anniversary: '2022-11-20'
  });

  // Change Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Keep addresses saved to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('finegift_addresses', JSON.stringify(savedAddresses));
    } catch {}
  }, [savedAddresses]);

  // Keep profile form synced with user
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Merge real orders placed in checkout with default orders
  const displayOrders = orders && orders.length > 0 ? orders : DEFAULT_ORDERS;

  // Filter orders
  const filteredOrders = displayOrders.filter((ord) => {
    if (ordersFilter === 'all') return true;
    const status = (ord.status || 'delivered').toLowerCase();
    if (ordersFilter === 'delivered') return status === 'delivered';
    if (ordersFilter === 'intransit') return status.includes('transit');
    if (ordersFilter === 'processing') return status === 'processing';
    return true;
  });

  const getInitials = (name) => {
    if (!name) return 'FG';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Handle Profile Update
  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone
    });
    showNotification('success', 'Profile Updated', 'Your profile details have been saved.');
  };

  // Handle Password Update
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      showNotification('error', 'Error', 'Please enter your current password.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showNotification('error', 'Error', 'New password must be at least 6 characters.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('error', 'Error', 'New passwords do not match.');
      return;
    }

    // Update in finegift_registered_users
    try {
      const stored = localStorage.getItem('finegift_registered_users');
      if (stored) {
        const users = JSON.parse(stored);
        const target = users.find((u) => u.email.toLowerCase() === (user?.email || '').toLowerCase());
        if (target) {
          target.password = passwordData.newPassword;
          localStorage.setItem('finegift_registered_users', JSON.stringify(users));
        }
      }
    } catch {}

    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showNotification('success', 'Password Changed', 'Your security password has been updated successfully.');
  };

  // Handle Address Management
  const handleSetDefaultAddress = (addressId) => {
    setSavedAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    );
    showNotification('success', 'Default Address', 'Updated default shipping address.');
  };

  const handleDeleteAddress = (addressId) => {
    if (savedAddresses.length <= 1) {
      showNotification('error', 'Notice', 'You must maintain at least one delivery address.');
      return;
    }
    setSavedAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    showNotification('info', 'Address Removed', 'The address has been deleted.');
  };

  const handleOpenNewAddress = () => {
    setAddressFormData({
      id: '',
      tag: 'Home',
      name: user?.name || '',
      phone: user?.phone || '',
      addressLine1: '',
      landmark: '',
      city: 'Mangalore',
      state: 'Karnataka',
      pincode: '575001',
      isDefault: savedAddresses.length === 0
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressFormData.name || !addressFormData.phone || !addressFormData.addressLine1) {
      showNotification('error', 'Required Fields', 'Please complete recipient name, phone, and address.');
      return;
    }

    if (addressFormData.id) {
      // Edit
      setSavedAddresses((prev) =>
        prev.map((a) => (a.id === addressFormData.id ? { ...addressFormData } : a))
      );
      showNotification('success', 'Address Saved', 'Shipping address updated.');
    } else {
      // Create new
      const newAddr = {
        ...addressFormData,
        id: `addr_${Date.now()}`
      };
      setSavedAddresses((prev) => [newAddr, ...prev]);
      showNotification('success', 'Address Added', 'New delivery address added.');
    }
    setIsAddressModalOpen(false);
  };

  // Copy Coupon Code
  const handleCopyCoupon = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    showNotification('success', 'Coupon Copied!', `Code "${code}" copied to clipboard.`);
  };

  // If user is NOT logged in, show welcoming sign-in banner
  if (!user) {
    return (
      <div className="user-dashboard-wrapper">
        <div className="container">
          <div className="dashboard-breadcrumb">
            <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>Home</a>
            <span>/</span>
            <span className="current">My Account Dashboard</span>
          </div>

          <div className="dashboard-empty-prompt">
            <div className="dashboard-empty-icon">
              <i className="fa-regular fa-user"></i>
            </div>
            <h2>Access Your User Dashboard</h2>
            <p>
              Please sign in or create an account to view your past orders, track active deliveries,
              manage saved shipping addresses, and unlock exclusive VIP gifting rewards.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="dashboard-save-btn"
                onClick={() => onOpenAuth('login')}
              >
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                <span>Sign In to Account</span>
              </button>
              <button
                type="button"
                className="order-action-btn"
                style={{ padding: '12px 20px', borderRadius: '10px' }}
                onClick={() => onOpenAuth('signup')}
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Create New Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard-wrapper">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="dashboard-breadcrumb">
          <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>Home</a>
          <span>/</span>
          <span className="current">User Portal &amp; Dashboard</span>
        </div>

        {/* 1. Hero Header Banner */}
        <div className="dashboard-hero-banner">
          <div className="dashboard-user-card">
            <div className="dashboard-avatar">
              {getInitials(user.name)}
            </div>
            <div className="dashboard-user-info">
              <h1>Hello, {user.name}!</h1>
              <div className="dashboard-badges-row">
                <span className="dashboard-tier-badge">
                  <i className="fa-solid fa-gem"></i>
                  <span>Artisan Gold VIP Member</span>
                </span>
                <span className="dashboard-user-meta-sub">
                  <i className="fa-regular fa-envelope" style={{ marginRight: '4px' }}></i>
                  {user.email}
                </span>
                {user.phone && (
                  <span className="dashboard-user-meta-sub">
                    <i className="fa-solid fa-phone" style={{ marginRight: '4px' }}></i>
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-hero-actions">
            <button
              type="button"
              className="dashboard-hero-btn"
              onClick={() => onNavigate('/shop')}
            >
              <i className="fa-solid fa-bag-shopping"></i>
              <span>Explore Studio</span>
            </button>
            <button
              type="button"
              className="dashboard-hero-btn logout"
              onClick={onLogout}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 2. Main Dashboard Layout Grid */}
        <div className="dashboard-grid">
          {/* Left Sticky Sidebar Navigation */}
          <aside className="dashboard-sidebar">
            <div className="dashboard-sidebar-title">Personal Center</div>

            <button
              type="button"
              className={`dashboard-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <div className="dashboard-nav-left">
                <i className="fa-solid fa-chart-pie"></i>
                <span>Overview</span>
              </div>
            </button>

            <button
              type="button"
              className={`dashboard-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <div className="dashboard-nav-left">
                <i className="fa-solid fa-box-archive"></i>
                <span>My Orders</span>
              </div>
              <span className="dashboard-nav-badge">{displayOrders.length}</span>
            </button>

            <button
              type="button"
              className={`dashboard-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <div className="dashboard-nav-left">
                <i className="fa-solid fa-location-dot"></i>
                <span>Saved Addresses</span>
              </div>
              <span className="dashboard-nav-badge">{savedAddresses.length}</span>
            </button>

            <button
              type="button"
              className={`dashboard-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              <div className="dashboard-nav-left">
                <i className="fa-regular fa-heart"></i>
                <span>My Wishlist</span>
              </div>
              {wishlist.length > 0 && <span className="dashboard-nav-badge">{wishlist.length}</span>}
            </button>

            <button
              type="button"
              className={`dashboard-nav-item ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              <div className="dashboard-nav-left">
                <i className="fa-solid fa-tags"></i>
                <span>Wallet &amp; Vouchers</span>
              </div>
              <span className="dashboard-nav-badge">₹100</span>
            </button>

            <button
              type="button"
              className={`dashboard-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <div className="dashboard-nav-left">
                <i className="fa-regular fa-id-card"></i>
                <span>Profile &amp; Security</span>
              </div>
            </button>

            <div className="dashboard-nav-divider"></div>

            <button
              type="button"
              className="dashboard-nav-item"
              style={{ color: '#dc2626' }}
              onClick={onLogout}
            >
              <div className="dashboard-nav-left">
                <i className="fa-solid fa-right-from-bracket" style={{ color: '#dc2626' }}></i>
                <span>Log Out</span>
              </div>
            </button>
          </aside>

          {/* Right Main Content Area */}
          <main className="dashboard-main-content">
            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB 1: OVERVIEW                                         */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 'overview' && (
              <div>
                <div className="dashboard-panel-header">
                  <div className="dashboard-panel-title">
                    <h2>Account Overview</h2>
                    <p>Track your ongoing gifting orders, reward credits, and delivery status.</p>
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="dashboard-stats-grid">
                  <div className="dashboard-stat-card" onClick={() => setActiveTab('orders')}>
                    <div className="dashboard-stat-icon orders">
                      <i className="fa-solid fa-boxes-stacked"></i>
                    </div>
                    <div>
                      <div className="dashboard-stat-value">{displayOrders.length}</div>
                      <div className="dashboard-stat-label">Total Orders Placed</div>
                    </div>
                  </div>

                  <div className="dashboard-stat-card" onClick={() => setActiveTab('orders')}>
                    <div className="dashboard-stat-icon transit">
                      <i className="fa-solid fa-truck-fast"></i>
                    </div>
                    <div>
                      <div className="dashboard-stat-value">
                        {displayOrders.filter((o) => (o.status || '').toLowerCase() !== 'delivered').length || 1}
                      </div>
                      <div className="dashboard-stat-label">Active Shipments</div>
                    </div>
                  </div>

                  <div className="dashboard-stat-card" onClick={() => setActiveTab('wishlist')}>
                    <div className="dashboard-stat-icon wishlist">
                      <i className="fa-solid fa-heart"></i>
                    </div>
                    <div>
                      <div className="dashboard-stat-value">{wishlist.length}</div>
                      <div className="dashboard-stat-label">Saved Wishlist Items</div>
                    </div>
                  </div>

                  <div className="dashboard-stat-card" onClick={() => setActiveTab('coupons')}>
                    <div className="dashboard-stat-icon wallet">
                      <i className="fa-solid fa-wallet"></i>
                    </div>
                    <div>
                      <div className="dashboard-stat-value">₹100</div>
                      <div className="dashboard-stat-label">Studio Gift Credits</div>
                    </div>
                  </div>
                </div>

                {/* Ongoing Order Live Tracker Preview */}
                <div className="dashboard-tracker-box">
                  <div className="dashboard-tracker-head">
                    <h4>
                      <i className="fa-solid fa-truck-ramp-box"></i>
                      <span>Latest Shipment: FG-ORD-882194</span>
                    </h4>
                    <span className="status-badge delivered">Delivered Successfully</span>
                  </div>

                  <div className="dashboard-timeline">
                    <div className="dashboard-timeline-step completed">
                      <div className="dashboard-step-bullet"><i className="fa-solid fa-check"></i></div>
                      <div className="dashboard-step-title">Order Confirmed</div>
                      <div className="dashboard-step-time">04 Oct, 10:30 AM</div>
                    </div>

                    <div className="dashboard-timeline-step completed">
                      <div className="dashboard-step-bullet"><i className="fa-solid fa-check"></i></div>
                      <div className="dashboard-step-title">Printed &amp; Packed</div>
                      <div className="dashboard-step-time">05 Oct, 03:15 PM</div>
                    </div>

                    <div className="dashboard-timeline-step completed">
                      <div className="dashboard-step-bullet"><i className="fa-solid fa-check"></i></div>
                      <div className="dashboard-step-title">Dispatched (BlueDart)</div>
                      <div className="dashboard-step-time">06 Oct, 09:00 AM</div>
                    </div>

                    <div className="dashboard-timeline-step completed">
                      <div className="dashboard-step-bullet"><i className="fa-solid fa-house-chimney-check"></i></div>
                      <div className="dashboard-step-title">Delivered</div>
                      <div className="dashboard-step-time">08 Oct, 02:45 PM</div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Shortcut */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Recent Orders</h3>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#b8005b', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                    onClick={() => setActiveTab('orders')}
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="dashboard-orders-list">
                  {displayOrders.slice(0, 2).map((ord) => (
                    <div key={ord.id} className="dashboard-order-card">
                      <div className="dashboard-order-card-head">
                        <div className="order-id-group">
                          <span className="order-id-badge">#{ord.id}</span>
                          <span className="order-date-text">• Placed on {ord.date}</span>
                        </div>
                        <span className={`status-badge ${(ord.status || 'delivered').toLowerCase()}`}>
                          <i className="fa-solid fa-circle-check"></i>
                          <span>{ord.status || 'Delivered'}</span>
                        </span>
                      </div>

                      <div className="dashboard-order-items-row">
                        {(ord.items || []).map((itm, i) => (
                          <div key={i} className="dashboard-order-item">
                            <div className="dashboard-item-info">
                              <span className="dashboard-item-bullet"></span>
                              <strong>{itm.name}</strong>
                              <span style={{ color: '#64748b' }}>x{itm.quantity || 1}</span>
                            </div>
                            <span style={{ fontWeight: 700 }}>₹{itm.price * (itm.quantity || 1)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="dashboard-order-card-foot">
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Total Paid: </span>
                          <span className="order-total-price">₹{ord.total}</span>
                        </div>
                        <div className="order-actions-wrap">
                          <button
                            type="button"
                            className="order-action-btn"
                            onClick={() => setTrackingOrder(ord)}
                          >
                            <i className="fa-solid fa-truck-fast"></i>
                            <span>Track Package</span>
                          </button>
                          <button
                            type="button"
                            className="order-action-btn"
                            onClick={() => showNotification('success', 'Tax Invoice', `Invoice #${ord.id}.pdf download initiated.`)}
                          >
                            <i className="fa-solid fa-download"></i>
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB 2: MY ORDERS                                        */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 'orders' && (
              <div>
                <div className="dashboard-panel-header">
                  <div className="dashboard-panel-title">
                    <h2>Order History &amp; Tracking</h2>
                    <p>View all your handcrafted gift orders, track live status, and download invoices.</p>
                  </div>
                </div>

                {/* Filter chips */}
                <div className="orders-filter-chips">
                  <button
                    type="button"
                    className={`orders-filter-chip ${ordersFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setOrdersFilter('all')}
                  >
                    All Orders ({displayOrders.length})
                  </button>
                  <button
                    type="button"
                    className={`orders-filter-chip ${ordersFilter === 'delivered' ? 'active' : ''}`}
                    onClick={() => setOrdersFilter('delivered')}
                  >
                    Delivered
                  </button>
                  <button
                    type="button"
                    className={`orders-filter-chip ${ordersFilter === 'intransit' ? 'active' : ''}`}
                    onClick={() => setOrdersFilter('intransit')}
                  >
                    In Transit
                  </button>
                  <button
                    type="button"
                    className={`orders-filter-chip ${ordersFilter === 'processing' ? 'active' : ''}`}
                    onClick={() => setOrdersFilter('processing')}
                  >
                    Processing
                  </button>
                </div>

                {filteredOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
                    <i className="fa-solid fa-box-open" style={{ fontSize: '36px', marginBottom: '12px', display: 'block', color: '#cbd5e1' }}></i>
                    <p>No orders found matching this filter.</p>
                  </div>
                ) : (
                  <div className="dashboard-orders-list">
                    {filteredOrders.map((ord) => (
                      <div key={ord.id} className="dashboard-order-card">
                        <div className="dashboard-order-card-head">
                          <div className="order-id-group">
                            <span className="order-id-badge">#{ord.id}</span>
                            <span className="order-date-text">• Placed on {ord.date}</span>
                          </div>
                          <span className={`status-badge ${(ord.status || 'delivered').toLowerCase()}`}>
                            <i className="fa-solid fa-circle-check"></i>
                            <span>{ord.status || 'Delivered'}</span>
                          </span>
                        </div>

                        <div className="dashboard-order-items-row">
                          {(ord.items || []).map((itm, i) => (
                            <div key={i} className="dashboard-order-item">
                              <div className="dashboard-item-info">
                                <span className="dashboard-item-bullet"></span>
                                <strong>{itm.name}</strong>
                                <span style={{ color: '#64748b' }}>x{itm.quantity || 1}</span>
                              </div>
                              <span style={{ fontWeight: 700 }}>₹{itm.price * (itm.quantity || 1)}</span>
                            </div>
                          ))}
                        </div>

                        {ord.shippingAddress && (
                          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px' }}>
                            <i className="fa-solid fa-location-dot" style={{ marginRight: '6px', color: '#b8005b' }}></i>
                            <span>Delivered to: {ord.shippingAddress}</span>
                          </div>
                        )}

                        <div className="dashboard-order-card-foot">
                          <div>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>Grand Total: </span>
                            <span className="order-total-price">₹{ord.total}</span>
                          </div>
                          <div className="order-actions-wrap">
                            <button
                              type="button"
                              className="order-action-btn primary"
                              onClick={() => setTrackingOrder(ord)}
                            >
                              <i className="fa-solid fa-location-crosshairs"></i>
                              <span>Live Tracking</span>
                            </button>
                            <button
                              type="button"
                              className="order-action-btn"
                              onClick={() => showNotification('success', 'Tax Invoice', `Invoice #${ord.id}.pdf downloaded.`)}
                            >
                              <i className="fa-solid fa-file-invoice"></i>
                              <span>Invoice</span>
                            </button>
                            <button
                              type="button"
                              className="order-action-btn"
                              onClick={() => {
                                ord.items?.forEach((itm) => onAddToCart(itm));
                                showNotification('success', 'Items Added', 'Order items added back into your bag!');
                              }}
                            >
                              <i className="fa-solid fa-rotate-right"></i>
                              <span>Reorder</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB 3: SAVED ADDRESSES                                  */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 'addresses' && (
              <div>
                <div className="dashboard-panel-header">
                  <div className="dashboard-panel-title">
                    <h2>Saved Shipping Addresses</h2>
                    <p>Manage your home, office, and recipient delivery destinations.</p>
                  </div>
                  <button
                    type="button"
                    className="dashboard-save-btn"
                    onClick={handleOpenNewAddress}
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="addresses-grid">
                  {savedAddresses.map((addr) => (
                    <div key={addr.id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                      <div>
                        {addr.isDefault && (
                          <span className="address-tag-pill">Default Delivery Address</span>
                        )}
                        <h4>{addr.name} ({addr.tag})</h4>
                        <p>
                          {addr.addressLine1}<br />
                          {addr.landmark && <>{addr.landmark}<br /></>}
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong><br />
                          Phone: <strong>{addr.phone}</strong>
                        </p>
                      </div>

                      <div className="address-card-actions">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            className="order-action-btn"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          type="button"
                          className="order-action-btn"
                          onClick={() => {
                            setAddressFormData({ ...addr });
                            setIsAddressModalOpen(true);
                          }}
                        >
                          <i className="fa-solid fa-pen"></i> Edit
                        </button>
                        <button
                          type="button"
                          className="order-action-btn"
                          style={{ color: '#dc2626' }}
                          onClick={() => handleDeleteAddress(addr.id)}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="add-address-card-btn" onClick={handleOpenNewAddress}>
                    <i className="fa-solid fa-circle-plus" style={{ fontSize: '32px' }}></i>
                    <span>Add Another Address</span>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB 4: MY WISHLIST                                      */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="dashboard-panel-header">
                  <div className="dashboard-panel-title">
                    <h2>Saved Wishlist Items</h2>
                    <p>All your favorite customized gifts saved for special moments.</p>
                  </div>
                </div>

                {wishlist.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div style={{ fontSize: '40px', color: '#f472b6', marginBottom: '12px' }}>
                      <i className="fa-regular fa-heart"></i>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Your Wishlist is Empty</h3>
                    <p style={{ color: '#64748b', marginBottom: '20px' }}>
                      Browse personalized cups, frames, and hampers to save them here.
                    </p>
                    <button
                      type="button"
                      className="dashboard-save-btn"
                      onClick={() => onNavigate('/shop')}
                    >
                      <i className="fa-solid fa-gift"></i>
                      <span>Explore Personalized Gifts</span>
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          background: '#ffffff',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ position: 'relative', height: '170px', background: '#f8fafc' }}>
                          <img
                            src={item.image || '/assets/cups.avif'}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = '/assets/cups.avif'; }}
                          />
                        </div>
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                          <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>
                              {item.name}
                            </h4>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b8005b', marginBottom: '12px' }}>
                              ₹{item.price}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className="order-action-btn primary"
                              style={{ flex: 1, justifyContent: 'center' }}
                              onClick={() => {
                                onAddToCart(item);
                                onRemoveWishlist(item.id);
                              }}
                            >
                              <i className="fa-solid fa-cart-plus"></i> Move to Bag
                            </button>
                            <button
                              type="button"
                              className="order-action-btn"
                              style={{ color: '#dc2626' }}
                              onClick={() => onRemoveWishlist(item.id)}
                              aria-label="Remove from Wishlist"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB 5: WALLET & VOUCHERS                                */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 'coupons' && (
              <div>
                <div className="dashboard-panel-header">
                  <div className="dashboard-panel-title">
                    <h2>Studio Wallet &amp; Coupons</h2>
                    <p>Active discount vouchers and reward credits available for your checkout.</p>
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fff7ed 100%)', border: '1px solid #fbcfe8', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#9d174d', letterSpacing: '0.5px' }}>
                      Active Gift Credits
                    </span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#b8005b', margin: '4px 0 0 0' }}>₹100.00</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                      Auto-applicable on checkout on orders above ₹499.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="dashboard-save-btn"
                    onClick={() => onNavigate('/shop')}
                  >
                    Redeem Credits
                  </button>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                  Available Coupon Codes
                </h3>

                <div className="coupons-grid">
                  <div className="coupon-ticket-card">
                    <div className="coupon-ticket-info">
                      <h4>₹100 Welcome Discount</h4>
                      <p>Flat ₹100 off on your first personalized order.</p>
                      <span className="coupon-code-chip">WELCOME100</span>
                    </div>
                    <button
                      type="button"
                      className="copy-coupon-btn"
                      onClick={() => handleCopyCoupon('WELCOME100')}
                    >
                      <i className="fa-regular fa-copy"></i> Copy
                    </button>
                  </div>

                  <div className="coupon-ticket-card">
                    <div className="coupon-ticket-info">
                      <h4>10% Off Festival Gift</h4>
                      <p>Valid on all custom mugs and photo frames above ₹999.</p>
                      <span className="coupon-code-chip">GIFT10</span>
                    </div>
                    <button
                      type="button"
                      className="copy-coupon-btn"
                      onClick={() => handleCopyCoupon('GIFT10')}
                    >
                      <i className="fa-regular fa-copy"></i> Copy
                    </button>
                  </div>

                  <div className="coupon-ticket-card">
                    <div className="coupon-ticket-info">
                      <h4>Free Express Delivery</h4>
                      <p>Zero delivery charges anywhere across India.</p>
                      <span className="coupon-code-chip">FREESHIP</span>
                    </div>
                    <button
                      type="button"
                      className="copy-coupon-btn"
                      onClick={() => handleCopyCoupon('FREESHIP')}
                    >
                      <i className="fa-regular fa-copy"></i> Copy
                    </button>
                  </div>

                  <div className="coupon-ticket-card">
                    <div className="coupon-ticket-info">
                      <h4>₹50 Instant Discount</h4>
                      <p>Flat ₹50 off on custom t-shirts &amp; apparel.</p>
                      <span className="coupon-code-chip">FINE50</span>
                    </div>
                    <button
                      type="button"
                      className="copy-coupon-btn"
                      onClick={() => handleCopyCoupon('FINE50')}
                    >
                      <i className="fa-regular fa-copy"></i> Copy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB 6: PROFILE & SECURITY                               */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 'profile' && (
              <div>
                <div className="dashboard-panel-header">
                  <div className="dashboard-panel-title">
                    <h2>Profile &amp; Security Settings</h2>
                    <p>Update your personal information, gifting occasions, and security password.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} style={{ marginBottom: '40px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                    Personal Information
                  </h3>

                  <div className="dashboard-form-grid">
                    <div className="dashboard-form-field">
                      <label htmlFor="prof-name">Full Name</label>
                      <input
                        id="prof-name"
                        type="text"
                        className="dashboard-form-input"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="dashboard-form-field">
                      <label htmlFor="prof-email">Email Address</label>
                      <input
                        id="prof-email"
                        type="email"
                        className="dashboard-form-input"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="dashboard-form-field">
                      <label htmlFor="prof-phone">Mobile Number</label>
                      <input
                        id="prof-phone"
                        type="tel"
                        className="dashboard-form-input"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="dashboard-form-field">
                      <label htmlFor="prof-city">Primary City</label>
                      <input
                        id="prof-city"
                        type="text"
                        className="dashboard-form-input"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      />
                    </div>

                    <div className="dashboard-form-field">
                      <label htmlFor="prof-dob">Birthday (Special Birthday Perks)</label>
                      <input
                        id="prof-dob"
                        type="date"
                        className="dashboard-form-input"
                        value={profileData.dob}
                        onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                      />
                    </div>

                    <div className="dashboard-form-field">
                      <label htmlFor="prof-anniv">Anniversary (Gifting Reminders)</label>
                      <input
                        id="prof-anniv"
                        type="date"
                        className="dashboard-form-input"
                        value={profileData.anniversary}
                        onChange={(e) => setProfileData({ ...profileData, anniversary: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="dashboard-save-btn">
                    <i className="fa-solid fa-floppy-disk"></i>
                    <span>Save Profile Changes</span>
                  </button>
                </form>

                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '32px 0' }} />

                {/* Change Password Sub-section */}
                <form onSubmit={handleUpdatePassword}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                    Security &amp; Password
                  </h3>

                  <div className="dashboard-form-grid">
                    <div className="dashboard-form-field">
                      <label htmlFor="pass-curr">Current Password</label>
                      <input
                        id="pass-curr"
                        type="password"
                        className="dashboard-form-input"
                        placeholder="••••••••"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div className="dashboard-form-field">
                      <label htmlFor="pass-new">New Password (min 6 characters)</label>
                      <input
                        id="pass-new"
                        type="password"
                        className="dashboard-form-input"
                        placeholder="••••••••"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div className="dashboard-form-field">
                      <label htmlFor="pass-confirm">Confirm New Password</label>
                      <input
                        id="pass-confirm"
                        type="password"
                        className="dashboard-form-input"
                        placeholder="••••••••"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="order-action-btn primary" style={{ padding: '12px 24px', borderRadius: '10px' }}>
                    <i className="fa-solid fa-lock"></i>
                    <span>Update Password</span>
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. MODAL: LIVE TRACKING TIMELINE                            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {trackingOrder && (
        <div
          className="auth-modal-backdrop open"
          onClick={() => setTrackingOrder(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="auth-modal-dialog"
            style={{ maxWidth: '540px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="auth-modal-close-btn"
              onClick={() => setTrackingOrder(null)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="auth-modal-header">
              <h2>Shipment Tracking</h2>
              <p>Order #{trackingOrder.id} • {trackingOrder.courier || 'BlueDart Express'}</p>
            </div>

            <div className="auth-modal-body">
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Courier Partner:</span>
                  <strong>{trackingOrder.courier || 'BlueDart Express'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>AWB Tracking ID:</span>
                  <strong style={{ color: '#b8005b' }}>{trackingOrder.awb || 'BLUEDART-88910245'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>Destination:</span>
                  <strong>{trackingOrder.shippingAddress?.slice(0, 32)}...</strong>
                </div>
              </div>

              <div className="dashboard-timeline" style={{ gridTemplateColumns: '1fr', gap: '18px' }}>
                <div className="dashboard-timeline-step completed" style={{ textAlign: 'left', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div className="dashboard-step-bullet"><i className="fa-solid fa-check"></i></div>
                  <div>
                    <div className="dashboard-step-title">Shipment Delivered</div>
                    <div className="dashboard-step-time">08 Oct 2026, 02:45 PM • Handed over to recipient</div>
                  </div>
                </div>

                <div className="dashboard-timeline-step completed" style={{ textAlign: 'left', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div className="dashboard-step-bullet"><i className="fa-solid fa-truck"></i></div>
                  <div>
                    <div className="dashboard-step-title">Out for Delivery</div>
                    <div className="dashboard-step-time">08 Oct 2026, 09:15 AM • Mangalore Hub Dispatch</div>
                  </div>
                </div>

                <div className="dashboard-timeline-step completed" style={{ textAlign: 'left', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div className="dashboard-step-bullet"><i className="fa-solid fa-boxes-packing"></i></div>
                  <div>
                    <div className="dashboard-step-title">Custom UV Printing &amp; Quality Check</div>
                    <div className="dashboard-step-time">05 Oct 2026, 03:00 PM • Studio Lab, Mangalore</div>
                  </div>
                </div>

                <div className="dashboard-timeline-step completed" style={{ textAlign: 'left', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div className="dashboard-step-bullet"><i className="fa-solid fa-file-invoice"></i></div>
                  <div>
                    <div className="dashboard-step-title">Order Confirmed &amp; Payment Verified</div>
                    <div className="dashboard-step-time">04 Oct 2026, 10:30 AM • Prepaid Order Placed</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="dashboard-save-btn"
                style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
                onClick={() => setTrackingOrder(null)}
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 4. MODAL: ADD / EDIT ADDRESS                                */}
      {/* ═══════════════════════════════════════════════════════ */}
      {isAddressModalOpen && (
        <div
          className="auth-modal-backdrop open"
          onClick={() => setIsAddressModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="auth-modal-dialog"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="auth-modal-close-btn"
              onClick={() => setIsAddressModalOpen(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="auth-modal-header">
              <h2>{addressFormData.id ? 'Edit Address' : 'Add New Shipping Address'}</h2>
              <p>Delivery address for your personalized gifts.</p>
            </div>

            <div className="auth-modal-body">
              <form onSubmit={handleSaveAddress}>
                <div className="dashboard-form-grid" style={{ marginBottom: '14px' }}>
                  <div className="dashboard-form-field">
                    <label>Address Label</label>
                    <select
                      className="dashboard-form-input"
                      value={addressFormData.tag}
                      onChange={(e) => setAddressFormData({ ...addressFormData, tag: e.target.value })}
                    >
                      <option value="Home">Home</option>
                      <option value="Office / Work">Office / Work</option>
                      <option value="Gift Recipient">Gift Recipient</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="dashboard-form-field">
                    <label>Recipient Name</label>
                    <input
                      type="text"
                      className="dashboard-form-input"
                      placeholder="e.g. Rahul Sharma"
                      value={addressFormData.name}
                      onChange={(e) => setAddressFormData({ ...addressFormData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="dashboard-form-field">
                    <label>Mobile Number</label>
                    <input
                      type="tel"
                      className="dashboard-form-input"
                      placeholder="e.g. +91 98765 43210"
                      value={addressFormData.phone}
                      onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="dashboard-form-field">
                    <label>Pincode</label>
                    <input
                      type="text"
                      className="dashboard-form-input"
                      placeholder="e.g. 575001"
                      value={addressFormData.pincode}
                      onChange={(e) => setAddressFormData({ ...addressFormData, pincode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="dashboard-form-field" style={{ marginBottom: '14px' }}>
                  <label>Flat, House no., Building, Company, Apartment</label>
                  <input
                    type="text"
                    className="dashboard-form-input"
                    placeholder="e.g. Flat 402, Green Valley Apartments"
                    value={addressFormData.addressLine1}
                    onChange={(e) => setAddressFormData({ ...addressFormData, addressLine1: e.target.value })}
                    required
                  />
                </div>

                <div className="dashboard-form-grid" style={{ marginBottom: '18px' }}>
                  <div className="dashboard-form-field">
                    <label>Landmark</label>
                    <input
                      type="text"
                      className="dashboard-form-input"
                      placeholder="e.g. Near Kadri Temple"
                      value={addressFormData.landmark}
                      onChange={(e) => setAddressFormData({ ...addressFormData, landmark: e.target.value })}
                    />
                  </div>

                  <div className="dashboard-form-field">
                    <label>City &amp; State</label>
                    <input
                      type="text"
                      className="dashboard-form-input"
                      value={`${addressFormData.city}, ${addressFormData.state}`}
                      disabled
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="dashboard-save-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Save Address
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
