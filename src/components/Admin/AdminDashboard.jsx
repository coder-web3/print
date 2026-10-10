import React, { useState, useEffect, useMemo } from 'react';
import './AdminDashboard.css';
import { categoriesData, productsData } from '../../data/mockData';

// Default mock coupons for the store
const DEFAULT_COUPONS = [
  { id: 'cp_1', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 499, uses: 142, active: true },
  { id: 'cp_2', code: 'FLAT200', type: 'flat', value: 200, minOrder: 1299, uses: 89, active: true },
  { id: 'cp_3', code: 'STUDIOVIP', type: 'percentage', value: 20, minOrder: 1999, uses: 34, active: true },
  { id: 'cp_4', code: 'FREESHIP', type: 'flat', value: 99, minOrder: 399, uses: 210, active: false }
];

// Initial audit log
const INITIAL_AUDIT_LOGS = [
  { id: 'log_1', action: 'Catalog Updated', detail: 'Adjusted price for Premium Real Black Leather Wallet', user: 'Admin (System)', time: '10 mins ago' },
  { id: 'log_2', action: 'Order Dispatched', detail: 'Order #FG-ORD-882194 assigned to BlueDart Express', user: 'Admin (Priya)', time: '1 hour ago' },
  { id: 'log_3', action: 'Coupon Created', detail: 'Published code STUDIOVIP (20% OFF)', user: 'Admin (Rahul)', time: 'Yesterday' }
];

