import React, { useState, useEffect, useMemo } from 'react';
import './UserDashboard.css';

// Empty default orders and addresses (no demo data shown)
const DEFAULT_ORDERS = [];
const DEFAULT_ADDRESSES = [];

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

  // Saved addresses state with localStorage persistence (no default mock addresses)
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem('finegift_addresses');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Exclude legacy mock addresses (addr_1, addr_2, Rahul Sharma demo data)
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (a) => a && a.id !== 'addr_1' && a.id !== 'addr_2' && a.name !== 'Rahul Sharma'
          );
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Track Package Modal
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [copiedAwb, setCopiedAwb] = useState(false);

  const handleCopyAwb = (awbText) => {
    if (!awbText) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(awbText).then(() => {
        setCopiedAwb(true);
        setTimeout(() => setCopiedAwb(false), 2000);
      }).catch(() => {});
    }
  };

  // Dynamic tracking stage calculator based on live order status & timestamps
  const getTrackingStages = (ord) => {
    if (!ord) return { isDelivered: false, progress: 25, steps: [], statusClass: 'processing', statusLabel: 'Processing' };
    const rawStatus = (ord.status || 'Processing').toLowerCase().trim();
    const isDelivered = rawStatus === 'delivered';
    const isOutForDelivery = rawStatus === 'out for delivery' || rawStatus === 'out_for_delivery';
    const isShipped = isDelivered || isOutForDelivery || ['shipped', 'dispatched', 'in transit', 'in_transit'].includes(rawStatus);
    const isCrafting = isShipped || ['crafting', 'in production', 'in_production', 'printed & packed'].includes(rawStatus);

    let createdDate = new Date();
    if (ord.created_at) {
      const parsed = new Date(ord.created_at);
      if (!isNaN(parsed.getTime())) createdDate = parsed;
    } else if (ord.date) {
      const parsed = new Date(ord.date);
      if (!isNaN(parsed.getTime())) createdDate = parsed;
    }

    const fmt = (d) => {
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const time1 = fmt(createdDate);
    const time2 = fmt(new Date(createdDate.getTime() + 4 * 3600 * 1000));
    const time3 = fmt(new Date(createdDate.getTime() + 20 * 3600 * 1000));
    const time4 = fmt(new Date(createdDate.getTime() + 48 * 3600 * 1000));

    const steps = [
      {
        id: 'confirmed',
        title: 'Order Confirmed & Payment Verified',
        sub: `Prepaid order confirmed via ${ord.paymentMethod || ord.payment_method || 'Online UPI'}. Artisan queue assigned.`,
        icon: 'fa-solid fa-file-invoice-dollar',
        time: time1,
        completed: true,
        active: rawStatus === 'processing'
      },
      {
        id: 'crafting',
        title: 'Studio UV Printing & Quality Inspection',
        sub: isCrafting
          ? 'Personalized artwork UV printed, high-grade cured, and verified by studio artisan.'
          : 'Artwork queued for personalized UV printing and laser engraving.',
        icon: 'fa-solid fa-wand-magic-sparkles',
        time: isCrafting ? time2 : 'Estimated in 12–24 hrs',
        completed: isCrafting,
        active: ['crafting', 'in production', 'in_production'].includes(rawStatus)
      },
      {
        id: 'shipped',
        title: `Dispatched via ${ord.courier || 'BlueDart Express'}`,
        sub: isShipped
          ? (isDelivered ? 'Handed over from regional fulfillment hub.' : 'In express logistics transit to delivery hub.')
          : 'Express courier pickup scheduled upon studio packing completion.',
        icon: 'fa-solid fa-truck-fast',
        time: isShipped ? time3 : 'Scheduled post-crafting',
        completed: isShipped,
        active: ['shipped', 'dispatched', 'in transit', 'in_transit'].includes(rawStatus)
      },
      {
        id: 'delivered',
        title: isDelivered ? 'Delivered Successfully to Recipient' : 'Out for Final Doorstep Delivery',
        sub: isDelivered
          ? 'Package safely handed over to recipient. Thank you for celebrating with Fine Gift Studio!'
          : 'Express delivery partner will coordinate doorstep drop with recipient.',
        icon: isDelivered ? 'fa-solid fa-house-circle-check' : 'fa-solid fa-box-open',
        time: isDelivered ? time4 : (ord.estDelivery || 'Estimated 2–4 business days'),
        completed: isDelivered,
        active: isDelivered || isOutForDelivery
      }
    ];

    let progress = 25;
    let statusClass = 'processing';
    let statusLabel = 'Processing';

    if (isDelivered) {
      progress = 100;
      statusClass = 'delivered';
      statusLabel = 'Delivered';
    } else if (isOutForDelivery) {
      progress = 85;
      statusClass = 'transit';
      statusLabel = 'Out for Delivery';
    } else if (isShipped) {
      progress = 65;
      statusClass = 'transit';
      statusLabel = 'In Transit';
    } else if (isCrafting) {
      progress = 45;
      statusClass = 'crafting';
      statusLabel = 'Artisan Crafting';
    }

    return { isDelivered, progress, steps, statusClass, statusLabel };
  };

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

  // Load active store coupons from admin catalog
  const [storeCoupons, setStoreCoupons] = useState(() => {
    try {
      const stored = localStorage.getItem('finegift_admin_coupons');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { id: 'cp_1', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 499, title: 'Welcome Studio Gift Voucher', active: true },
      { id: 'cp_2', code: 'FLAT200', type: 'flat', value: 200, minOrder: 1299, title: 'Studio Flat Savings', active: true },
      { id: 'cp_3', code: 'STUDIOVIP', type: 'percentage', value: 20, minOrder: 1999, title: 'VIP Gold Connoisseur Perk', active: true },
      { id: 'cp_4', code: 'FREESHIP', type: 'flat', value: 99, minOrder: 399, title: 'Free Express Shipping Voucher', active: true }
    ];
  });

  // Listen to cross-tab updates or storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('finegift_admin_coupons');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setStoreCoupons(parsed);
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter exclusive promo codes assigned specifically to this logged-in customer
  const customerExclusiveCoupons = useMemo(() => {
    if (!user) return [];
    const userEmail = (user.email || '').toLowerCase().trim();
    const userId = user.id;
    return storeCoupons.filter((c) => {
      if (c.active === false) return false;
      const matchEmail = c.customerEmail && c.customerEmail.toLowerCase().trim() === userEmail;
      const matchId = c.customerId && c.customerId === userId;
      return matchEmail || matchId;
    });
  }, [storeCoupons, user]);

  // Filter public storewide promo codes available for all shoppers
  const publicCoupons = useMemo(() => {
    return storeCoupons.filter((c) => {
      if (c.active === false) return false;
      return !c.customerId && !c.customerEmail;
    });
  }, [storeCoupons]);

  // Only display genuine user orders placed in checkout (no mock or default demo orders)
  const displayOrders = Array.isArray(orders)
    ? orders.filter((o) => o && !String(o.id || '').includes('demo') && o.name !== 'Rahul Sharma')
    : [];

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
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>Home</a>
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
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>Home</a>
          <span>/</span>
          <span className="current">User Portal &amp; Dashboard</span>
        </div>

        {/* 1. Hero Header Banner */}
        <div className="dashboard-hero-banner">
          <div className="dashboard-user-card">
            <div className="dashboard-avatar" style={{ overflow: 'hidden' }}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div className="dashboard-user-info">
              <div className="dashboard-user-greeting-sup">
                <i className="fa-solid fa-crown" style={{ color: '#f9b228', marginRight: '6px' }}></i>
                <span>Fine Gift Studio • Atelier Privileged Member</span>
              </div>
              <h1>Hello, {user.name}!</h1>
              <div className="dashboard-badges-row">
                {user.provider === 'google' && (
                  <span className="dashboard-tier-badge google-badge">
                    <i className="fa-brands fa-google" style={{ color: '#ea4335' }}></i>
                    <span>Verified Account</span>
                  </span>
                )}
                <span className="dashboard-tier-badge gold-tier">
                  <i className="fa-solid fa-gem"></i>
                  <span>Artisan Gold VIP</span>
                </span>
                <span className="dashboard-user-meta-sub">
                  <i className="fa-regular fa-envelope" style={{ marginRight: '5px' }}></i>
                  {user.email}
                </span>
                {user.phone && (
                  <span className="dashboard-user-meta-sub">
                    <i className="fa-solid fa-phone" style={{ marginRight: '5px' }}></i>
                    {user.phone}
                  </span>
                )}
              </div>
              <div className="dashboard-perks-row">
                <span className="dashboard-perk-pill">
                  <i className="fa-solid fa-sparkles"></i> 250 Studio Reward Points
                </span>
                <span className="dashboard-perk-pill">
                  <i className="fa-solid fa-gift"></i> Complimentary Gift Wrapping
                </span>
                <span className="dashboard-perk-pill">
                  <i className="fa-solid fa-shield-halved"></i> 100% Quality Checked
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-hero-actions">
            <button
              type="button"
              className="dashboard-hero-btn explore-btn"
              onClick={() => onNavigate('/shop')}
            >
              <i className="fa-solid fa-compass"></i>
              <span>Explore Studio</span>
            </button>
            <button
              type="button"
              className="dashboard-hero-btn logout-btn"
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
            <div className="dashboard-sidebar-title">Client Concierge</div>

            <button
              type="button"
              className={`dashboard-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <div className="dashboard-nav-left">
                <i className="fa-solid fa-compass-drafting"></i>
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
                <i className="fa-solid fa-ticket"></i>
                <span>Wallet &amp; Vouchers</span>
              </div>
              <span className="dashboard-nav-badge gold">₹100</span>
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
              className="dashboard-nav-item logout-nav-item"
              onClick={onLogout}
            >
              <div className="dashboard-nav-left">
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Sign Out</span>
              </div>
            </button>

            {/* Bespoke VIP Concierge Assistance Card */}
            <div className="dashboard-concierge-card">
              <div className="concierge-icon">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div className="concierge-content">
                <div className="concierge-title">Bespoke Concierge</div>
                <p className="concierge-desc">Need assistance with customized engraving or urgent bulk gifting?</p>
                <a
                  href="https://wa.me/919876543210?text=Hello%20Fine%20Gift%20Studio,%20I%20need%20custom%20gift%20assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="concierge-chat-link"
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>
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
                    <div className="dashboard-stat-card-top">
                      <div className="dashboard-stat-icon orders">
                        <i className="fa-solid fa-boxes-stacked"></i>
                      </div>
                      <span className="dashboard-stat-pill">Handcrafted</span>
                    </div>
                    <div className="dashboard-stat-body">
                      <div className="dashboard-stat-value">{displayOrders.length}</div>
                      <div className="dashboard-stat-label">Total Orders Placed</div>
                    </div>
                  </div>

                  <div className="dashboard-stat-card" onClick={() => setActiveTab('orders')}>
                    <div className="dashboard-stat-card-top">
                      <div className="dashboard-stat-icon transit">
                        <i className="fa-solid fa-truck-fast"></i>
                      </div>
                      <span className="dashboard-stat-pill live">
                        <span className="pulse-dot"></span> Live Dispatch
                      </span>
                    </div>
                    <div className="dashboard-stat-body">
                      <div className="dashboard-stat-value">
                        {displayOrders.filter((o) => (o.status || '').toLowerCase() !== 'delivered').length}
                      </div>
                      <div className="dashboard-stat-label">Active Shipments</div>
                    </div>
                  </div>

                  <div className="dashboard-stat-card" onClick={() => setActiveTab('wishlist')}>
                    <div className="dashboard-stat-card-top">
                      <div className="dashboard-stat-icon wishlist">
                        <i className="fa-solid fa-heart"></i>
                      </div>
                      <span className="dashboard-stat-pill">Curated</span>
                    </div>
                    <div className="dashboard-stat-body">
                      <div className="dashboard-stat-value">{wishlist.length}</div>
                      <div className="dashboard-stat-label">Saved Wishlist Items</div>
                    </div>
                  </div>

                  <div className="dashboard-stat-card" onClick={() => setActiveTab('coupons')}>
                    <div className="dashboard-stat-card-top">
                      <div className="dashboard-stat-icon wallet">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                      <span className="dashboard-stat-pill gold">VIP Perks</span>
                    </div>
                    <div className="dashboard-stat-body">
                      <div className="dashboard-stat-value">₹100</div>
                      <div className="dashboard-stat-label">Studio Gift Credits</div>
                    </div>
                  </div>
                </div>

                {/* Ongoing Order Live Tracker Preview (Only shown when user has placed real orders) */}
                {displayOrders.length > 0 && (() => {
                  const latestOrd = displayOrders[0];
                  const { steps, statusClass, statusLabel } = getTrackingStages(latestOrd);
                  return (
                    <div className="dashboard-tracker-box">
                      <div className="dashboard-tracker-head">
                        <h4>
                          <i className="fa-solid fa-truck-ramp-box"></i>
                          <span>Latest Shipment: #{String(latestOrd.id).replace(/^FG-/, '')}</span>
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`status-badge ${statusClass}`}>
                            {statusLabel}
                          </span>
                          <button
                            type="button"
                            className="order-action-btn primary"
                            style={{ padding: '4px 12px', fontSize: '11.5px', height: 'auto' }}
                            onClick={() => setTrackingOrder(latestOrd)}
                          >
                            <i className="fa-solid fa-location-crosshairs"></i>
                            <span>Live Details</span>
                          </button>
                        </div>
                      </div>

                      <div className="dashboard-timeline">
                        {steps.map((st) => (
                          <div
                            key={st.id}
                            className={`dashboard-timeline-step ${st.completed ? 'completed' : ''} ${st.active ? 'active' : ''}`}
                          >
                            <div className="dashboard-step-bullet">
                              <i className={st.completed ? 'fa-solid fa-check' : st.icon}></i>
                            </div>
                            <div className="dashboard-step-title">{st.title.split('&')[0]}</div>
                            <div className="dashboard-step-time">{st.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Recent Orders Shortcut */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Recent Orders</h3>
                  {displayOrders.length > 0 && (
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#c40b90', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                      onClick={() => setActiveTab('orders')}
                    >
                      View All Orders &rarr;
                    </button>
                  )}
                </div>

                <div className="dashboard-orders-list">
                  {displayOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                      <i className="fa-solid fa-gift" style={{ fontSize: '36px', color: '#cbd5e1', marginBottom: '12px', display: 'block' }}></i>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#1e293b', fontWeight: 700 }}>No Orders Placed Yet</h4>
                      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>Browse our custom gifts and personalized collections to place your first order.</p>
                      <button
                        type="button"
                        style={{
                          background: 'linear-gradient(135deg, #c40b90, #9333ea)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '9px 20px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                        onClick={() => onNavigate('/#shop')}
                      >
                        Explore Gifts
                      </button>
                    </div>
                  ) : (
                    displayOrders.slice(0, 2).map((ord) => (
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
                    ))
                  )}
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

                {displayOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '54px 20px', background: '#f8fafc', borderRadius: '18px', border: '1.5px dashed #cbd5e1' }}>
                    <i className="fa-solid fa-gift" style={{ fontSize: '42px', color: '#cbd5e1', marginBottom: '14px', display: 'block' }}></i>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 800 }}>No Orders Placed Yet</h4>
                    <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b', maxWidth: '380px', marginLeft: 'auto', marginRight: 'auto' }}>
                      You haven't placed any orders yet. Discover custom mugs, frames, apparel, and bespoke gift hampers to place your first order.
                    </p>
                    <button
                      type="button"
                      className="dashboard-save-btn"
                      onClick={() => onNavigate('/shop')}
                    >
                      <i className="fa-solid fa-bag-shopping"></i>
                      <span>Explore Gifts &amp; Creations</span>
                    </button>
                  </div>
                ) : filteredOrders.length === 0 ? (
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
                            <i className="fa-solid fa-location-dot" style={{ marginRight: '6px', color: '#c40b90' }}></i>
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

                {savedAddresses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', borderRadius: '18px', border: '1.5px dashed #cbd5e1' }}>
                    <i className="fa-solid fa-location-dot" style={{ fontSize: '38px', color: '#cbd5e1', marginBottom: '14px', display: 'block' }}></i>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 800 }}>No Saved Addresses Yet</h4>
                    <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b', maxWidth: '380px', marginLeft: 'auto', marginRight: 'auto' }}>
                      You haven't saved any delivery addresses yet. Add your address to speed up future checkouts.
                    </p>
                    <button
                      type="button"
                      className="dashboard-save-btn"
                      onClick={handleOpenNewAddress}
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Add New Address</span>
                    </button>
                  </div>
                ) : (
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
                )}
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
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c40b90', marginBottom: '12px' }}>
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
                    <p>Active discount vouchers and personalized reward perks reserved for your checkout.</p>
                  </div>
                </div>

                {/* Studio Wallet Credits Card */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #fdf2f8 0%, #fff7ed 100%)',
                    border: '1px solid #fbcfe8',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '28px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#9d174d', letterSpacing: '0.5px' }}>
                      <i className="fa-solid fa-wallet" style={{ marginRight: '6px' }}></i> Active Gift Credits
                    </span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#c40b90', margin: '4px 0 0 0' }}>
                      ₹{((user?.walletBalance ?? 100)).toLocaleString()}.00
                    </h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                      Auto-applicable on checkout on orders above ₹499.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="dashboard-save-btn"
                    onClick={() => onNavigate('/shop')}
                  >
                    Redeem Credits in Shop
                  </button>
                </div>

                {/* SECTION 1: Exclusive Customer-Specific Vouchers */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-crown" style={{ color: '#d97706' }}></i>
                        <span>Exclusive to Your Account</span>
                      </h3>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                        Personalized vouchers issued specifically for <strong>{user?.name || user?.email}</strong>.
                      </p>
                    </div>
                    {customerExclusiveCoupons.length > 0 && (
                      <span className="admin-badge" style={{ background: '#fdf2f8', color: '#c40b90', border: '1px solid #fbcfe8', fontWeight: 700, padding: '4px 10px' }}>
                        {customerExclusiveCoupons.length} Exclusive Voucher{customerExclusiveCoupons.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {customerExclusiveCoupons.length === 0 ? (
                    <div
                      style={{
                        padding: '24px 20px',
                        background: '#ffffff',
                        border: '1px dashed #e2e8f0',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: '#fdf2f8',
                          color: '#c40b90',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          flexShrink: 0
                        }}
                      >
                        <i className="fa-solid fa-gift"></i>
                      </div>
                      <div>
                        <strong style={{ fontSize: '13.5px', color: '#334155', display: 'block' }}>
                          No Exclusive Codes Assigned Yet
                        </strong>
                        <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                          Personalized VIP discounts and anniversary perks created for your account will appear here. In the meantime, enjoy our storewide promo codes below!
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="coupons-grid">
                      {customerExclusiveCoupons.map((cp) => (
                        <div
                          key={cp.id}
                          className="coupon-ticket-card"
                          style={{
                            background: 'linear-gradient(135deg, #fffbf2 0%, #ffffff 100%)',
                            border: '1.5px solid #fbcfe8',
                            boxShadow: '0 4px 14px rgba(196, 11, 144, 0.08)'
                          }}
                        >
                          <div className="coupon-ticket-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  color: '#c40b90',
                                  background: '#fdf2f8',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  border: '1px solid #fbcfe8',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <i className="fa-solid fa-sparkles"></i> Exclusive to You
                              </span>
                            </div>
                            <h4 style={{ color: '#0f172a', fontWeight: 800, margin: '2px 0 4px 0' }}>
                              {cp.type === 'percentage' ? `${cp.value}% Off Discount` : `Flat ₹${cp.value} Off`}
                            </h4>
                            <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                              {cp.title || 'Personalized VIP Voucher'}
                              {cp.minOrder > 0 && ` · Min. order ₹${cp.minOrder}`}
                            </p>
                            <span
                              className="coupon-code-chip"
                              style={{
                                color: '#c40b90',
                                background: 'rgba(196, 11, 144, 0.08)',
                                border: '1px solid #fbcfe8',
                                fontWeight: 800,
                                marginTop: '10px'
                              }}
                            >
                              {cp.code}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="copy-coupon-btn"
                            style={{ background: '#c40b90', color: '#ffffff', borderColor: '#c40b90' }}
                            onClick={() => handleCopyCoupon(cp.code)}
                          >
                            <i className="fa-regular fa-copy"></i> Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SECTION 2: Public Storewide Coupon Codes */}
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-tags" style={{ color: '#c40b90' }}></i>
                    <span>Public Studio Promo Codes</span>
                  </h3>
                  <p style={{ margin: '0 0 16px 0', fontSize: '12.5px', color: '#64748b' }}>
                    Seasonal festival codes and free shipping triggers available to all shoppers.
                  </p>

                  <div className="coupons-grid">
                    {publicCoupons.map((cp) => (
                      <div key={cp.id} className="coupon-ticket-card">
                        <div className="coupon-ticket-info">
                          <h4>
                            {cp.type === 'percentage' ? `${cp.value}% Off Discount` : `Flat ₹${cp.value} Off`}
                          </h4>
                          <p>
                            {cp.title || 'Storewide promotional voucher'}
                            {cp.minOrder > 0 && ` · Min. order ₹${cp.minOrder}`}
                          </p>
                          <span className="coupon-code-chip">{cp.code}</span>
                        </div>
                        <button
                          type="button"
                          className="copy-coupon-btn"
                          onClick={() => handleCopyCoupon(cp.code)}
                        >
                          <i className="fa-regular fa-copy"></i> Copy
                        </button>
                      </div>
                    ))}
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
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 3. MODAL: LIVE TRACKING TIMELINE (PIXEL-PERFECT IMAGE 1)     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {trackingOrder && (() => {
        const { isDelivered, steps } = getTrackingStages(trackingOrder);
        const orderIdDisplay = String(trackingOrder.id || '').replace(/^FG-/, '');
        const courierName = trackingOrder.courier || 'BlueDart Express';
        const destination = trackingOrder.shippingAddress || 'Near City Centre, K.S. Rao Road, Mangalore';

        return (
          <div
            className="auth-modal-backdrop open"
            onClick={() => setTrackingOrder(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="auth-modal-dialog tracking-modal-v1-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="tracking-v1-header">
                <div className="tracking-v1-header-left">
                  <div className="tracking-v1-header-icon">
                    <i className="fa-solid fa-cube"></i>
                  </div>
                  <div>
                    <h2 className="tracking-v1-header-title">Shipment Tracking</h2>
                    <p className="tracking-v1-header-subtitle">
                      Order #{orderIdDisplay} • {courierName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tracking-v1-close-btn"
                  onClick={() => setTrackingOrder(null)}
                  aria-label="Close tracking"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* 3-Column Top Meta Information Bar */}
              <div className="tracking-v1-meta-bar">
                {/* 1. Courier Partner */}
                <div className="tracking-v1-meta-item">
                  <div className="tracking-v1-meta-icon">
                    <i className="fa-solid fa-truck"></i>
                  </div>
                  <div className="tracking-v1-meta-text">
                    <div className="tracking-v1-meta-label">Courier Partner</div>
                    <div className="tracking-v1-meta-val">{courierName}</div>
                  </div>
                </div>

                {/* 2. AWB Tracking ID / Delivery Status */}
                <div className="tracking-v1-meta-item">
                  {isDelivered ? (
                    <>
                      <div className="tracking-v1-meta-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                      <div className="tracking-v1-meta-text">
                        <div className="tracking-v1-meta-label" style={{ color: '#059669' }}>Fulfillment Status</div>
                        <div className="tracking-v1-meta-val green">Delivered Successfully</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="tracking-v1-meta-icon">
                        <i className="fa-solid fa-qrcode"></i>
                      </div>
                      <div className="tracking-v1-meta-text">
                        <div className="tracking-v1-meta-label">AWB Tracking ID</div>
                        <div className="tracking-v1-meta-val magenta">
                          {trackingOrder.awb || 'BLUEDART-88910245'}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 3. Destination */}
                <div className="tracking-v1-meta-item">
                  <div className="tracking-v1-meta-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="tracking-v1-meta-text">
                    <div className="tracking-v1-meta-label">Destination</div>
                    <div className="tracking-v1-meta-val" title={destination}>
                      {destination}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-Column Body: 3D Illustration (Left) + Vertical Timeline (Right) */}
              <div className="tracking-v1-body-grid">
                {/* Left: 3D Delivery Box Illustration */}
                <div className="tracking-v1-visual-col">
                  <img
                    src="/assets/images/tracking-3d-parcel.png"
                    alt="BlueDart Express Parcel on Pedestal"
                    className="tracking-v1-3d-img"
                  />
                </div>

                {/* Right: Vertical Timeline Stepper */}
                <div className="tracking-v1-timeline">
                  {/* Step 1: Shipment Delivered (shown as delivered card if delivered) */}
                  <div className={`tracking-v1-step ${isDelivered ? 'completed delivered-card' : 'pending'}`}>
                    <div className="tracking-v1-bullet">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <div className="tracking-v1-card">
                      <div className="tracking-v1-card-title">Shipment Delivered</div>
                      <div className="tracking-v1-card-time">
                        {steps[3]?.time || '08 Oct 2026, 02:45 PM'} • Handed over to recipient
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Out for Delivery */}
                  <div className={`tracking-v1-step ${steps[2]?.completed ? 'completed' : 'pending'}`}>
                    <div className="tracking-v1-bullet">
                      <i className="fa-solid fa-truck"></i>
                    </div>
                    <div className="tracking-v1-card">
                      <div className="tracking-v1-card-title">Out for Delivery</div>
                      <div className="tracking-v1-card-time">
                        {steps[2]?.time || '08 Oct 2026, 09:15 AM'} • Mangalore Hub Dispatch
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Custom UV Printing & Quality Check */}
                  <div className={`tracking-v1-step ${steps[1]?.completed ? 'completed' : 'pending'}`}>
                    <div className="tracking-v1-bullet">
                      <i className="fa-solid fa-boxes-packing"></i>
                    </div>
                    <div className="tracking-v1-card">
                      <div className="tracking-v1-card-title">Custom UV Printing &amp; Quality Check</div>
                      <div className="tracking-v1-card-time">
                        {steps[1]?.time || '05 Oct 2026, 03:00 PM'} • Studio Lab, Mangalore
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Order Confirmed & Payment Verified */}
                  <div className="tracking-v1-step completed">
                    <div className="tracking-v1-bullet">
                      <i className="fa-solid fa-file-invoice"></i>
                    </div>
                    <div className="tracking-v1-card">
                      <div className="tracking-v1-card-title">Order Confirmed &amp; Payment Verified</div>
                      <div className="tracking-v1-card-time">
                        {steps[0]?.time || '04 Oct 2026, 10:30 AM'} • Prepaid Order Placed
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Full-Width Pill Action Button */}
              <button
                type="button"
                className="tracking-v1-close-action-btn"
                onClick={() => setTrackingOrder(null)}
              >
                <span>Close Tracking</span>
                <span className="tracking-v1-arrow-circle">
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </button>
            </div>
          </div>
        );
      })()}

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
