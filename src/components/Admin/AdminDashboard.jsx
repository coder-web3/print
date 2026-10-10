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

// Default studio media library assets
const DEFAULT_MEDIA_ASSETS = [
  {
    id: 'med_1',
    name: 'cups-product.avif',
    url: '/assets/images/cups-product.avif',
    size: '34.8 KB',
    dimensions: '600 × 600',
    type: 'image/avif',
    category: 'Product Photos',
    alt: 'Custom Printed Magic Coffee Mug Sample',
    uploadedAt: '08 Oct 2026'
  },
  {
    id: 'med_2',
    name: 'frames.avif',
    url: '/assets/images/frames.avif',
    size: '39.9 KB',
    dimensions: '600 × 600',
    type: 'image/avif',
    category: 'Product Photos',
    alt: 'Couple Acrylic Wooden LED Photo Frame',
    uploadedAt: '08 Oct 2026'
  },
  {
    id: 'med_3',
    name: 'wallets.avif',
    url: '/assets/images/wallets.avif',
    size: '97.2 KB',
    dimensions: '600 × 600',
    type: 'image/avif',
    category: 'Product Photos',
    alt: 'Genuine Leather Personalized Wallet with Charm',
    uploadedAt: '08 Oct 2026'
  },
  {
    id: 'med_4',
    name: 'pens.avif',
    url: '/assets/images/pens.avif',
    size: '63.3 KB',
    dimensions: '600 × 600',
    type: 'image/avif',
    category: 'Product Photos',
    alt: 'Laser Engraved Executive Metal Rollerball Pen',
    uploadedAt: '08 Oct 2026'
  },
  {
    id: 'med_5',
    name: 'lamps.avif',
    url: '/assets/images/lamps.avif',
    size: '38.6 KB',
    dimensions: '600 × 600',
    type: 'image/avif',
    category: 'Product Photos',
    alt: 'Warm Wooden Name Plate Night Lamp',
    uploadedAt: '08 Oct 2026'
  },
  {
    id: 'med_6',
    name: 'corporate-gifts.avif',
    url: '/assets/images/corporate-gifts.avif',
    size: '24.2 KB',
    dimensions: '600 × 600',
    type: 'image/avif',
    category: 'Product Photos',
    alt: 'Executive Corporate Hamper and Diary Set',
    uploadedAt: '08 Oct 2026'
  },
  {
    id: 'med_7',
    name: 't-shirt.avif',
    url: '/assets/images/t-shirt.avif',
    size: '48.5 KB',
    dimensions: '600 × 600',
    type: 'image/avif',
    category: 'Product Photos',
    alt: 'Combed Cotton Custom Printed T-Shirt',
    uploadedAt: '08 Oct 2026'
  },
  {
    id: 'med_8',
    name: 'gifts.avif',
    url: '/assets/images/gifts.avif',
    size: '49.7 KB',
    dimensions: '600 × 600',
    type: 'image/avif',
    category: 'Product Photos',
    alt: 'Luxury Celebration Gift Hamper with Keepsake Box',
    uploadedAt: '08 Oct 2026'
  },
  {
    id: 'med_9',
    name: 'packaging.avif',
    url: '/assets/images/packaging.avif',
    size: '32.5 KB',
    dimensions: '600 × 600',
    type: 'image/avif',
    category: 'Studio Assets',
    alt: 'Shatterproof Luxury Gift Packing Box',
    uploadedAt: '07 Oct 2026'
  }
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

  // ── 5B. STATE FOR MEDIA LIBRARY & UPLOAD ─────────────────────────────
  const [mediaAssets, setMediaAssets] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_admin_media');
      return saved ? JSON.parse(saved) : DEFAULT_MEDIA_ASSETS;
    } catch {
      return DEFAULT_MEDIA_ASSETS;
    }
  });

  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState('all');
  const [selectedMediaDetail, setSelectedMediaDetail] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaPickerTab, setMediaPickerTab] = useState('library'); // 'upload' | 'library' | 'url'

  // Process and upload image files
  const handleFileUpload = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const filesArray = Array.from(fileList);

    filesArray.forEach((file) => {
      // Validate MIME type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Unsupported Format', `${file.name} is not a valid image file.`);
        return;
      }
      // Validate file size (10 MB max)
      if (file.size > 10 * 1024 * 1024) {
        showNotification('error', 'File Too Large', `${file.name} exceeds the 10 MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const img = new Image();
        img.onload = () => {
          const newMedia = {
            id: 'med_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            name: file.name,
            url: dataUrl,
            size: (file.size / 1024).toFixed(1) + ' KB',
            dimensions: `${img.width} × ${img.height}`,
            type: file.type,
            category: 'Custom Uploads',
            alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            uploadedAt: 'Just now'
          };

          setMediaAssets((prev) => {
            const updated = [newMedia, ...prev];
            try {
              localStorage.setItem('finegift_admin_media', JSON.stringify(updated));
            } catch {}
            return updated;
          });

          addAuditLog('Media Uploaded', `Uploaded image: "${file.name}" (${newMedia.size})`);
          showNotification('success', 'Media Uploaded', `"${file.name}" added to media library.`);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  // Delete media item
  const handleDeleteMedia = (mediaId, mediaName) => {
    if (window.confirm(`Are you sure you want to delete "${mediaName}" from the media library?`)) {
      setMediaAssets((prev) => {
        const updated = prev.filter((m) => m.id !== mediaId);
        try {
          localStorage.setItem('finegift_admin_media', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      addAuditLog('Media Deleted', `Removed "${mediaName}" from media library.`);
      showNotification('info', 'Media Deleted', `"${mediaName}" removed.`);
      if (selectedMediaDetail && selectedMediaDetail.id === mediaId) {
        setSelectedMediaDetail(null);
      }
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = (url) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      showNotification('success', 'Link Copied', 'Image URL copied to clipboard.');
    } else {
      showNotification('info', 'Image URL', url);
    }
  };

  // Upload image directly from Product modal
  const handleProductModalUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Invalid File', 'Please upload a valid image file (PNG, JPG, WebP, AVIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showNotification('error', 'File Too Large', 'Maximum file size is 10 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      const img = new Image();
      img.onload = () => {
        const newMedia = {
          id: 'med_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          name: file.name,
          url: dataUrl,
          size: (file.size / 1024).toFixed(1) + ' KB',
          dimensions: `${img.width} × ${img.height}`,
          type: file.type,
          category: 'Custom Uploads',
          alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          uploadedAt: 'Just now'
        };
        setMediaAssets((prev) => {
          const updated = [newMedia, ...prev];
          try {
            localStorage.setItem('finegift_admin_media', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        setProductFormData((prev) => ({ ...prev, image_url: dataUrl }));
        addAuditLog('Media Uploaded', `Uploaded "${file.name}" via Product Editor.`);
        showNotification('success', 'Image Uploaded', `Image uploaded and assigned to product.`);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Filtered media assets
  const filteredMedia = useMemo(() => {
    return mediaAssets.filter((item) => {
      if (mediaCategoryFilter !== 'all' && (item.category || '').toLowerCase() !== mediaCategoryFilter.toLowerCase()) {
        return false;
      }
      if (mediaSearch.trim()) {
        const q = mediaSearch.toLowerCase();
        return (item.name || '').toLowerCase().includes(q) || (item.alt || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [mediaAssets, mediaCategoryFilter, mediaSearch]);

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
              <li>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === 'media' ? 'active' : ''}`}
                  onClick={() => setActiveTab('media')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-photo-film"></i>
                    <span>Media Library &amp; Upload</span>
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{mediaAssets.length}</span>
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

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 8: MEDIA LIBRARY & DIGITAL ASSETS                 */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'media' && (
            <div>
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-photo-film" style={{ color: '#b8005b' }}></i> Media Library &amp; Studio Assets
                  </h1>
                  <p className="admin-page-subtitle">Upload high-resolution photography, manage product mockups, and optimize image SEO.</p>
                </div>
                <div className="admin-page-actions">
                  <input
                    type="file"
                    id="admin-media-header-upload"
                    className="admin-file-hidden-input"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={() => document.getElementById('admin-media-header-upload')?.click()}
                  >
                    <i className="fa-solid fa-cloud-arrow-up"></i> Upload Media
                  </button>
                </div>
              </div>

              {/* Drag and drop upload dropzone */}
              <div
                className={`admin-media-dropzone ${isDragging ? 'drag-active' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => document.getElementById('admin-media-header-upload')?.click()}
              >
                <div className="admin-dropzone-icon">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                </div>
                <h3 className="admin-dropzone-title">Drag &amp; drop photos here or click to browse</h3>
                <p className="admin-dropzone-sub">
                  Supports AVIF, WebP, PNG, and JPG up to 10 MB per file. Automatic SEO alt optimization enabled.
                </p>
                <button type="button" className="admin-btn-secondary" style={{ pointerEvents: 'none' }}>
                  <i className="fa-regular fa-folder-open"></i> Select Files from Device
                </button>
              </div>

              {/* Filter and search bar */}
              <div className="admin-panel-card" style={{ marginBottom: '20px' }}>
                <div className="admin-panel-header">
                  <div className="admin-panel-toolbar">
                    <input
                      type="text"
                      className="admin-search-input"
                      placeholder="Search image name, alt tag..."
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                    />
                    <select
                      className="admin-filter-select"
                      value={mediaCategoryFilter}
                      onChange={(e) => setMediaCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="product photos">Product Photos</option>
                      <option value="studio assets">Studio Assets</option>
                      <option value="custom uploads">Custom Uploads</option>
                    </select>
                  </div>
                  <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
                    Showing <strong>{filteredMedia.length}</strong> of {mediaAssets.length} assets
                  </span>
                </div>
              </div>

              {/* Media gallery grid */}
              {filteredMedia.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '18px', border: '1px dashed #cbd5e1' }}>
                  <i className="fa-regular fa-images" style={{ fontSize: '36px', color: '#b8005b', marginBottom: '12px' }}></i>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>No Media Found</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>Try clearing your search query or upload new photography.</p>
                </div>
              ) : (
                <div className="admin-media-grid">
                  {filteredMedia.map((med) => (
                    <div key={med.id} className="admin-media-card">
                      <div className="admin-media-thumb-wrap">
                        <img
                          src={med.url}
                          alt={med.alt || med.name}
                          className="admin-media-img"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80"; }}
                        />
                        <div className="admin-media-hover-overlay">
                          <button
                            type="button"
                            className="admin-media-overlay-btn"
                            onClick={() => setSelectedMediaDetail(med)}
                            title="Inspect Details"
                          >
                            <i className="fa-regular fa-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="admin-media-overlay-btn"
                            onClick={() => handleCopyUrl(med.url)}
                            title="Copy Direct URL"
                          >
                            <i className="fa-regular fa-copy"></i>
                          </button>
                          <button
                            type="button"
                            className="admin-media-overlay-btn danger"
                            onClick={() => handleDeleteMedia(med.id, med.name)}
                            title="Delete Image"
                          >
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
                      <div className="admin-media-info">
                        <div className="admin-media-filename" title={med.name}>{med.name}</div>
                        <div className="admin-media-meta">
                          <span>{med.size}</span>
                          <span className="admin-media-badge-tag">{med.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                    <label>Product Visual / Media Asset</label>
                    <div className="admin-media-uploader-box">
                      <div className="admin-media-picker-tabs">
                        <button
                          type="button"
                          className={`admin-media-tab-btn ${mediaPickerTab === 'library' ? 'active' : ''}`}
                          onClick={() => setMediaPickerTab('library')}
                        >
                          <i className="fa-solid fa-photo-film"></i> Pick from Library
                        </button>
                        <button
                          type="button"
                          className={`admin-media-tab-btn ${mediaPickerTab === 'upload' ? 'active' : ''}`}
                          onClick={() => setMediaPickerTab('upload')}
                        >
                          <i className="fa-solid fa-cloud-arrow-up"></i> Upload from Device
                        </button>
                        <button
                          type="button"
                          className={`admin-media-tab-btn ${mediaPickerTab === 'url' ? 'active' : ''}`}
                          onClick={() => setMediaPickerTab('url')}
                        >
                          <i className="fa-solid fa-link"></i> Direct URL
                        </button>
                      </div>

                      {mediaPickerTab === 'library' && (
                        <div>
                          <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '6px' }}>
                            Click an asset below to link it to this product:
                          </div>
                          <div className="admin-media-picker-grid">
                            {mediaAssets.map((asset) => (
                              <button
                                key={asset.id}
                                type="button"
                                className={`admin-media-picker-item ${productFormData.image_url === asset.url ? 'selected' : ''}`}
                                onClick={() => setProductFormData({ ...productFormData, image_url: asset.url })}
                                title={asset.name}
                              >
                                <img src={asset.url} alt={asset.alt || asset.name} />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {mediaPickerTab === 'upload' && (
                        <div>
                          <label
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '16px',
                              border: '1.5px dashed #b8005b',
                              borderRadius: '10px',
                              background: '#fdf2f8',
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '20px', color: '#b8005b', marginBottom: '6px' }}></i>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                              Choose an image to upload &amp; attach
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              PNG, JPG, WebP, AVIF up to 10MB
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="admin-file-hidden-input"
                              onChange={handleProductModalUpload}
                            />
                          </label>
                        </div>
                      )}

                      {mediaPickerTab === 'url' && (
                        <div>
                          <input
                            type="text"
                            className="admin-form-input"
                            placeholder="https://... or /assets/images/cups-product.avif"
                            value={productFormData.image_url}
                            onChange={(e) => setProductFormData({ ...productFormData, image_url: e.target.value })}
                          />
                        </div>
                      )}

                      {productFormData.image_url && (
                        <div className="admin-media-preview-container">
                          <img
                            src={productFormData.image_url}
                            alt="Selected preview"
                            className="admin-media-preview-img"
                            onError={(e) => { e.currentTarget.src = '/assets/images/cups-product.avif'; }}
                          />
                          <div className="admin-media-preview-details">
                            <div className="admin-media-preview-name">Active Product Image</div>
                            <div className="admin-media-preview-sub">
                              <i className="fa-solid fa-circle-check"></i> Ready to publish
                            </div>
                          </div>
                          <button
                            type="button"
                            className="admin-action-btn danger"
                            title="Remove image"
                            onClick={() => setProductFormData({ ...productFormData, image_url: '' })}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
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

      {/* ── MODAL: MEDIA DETAIL INSPECTION ─────────────────────── */}
      {selectedMediaDetail && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedMediaDetail(null)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="admin-modal-header">
              <h3>Media Asset Details</h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setSelectedMediaDetail(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <img
                src={selectedMediaDetail.url}
                alt={selectedMediaDetail.alt || selectedMediaDetail.name}
                className="admin-media-detail-preview"
              />
              <div className="admin-media-meta-row">
                <span className="admin-media-meta-label">File Name</span>
                <span className="admin-media-meta-val">{selectedMediaDetail.name}</span>
              </div>
              <div className="admin-media-meta-row">
                <span className="admin-media-meta-label">Category</span>
                <span className="admin-media-meta-val">{selectedMediaDetail.category}</span>
              </div>
              <div className="admin-media-meta-row">
                <span className="admin-media-meta-label">Dimensions</span>
                <span className="admin-media-meta-val">{selectedMediaDetail.dimensions || 'Dynamic / Web Vector'}</span>
              </div>
              <div className="admin-media-meta-row">
                <span className="admin-media-meta-label">File Size</span>
                <span className="admin-media-meta-val">{selectedMediaDetail.size || 'Local Asset'}</span>
              </div>
              <div className="admin-media-meta-row">
                <span className="admin-media-meta-label">Alt Tag</span>
                <span className="admin-media-meta-val">{selectedMediaDetail.alt || selectedMediaDetail.name}</span>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => handleCopyUrl(selectedMediaDetail.url)}
              >
                <i className="fa-solid fa-link"></i> Copy Direct Link
              </button>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => setSelectedMediaDetail(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