export default function AdminDashboard({
  user = null,
  orders = [],
  products = productsData,
  categories = categoriesData,
  onUpdateProducts = () => {},
  onUpdateOrders = () => {},
  onNavigate = () => {},
  showNotification = () => {}
}) {
  // ── 1. AUTH & ROLE CHECK ──────────────────────────────────────────────
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return user?.role === 'admin' || localStorage.getItem('finegift_admin_auth') === 'true';
  });

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setIsAdminAuthenticated(true);
    localStorage.setItem('finegift_admin_auth', 'true');
    showNotification('success', 'Admin Access Granted', 'Welcome to Fine Gift Studio CMS.');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('finegift_admin_auth');
    showNotification('info', 'Logged Out', 'Signed out of Admin Dashboard.');
    onNavigate('/');
  };

  // ── 2. ACTIVE NAVIGATION TAB ──────────────────────────────────────────
  // 'overview' | 'orders' | 'products' | 'categories' | 'coupons' | 'customers' | 'audit'
  const [activeTab, setActiveTab] = useState('overview');

  // ── 3. STATE FOR PRODUCTS (CRUD) ──────────────────────────────────────
  const [localProducts, setLocalProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_admin_products');
      return saved ? JSON.parse(saved) : (products.length > 0 ? products : productsData);
    } catch {
      return productsData;
    }
  });

  // ── 4. STATE FOR ORDERS ───────────────────────────────────────────────
  const [localOrders, setLocalOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_orders');
      return saved ? JSON.parse(saved) : orders;
    } catch {
      return orders;
    }
  });

  // ── 5. STATE FOR COUPONS & AUDIT ──────────────────────────────────────
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_admin_coupons');
      return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
    } catch {
      return DEFAULT_COUPONS;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_admin_audit');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Record audit log helper
  const addAuditLog = (action, detail) => {
    const newLog = {
      id: 'log_' + Date.now(),
      action,
      detail,
      user: user?.name ? `Admin (${user.name})` : 'Store Admin',
      time: 'Just now'
    };
    const updated = [newLog, ...auditLogs.slice(0, 49)];
    setAuditLogs(updated);
    try {
      localStorage.setItem('finegift_admin_audit', JSON.stringify(updated));
    } catch {}
  };

  // ── 6. FILTER & SEARCH STATES ─────────────────────────────────────────
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // ── 7. MODALS STATE ───────────────────────────────────────────────────
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    cat_name: 'Cups & Mugs',
    price: 499,
    old_price: 799,
    stock: 25,
    material: 'Ceramic',
    image_url: '/assets/images/cups-product.avif',
    description: '',
    is_customizable: true
  });

  // Order Details / Customization Inspection Modal
  const [inspectedOrder, setInspectedOrder] = useState(null);
  const [dispatchAwb, setDispatchAwb] = useState('');

  // Coupon Creation Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    type: 'percentage',
    value: 15,
    minOrder: 499
  });

  // ── 8. COMPUTED OVERVIEW METRICS ──────────────────────────────────────
  const metrics = useMemo(() => {
    const totalOrdersCount = localOrders.length || 24;
    const totalRevenue = localOrders.reduce((sum, o) => sum + (o.total || 799), 0);
    const pendingCustomizations = localOrders.filter(
      (o) => o.status === 'Processing' || o.status === 'Laser Engraving'
    ).length;
    const totalProductsCount = localProducts.length;

    return {
      revenue: totalRevenue > 0 ? totalRevenue : 48920,
      orders: totalOrdersCount,
      pendingCustom: pendingCustomizations,
      productsCount: totalProductsCount,
      avgOrderValue: Math.round((totalRevenue > 0 ? totalRevenue : 48920) / totalOrdersCount)
    };
  }, [localOrders, localProducts]);

  // ── 9. PRODUCT CRUD ACTIONS ───────────────────────────────────────────
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      cat_name: categories[0]?.name || 'Cups & Mugs',
      price: 499,
      old_price: 799,
      stock: 30,
      material: 'Ceramic',
      image_url: '/assets/images/cups-product.avif',
      description: 'Handcrafted personalized studio gift made to order with laser engraving.',
      is_customizable: true
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name || '',
      cat_name: prod.cat_name || 'Cups & Mugs',
      price: prod.price || 0,
      old_price: prod.old_price || 0,
      stock: prod.stock || 25,
      material: prod.material || 'Ceramic',
      image_url: prod.image_url || '/assets/images/cups-product.avif',
      description: prod.description || '',
      is_customizable: prod.is_customizable !== false
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productFormData.name.trim()) {
      showNotification('error', 'Validation Error', 'Product title cannot be empty.');
      return;
    }

    let updatedList;
    if (editingProduct) {
      updatedList = localProducts.map((p) =>
        p.id === editingProduct.id
          ? { ...p, ...productFormData, price: Number(productFormData.price), old_price: Number(productFormData.old_price) }
          : p
      );
      addAuditLog('Product Updated', `Edited "${productFormData.name}" (₹${productFormData.price})`);
      showNotification('success', 'Product Updated', `Saved changes to "${productFormData.name}".`);
    } else {
      const newProd = {
        id: Date.now(),
        ...productFormData,
        price: Number(productFormData.price),
        old_price: Number(productFormData.old_price),
        rating: 5.0,
        reviews_count: 0,
        is_new: true,
        is_bestseller: false,
        in_stock: true,
        fast_delivery: true
      };
      updatedList = [newProd, ...localProducts];
      addAuditLog('Product Created', `Added new product "${productFormData.name}"`);
      showNotification('success', 'Product Created', `"${productFormData.name}" added to catalog.`);
    }

    setLocalProducts(updatedList);
    try {
      localStorage.setItem('finegift_admin_products', JSON.stringify(updatedList));
    } catch {}
    if (onUpdateProducts) onUpdateProducts(updatedList);
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from the public store?`)) {
      const filtered = localProducts.filter((p) => p.id !== productId);
      setLocalProducts(filtered);
      try {
        localStorage.setItem('finegift_admin_products', JSON.stringify(filtered));
      } catch {}
      if (onUpdateProducts) onUpdateProducts(filtered);
      addAuditLog('Product Removed', `Removed "${productName}" from catalog.`);
      showNotification('info', 'Product Removed', `"${productName}" has been removed.`);
    }
  };

  // ── 10. ORDER STATUS ADVANCEMENT ──────────────────────────────────────
  const handleUpdateOrderStatus = (orderId, newStatus, awbCode = '') => {
    const updated = localOrders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: newStatus,
          awb: awbCode || ord.awb || `AWB-${Math.floor(100000 + Math.random() * 900000)}`,
          courier: ord.courier || 'BlueDart Express'
        };
      }
      return ord;
    });

    setLocalOrders(updated);
    try {
      localStorage.setItem('finegift_orders', JSON.stringify(updated));
    } catch {}
    if (onUpdateOrders) onUpdateOrders(updated);
    addAuditLog('Order Status Updated', `Order #${orderId} moved to "${newStatus}"`);
    showNotification('success', 'Status Updated', `Order #${orderId} marked as ${newStatus}.`);
    if (inspectedOrder && inspectedOrder.id === orderId) {
      setInspectedOrder({ ...inspectedOrder, status: newStatus });
    }
  };

  // ── 11. COUPON CRUD ACTIONS ───────────────────────────────────────────
  const handleToggleCoupon = (couponId) => {
    const updated = coupons.map((c) =>
      c.id === couponId ? { ...c, active: !c.active } : c
    );
    setCoupons(updated);
    try {
      localStorage.setItem('finegift_admin_coupons', JSON.stringify(updated));
    } catch {}
    showNotification('info', 'Coupon Updated', 'Discount status updated.');
  };

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    if (!couponFormData.code.trim()) return;
    const newCoupon = {
      id: 'cp_' + Date.now(),
      code: couponFormData.code.trim().toUpperCase(),
      type: couponFormData.type,
      value: Number(couponFormData.value),
      minOrder: Number(couponFormData.minOrder),
      uses: 0,
      active: true
    };
    const updated = [newCoupon, ...coupons];
    setCoupons(updated);
    try {
      localStorage.setItem('finegift_admin_coupons', JSON.stringify(updated));
    } catch {}
    addAuditLog('Coupon Created', `Added promo code ${newCoupon.code}`);
    showNotification('success', 'Coupon Created', `Code "${newCoupon.code}" is now active.`);
    setIsCouponModalOpen(false);
  };

  // ── 12. FILTERED LISTS ────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return localOrders.filter((ord) => {
      if (orderStatusFilter !== 'all' && ord.status.toLowerCase() !== orderStatusFilter.toLowerCase()) {
        return false;
      }
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchId = (ord.id || '').toLowerCase().includes(q);
        const matchAddr = (ord.shippingAddress || '').toLowerCase().includes(q);
        return matchId || matchAddr;
      }
      return true;
    });
  }, [localOrders, orderStatusFilter, orderSearch]);

  const filteredProducts = useMemo(() => {
    return localProducts.filter((prod) => {
      if (productCategoryFilter !== 'all') {
        const catMatch = (prod.cat_name || '').toLowerCase() === productCategoryFilter.toLowerCase();
        if (!catMatch) return false;
      }
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return (prod.name || '').toLowerCase().includes(q) || (prod.cat_name || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [localProducts, productCategoryFilter, productSearch]);

  // ── 13. ADMIN LOGIN LOCK SCREEN IF NOT AUTHENTICATED ──────────────────
  if (!isAdminAuthenticated) {
    return (
      <div className="admin-dashboard-wrapper" style={{ justifyContent: 'center', alignItems: 'center', padding: '40px 16px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '440px', width: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '36px', boxShadow: '0 20px 45px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #b8005b, #db2777)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '28px', color: '#ffffff', boxShadow: '0 8px 24px rgba(184,0,91,0.25)' }}>
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 6px 0', color: '#0f172a' }}>Fine Gift Studio CMS</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>
            Store Management Portal &amp; Customization Production Queue
          </p>

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Admin Email</label>
              <input
                type="email"
                defaultValue="admin@finegiftstudio.com"
                required
                className="admin-form-input"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Master Password</label>
              <input
                type="password"
                defaultValue="••••••••••••"
                required
                className="admin-form-input"
                style={{ width: '100%' }}
              />
            </div>

            <button type="submit" className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px', height: '44px' }}>
              <i className="fa-solid fa-lock-open"></i> Unlock Admin Command Center
            </button>
          </form>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12.5px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              ← Return to Public Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* ── TOP BAR ────────────────────────────────────────────── */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <a href="#admin" className="admin-brand-badge" onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}>
            <div className="admin-brand-icon">
              <i className="fa-solid fa-gift"></i>
            </div>
            <div>
              <div className="admin-brand-title">FINE GIFT STUDIO</div>
              <div className="admin-brand-subtitle">ADMIN CMS &amp; PRODUCTION CONTROL</div>
            </div>
          </a>
          <span className="admin-env-pill">Live Storefront Active</span>
        </div>

        <div className="admin-topbar-right">
          <button
            type="button"
            className="admin-view-store-btn"
            onClick={() => onNavigate('/')}
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            <span>View Public Store</span>
          </button>

          <div className="admin-admin-profile">
            <div className="admin-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-profile-info">
              <span className="admin-profile-name">{user?.name || 'Store Director'}</span>
              <span className="admin-profile-role">Super Admin</span>
            </div>
            <button
              type="button"
              className="admin-icon-btn danger"
              style={{ marginLeft: '8px' }}
              onClick={handleAdminLogout}
              title="Sign Out of CMS"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT: SIDEBAR + WORKSPACE ───────────────────── */}
      <div className="admin-main-container">
        {/* ── SIDEBAR NAVIGATION ───────────────────────────────── */}
        <aside className="admin-sidebar">
          <div>
            <div className="admin-nav-section-title">Operations &amp; Control</div>
            <ul className="admin-nav-list">
              <li>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-chart-pie"></i>
                    <span>Dashboard Overview</span>
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-box-archive"></i>
                    <span>Orders &amp; Engraving</span>
                  </span>
                  {metrics.pendingCustom > 0 && (
                    <span className="admin-nav-badge">{metrics.pendingCustom}</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('products')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-cubes"></i>
                    <span>Product Catalog</span>
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{localProducts.length}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === 'categories' ? 'active' : ''}`}
                  onClick={() => setActiveTab('categories')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-layer-group"></i>
                    <span>Categories &amp; Tags</span>
                  </span>
                </button>
              </li>
            </ul>

            <div className="admin-nav-section-title">Marketing &amp; Records</div>
            <ul className="admin-nav-list">
              <li>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === 'coupons' ? 'active' : ''}`}
                  onClick={() => setActiveTab('coupons')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-tags"></i>
                    <span>Coupons &amp; Discounts</span>
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === 'customers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('customers')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-users"></i>
                    <span>Customer Accounts</span>
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === 'audit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('audit')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <span>CMS Audit Log</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>

          <div className="admin-sidebar-footer">
            <button
              type="button"
              className="admin-quick-switch-btn"
              onClick={() => onNavigate('/shop')}
            >
              <i className="fa-solid fa-bag-shopping"></i> Test Live Shop Catalog
            </button>
          </div>
        </aside>

        {/* ── WORKSPACE CONTENT ────────────────────────────────── */}
        <main className="admin-workspace">

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 1: OVERVIEW DASHBOARD                             */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div>
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-chart-pie" style={{ color: '#b8005b' }}></i> Executive Overview
                  </h1>
                  <p className="admin-page-subtitle">Real-time store metrics, customization queue, and inventory alerts.</p>
                </div>
                <div className="admin-page-actions">
                  <button type="button" className="admin-btn-secondary" onClick={() => addAuditLog('Report Exported', 'Downloaded sales summary spreadsheet')}>
                    <i className="fa-solid fa-file-arrow-down"></i> Export Report
                  </button>
                  <button type="button" className="admin-btn-primary" onClick={handleOpenAddProduct}>
                    <i className="fa-solid fa-plus"></i> New Product
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-left">
                    <h4>Total Gross Sales</h4>
                    <div className="admin-stat-value">₹{metrics.revenue.toLocaleString()}</div>
                    <div className="admin-stat-delta positive">
                      <i className="fa-solid fa-arrow-trend-up"></i> +18.4% vs last week
                    </div>
                  </div>
                  <div className="admin-stat-icon gold">
                    <i className="fa-solid fa-indian-rupee-sign"></i>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-left">
                    <h4>Total Orders Placed</h4>
                    <div className="admin-stat-value">{metrics.orders}</div>
                    <div className="admin-stat-delta positive">
                      <i className="fa-solid fa-check"></i> 100% fulfill rate
                    </div>
                  </div>
                  <div className="admin-stat-icon blue">
                    <i className="fa-solid fa-bag-shopping"></i>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-left">
                    <h4>Pending Laser Engraving</h4>
                    <div className="admin-stat-value">{metrics.pendingCustom}</div>
                    <div className="admin-stat-delta neutral">
                      <i className="fa-solid fa-wand-magic-sparkles"></i> Customization queue
                    </div>
                  </div>
                  <div className="admin-stat-icon pink">
                    <i className="fa-solid fa-gem"></i>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-left">
                    <h4>Avg. Order Value</h4>
                    <div className="admin-stat-value">₹{metrics.avgOrderValue.toLocaleString()}</div>
                    <div className="admin-stat-delta positive">
                      <i className="fa-solid fa-arrow-up"></i> High basket value
                    </div>
                  </div>
                  <div className="admin-stat-icon green">
                    <i className="fa-solid fa-cart-shopping"></i>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview Panel */}
              <div className="admin-panel-card">
                <div className="admin-panel-header">
                  <h3 className="admin-panel-title">
                    <i className="fa-solid fa-bolt" style={{ color: '#d4af37' }}></i> Immediate Order Actions &amp; Work Queue
                  </h3>
                  <button type="button" className="admin-btn-secondary" onClick={() => setActiveTab('orders')}>
                    View All Orders ({localOrders.length}) →
                  </button>
                </div>
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer / Destination</th>
                        <th>Amount</th>
                        <th>Fulfillment Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localOrders.slice(0, 5).map((ord) => (
                        <tr key={ord.id}>
                          <td><strong>#{ord.id}</strong></td>
                          <td>{ord.date}</td>
                          <td style={{ maxWidth: '240px' }}>
                            <div style={{ fontSize: '12.5px', color: '#0f172a', fontWeight: 700 }}>
                              {ord.items?.[0]?.name || 'Custom Gift Package'}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {ord.shippingAddress}
                            </div>
                          </td>
                          <td><strong>₹{(ord.total || 698).toLocaleString()}</strong></td>
                          <td>
                            <span className={`admin-badge ${ord.status === 'Delivered' ? 'delivered' : ord.status === 'Dispatched' ? 'dispatched' : 'engraving'}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="admin-btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '11.5px' }}
                              onClick={() => {
                                setInspectedOrder(ord);
                                setDispatchAwb(ord.awb || '');
                              }}
                            >
                              Inspect Work Slip
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 2: ORDERS & ENGRAVING QUEUE                       */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'orders' && (
            <div>
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-box-archive" style={{ color: '#b8005b' }}></i> Orders &amp; Customization Production
                  </h1>
                  <p className="admin-page-subtitle">Track incoming orders, inspect customized engravings, and dispatch shipments.</p>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-panel-header">
                  <div className="admin-panel-toolbar">
                    <input
                      type="text"
                      className="admin-search-input"
                      placeholder="Search Order ID, Address..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                    />
                    <select
                      className="admin-filter-select"
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="processing">Processing</option>
                      <option value="laser engraving">Laser Engraving</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                    Showing <strong>{filteredOrders.length}</strong> orders
                  </span>
                </div>

                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Items &amp; Customization</th>
                        <th>Total</th>
                        <th>Courier / AWB</th>
                        <th>Status</th>
                        <th>Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td><strong>#{ord.id}</strong></td>
                          <td>{ord.date}</td>
                          <td>
                            {ord.items?.map((it, idx) => (
                              <div key={idx} style={{ fontSize: '12.5px', marginBottom: '2px' }}>
                                • {it.name} (x{it.quantity || 1})
                                {it.customNote && (
                                  <span style={{ color: '#d4af37', display: 'block', fontSize: '11px', fontWeight: 700 }}>
                                    ✨ Engrave: "{it.customNote}"
                                  </span>
                                )}
                              </div>
                            ))}
                          </td>
                          <td><strong>₹{(ord.total || 0).toLocaleString()}</strong></td>
                          <td>
                            <div style={{ fontSize: '12px' }}>{ord.courier || 'Express Surface'}</div>
                            <small style={{ color: '#64748b' }}>{ord.awb || 'Pending AWB'}</small>
                          </td>
                          <td>
                            <select
                              className="admin-filter-select"
                              style={{ padding: '4px 8px', fontSize: '11.5px' }}
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            >
                              <option value="Processing">Processing</option>
                              <option value="Laser Engraving">Laser Engraving</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="admin-icon-btn"
                              onClick={() => {
                                setInspectedOrder(ord);
                                setDispatchAwb(ord.awb || '');
                              }}
                              title="Inspect Order Slip"
                            >
                              <i className="fa-regular fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 3: PRODUCT CATALOG (CRUD)                         */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'products' && (
            <div>
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-cubes" style={{ color: '#b8005b' }}></i> Product Catalog &amp; Inventory
                  </h1>
                  <p className="admin-page-subtitle">Add new bespoke gifts, adjust prices, edit descriptions, and control inventory.</p>
                </div>
                <div className="admin-page-actions">
                  <button type="button" className="admin-btn-primary" onClick={handleOpenAddProduct}>
                    <i className="fa-solid fa-plus"></i> Add New Product
                  </button>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-panel-header">
                  <div className="admin-panel-toolbar">
                    <input
                      type="text"
                      className="admin-search-input"
                      placeholder="Search title, category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                    <select
                      className="admin-filter-select"
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                    Showing <strong>{filteredProducts.length}</strong> items
                  </span>
                </div>

                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price (₹)</th>
                        <th>Material</th>
                        <th>Custom Engraving</th>
                        <th>Stock Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="admin-prod-cell">
                              <img
                                src={p.image_url || '/assets/images/cups-product.avif'}
                                alt={p.name}
                                className="admin-prod-thumb"
                                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=100&q=80"; }}
                              />
                              <div className="admin-prod-info">
                                <h5>{p.name}</h5>
                                <span>ID: #{p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td>{p.cat_name || 'Gift Studio'}</td>
                          <td>
                            <strong>₹{p.price}</strong>
                            {p.old_price && <small style={{ color: '#64748b', textDecoration: 'line-through', marginLeft: '6px' }}>₹{p.old_price}</small>}
                          </td>
                          <td>{p.material || 'Studio Spec'}</td>
                          <td>
                            {p.is_customizable !== false ? (
                              <span style={{ color: '#f472b6', fontSize: '12px', fontWeight: 700 }}>
                                <i className="fa-solid fa-check"></i> Enabled
                              </span>
                            ) : (
                              <span style={{ color: '#64748b', fontSize: '12px' }}>Standard</span>
                            )}
                          </td>
                          <td>
                            <span className="admin-badge active">In Stock Ready</span>
                          </td>
                          <td>
                            <div className="admin-action-btn-group">
                              <button
                                type="button"
                                className="admin-icon-btn"
                                onClick={() => handleOpenEditProduct(p)}
                                title="Edit Product"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              <button
                                type="button"
                                className="admin-icon-btn danger"
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                title="Remove Product"
                              >
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 4: CATEGORIES & TAGS                              */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'categories' && (
            <div>
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-layer-group" style={{ color: '#b8005b' }}></i> Categories &amp; Studio Collections
                  </h1>
                  <p className="admin-page-subtitle">Configure store categories, icon badges, and landing page visibility.</p>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Category Name</th>
                        <th>Icon Badge</th>
                        <th>Active Products</th>
                        <th>Status</th>
                        <th>Public Route</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => {
                        const count = localProducts.filter((p) => (p.cat_name || '').toLowerCase() === cat.name.toLowerCase()).length;
                        return (
                          <tr key={cat.id}>
                            <td>
                              <strong>{cat.name}</strong>
                            </td>
                            <td>
                              <i className={cat.icon} style={{ color: '#b8005b', marginRight: '6px' }}></i>
                              <code style={{ color: '#94a3b8' }}>{cat.icon}</code>
                            </td>
                            <td><strong>{count} items</strong></td>
                            <td>
                              <span className="admin-badge active">Published</span>
                            </td>
                            <td>
                              <a
                                href={`#shop`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onNavigate('/shop');
                                }}
                                style={{ color: '#f472b6', textDecoration: 'underline', fontSize: '12px' }}
                              >
                                /category/{encodeURIComponent(cat.name)}
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 5: COUPONS & DISCOUNTS                            */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'coupons' && (
            <div>
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-tags" style={{ color: '#b8005b' }}></i> Promo Codes &amp; Store Discounts
                  </h1>
                  <p className="admin-page-subtitle">Create seasonal promotional vouchers, festive coupons, and free shipping triggers.</p>
                </div>
                <div className="admin-page-actions">
                  <button type="button" className="admin-btn-primary" onClick={() => setIsCouponModalOpen(true)}>
                    <i className="fa-solid fa-plus"></i> Create Coupon
                  </button>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Promo Code</th>
                        <th>Discount Value</th>
                        <th>Min. Order Value</th>
                        <th>Redemptions</th>
                        <th>Status</th>
                        <th>Toggle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((cp) => (
                        <tr key={cp.id}>
                          <td>
                            <strong style={{ fontFamily: 'monospace', letterSpacing: '1px', color: '#d4af37', background: 'rgba(212,175,55,0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                              {cp.code}
                            </strong>
                          </td>
                          <td>
                            <strong>{cp.type === 'percentage' ? `${cp.value}% OFF` : `₹${cp.value} FLAT`}</strong>
                          </td>
                          <td>₹{cp.minOrder}</td>
                          <td>{cp.uses} uses</td>
                          <td>
                            <span className={`admin-badge ${cp.active ? 'active' : 'draft'}`}>
                              {cp.active ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`admin-icon-btn ${cp.active ? 'danger' : 'success'}`}
                              onClick={() => handleToggleCoupon(cp.id)}
                              title={cp.active ? 'Deactivate Coupon' : 'Activate Coupon'}
                            >
                              <i className={cp.active ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off'}></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 6: CUSTOMERS ROSTER                               */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'customers' && (
            <div>
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-users" style={{ color: '#b8005b' }}></i> Registered Customer Directory
                  </h1>
                  <p className="admin-page-subtitle">View client profiles, order history, and account roles.</p>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Orders Placed</th>
                        <th>Lifetime Spend</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>{user?.name || 'Rahul Sharma'}</strong>
                        </td>
                        <td>{user?.email || 'customer@finegiftstudio.com'}</td>
                        <td>
                          <span className="admin-badge active">Customer Account</span>
                        </td>
                        <td>{localOrders.length || 2} orders</td>
                        <td>₹{metrics.revenue.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Priya Nair</strong>
                        </td>
                        <td>priya.nair@sample.in</td>
                        <td><span className="admin-badge active">Customer</span></td>
                        <td>4 orders</td>
                        <td>₹3,450</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Vikram Patel</strong>
                        </td>
                        <td>vikram.gifts@gmail.com</td>
                        <td><span className="admin-badge active">Customer</span></td>
                        <td>1 order</td>
                        <td>₹1,299</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 7: CMS AUDIT LOG                                  */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'audit' && (
            <div>
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-clock-rotate-left" style={{ color: '#b8005b' }}></i> CMS Audit Trail &amp; Activity
                  </h1>
                  <p className="admin-page-subtitle">Security log of all administrative actions, catalog modifications, and order updates.</p>
                </div>
              </div>

              <div className="admin-panel-card" style={{ padding: '24px' }}>
                <div className="admin-audit-list">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="admin-audit-item">
                      <div className="admin-audit-left">
                        <div className="admin-audit-icon">
                          <i className="fa-solid fa-fingerprint"></i>
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{log.action}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{log.detail}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11.5px', color: '#b45309', fontWeight: 700 }}>{log.user}</div>
                        <span className="admin-audit-time">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MODAL: ADD / EDIT PRODUCT ───────────────────────────── */}
      {isProductModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsProductModalOpen(false)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Edit Product Details' : 'Add New Handcrafted Gift'}</h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setIsProductModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group full-width">
                    <label>Product Title / Name *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. Personalized Couple Wooden LED Lamp"
                      value={productFormData.name}
                      onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Category</label>
                    <select
                      className="admin-form-select"
                      value={productFormData.cat_name}
                      onChange={(e) => setProductFormData({ ...productFormData, cat_name: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Primary Material / Craft</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Ceramic, Wood, Leather, Acrylic"
                      value={productFormData.material}
                      onChange={(e) => setProductFormData({ ...productFormData, material: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      required
                      min={1}
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Original / Strikethrough Price (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      min={0}
                      value={productFormData.old_price}
                      onChange={(e) => setProductFormData({ ...productFormData, old_price: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label>Image URL / Asset Path</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="/assets/images/cups-product.avif"
                      value={productFormData.image_url}
                      onChange={(e) => setProductFormData({ ...productFormData, image_url: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label>Detailed Description</label>
                    <textarea
                      className="admin-form-textarea"
                      rows={3}
                      placeholder="Product features, laser engraving specifications, packing details..."
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={productFormData.is_customizable}
                        onChange={(e) => setProductFormData({ ...productFormData, is_customizable: e.target.checked })}
                      />
                      <span>Allow live laser engraving &amp; text preview for customers</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsProductModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <i className="fa-solid fa-floppy-disk"></i> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: INSPECT ORDER & CUSTOMIZATION SLIP ────────────── */}
      {inspectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setInspectedOrder(null)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>
                <i className="fa-solid fa-receipt" style={{ color: '#d4af37' }}></i> Order Work Slip #{inspectedOrder.id}
              </h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setInspectedOrder(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Order Date</div>
                  <strong style={{ color: '#0f172a' }}>{inspectedOrder.date}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Total Paid</div>
                  <strong style={{ color: '#b8005b' }}>₹{(inspectedOrder.total || 0).toLocaleString()}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Current Status</div>
                  <span className={`admin-badge ${inspectedOrder.status === 'Delivered' ? 'delivered' : 'engraving'}`}>
                    {inspectedOrder.status}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#0f172a' }}>Shipping Destination</h4>
                <p style={{ fontSize: '12.5px', color: '#334155', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px', margin: 0 }}>
                  {inspectedOrder.shippingAddress || 'Fine Gift Studio Express Dispatch, Mangalore, Karnataka'}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#0f172a' }}>Items &amp; Custom Engraving Notes</h4>
                {inspectedOrder.items?.map((it, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>
                      {it.name} <span style={{ color: '#64748b' }}>(Qty: {it.quantity || 1})</span>
                    </div>
                    {it.customNote ? (
                      <div style={{ marginTop: '6px', background: '#fefce8', border: '1px dashed #d4af37', padding: '8px 12px', borderRadius: '8px', color: '#b45309', fontSize: '12.5px', fontWeight: 600 }}>
                        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#b8005b' }}></i> <strong>Laser Engraving Text:</strong> "{it.customNote}"
                      </div>
                    ) : (
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                        * Standard catalog configuration (No custom message requested)
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>
                  Assign Courier Tracking AWB
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="admin-form-input"
                    style={{ flex: 1 }}
                    placeholder="e.g. BLUEDART-992140"
                    value={dispatchAwb}
                    onChange={(e) => setDispatchAwb(e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={() => {
                      handleUpdateOrderStatus(inspectedOrder.id, 'Dispatched', dispatchAwb);
                      setInspectedOrder(null);
                    }}
                  >
                    Mark Dispatched
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button type="button" className="admin-btn-secondary" onClick={() => window.print()}>
                <i className="fa-solid fa-print"></i> Print Work Slip
              </button>
              <button type="button" className="admin-btn-primary" onClick={() => setInspectedOrder(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE COUPON ────────────────────────────────── */}
      {isCouponModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsCouponModalOpen(false)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Create Store Promotional Voucher</h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setIsCouponModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveCoupon}>
              <div className="admin-modal-body">
                <div className="admin-form-grid">
                  <div className="admin-form-group full-width">
                    <label>Voucher Code *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      required
                      placeholder="e.g. DIWALI25, FESTIVE500"
                      value={couponFormData.code}
                      onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Discount Type</label>
                    <select
                      className="admin-form-select"
                      value={couponFormData.type}
                      onChange={(e) => setCouponFormData({ ...couponFormData, type: e.target.value })}
                    >
                      <option value="percentage">Percentage (% OFF)</option>
                      <option value="flat">Flat Amount (₹ OFF)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Discount Value *</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      required
                      min={1}
                      value={couponFormData.value}
                      onChange={(e) => setCouponFormData({ ...couponFormData, value: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width">
                    <label>Minimum Order Threshold (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      min={0}
                      value={couponFormData.minOrder}
                      onChange={(e) => setCouponFormData({ ...couponFormData, minOrder: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsCouponModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <i className="fa-solid fa-check"></i> Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
