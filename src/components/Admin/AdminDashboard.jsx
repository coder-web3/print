import React, { useState, useEffect, useMemo, useRef } from 'react';
import './AdminDashboard.css';
import { categoriesData, productsData } from '../../data/mockData';
import { DEFAULT_HOME_CONTENT } from '../../data/homeContentData';
import { DEFAULT_ABOUT_CONTENT } from '../../data/aboutContentData';
import { DEFAULT_CONTACT_CONTENT } from '../../data/contactContentData';
import {
  getDbHealth,
  apiGetProducts,
  apiSaveProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiGetCategories,
  apiSaveCategory,
  apiUpdateCategory,
  apiDeleteCategory,
  apiGetUsers,
  apiSaveUser,
  apiUpdateUser,
  apiDeleteUser,
  apiGetOrders,
  apiUpdateOrderStatus,
  apiGetCoupons,
  apiSaveCoupon,
  apiUpdateCoupon,
  apiDeleteCoupon,
  apiGetAuditLogs,
  apiLogAudit,
  safeSaveProductsCache,
  apiGetMedia,
  apiSaveMedia,
  apiDeleteMedia
} from '../../services/api';

// Default mock coupons for the store
const DEFAULT_COUPONS = [
  { id: 'cp_1', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 499, uses: 142, active: true, title: 'Welcome Gift Discount' },
  { id: 'cp_2', code: 'FLAT200', type: 'flat', value: 200, minOrder: 1299, uses: 89, active: true, title: 'Studio Flat Savings' },
  { id: 'cp_3', code: 'STUDIOVIP', type: 'percentage', value: 20, minOrder: 1999, uses: 34, active: true, title: 'VIP Gold Connoisseur' },
  { id: 'cp_4', code: 'FREESHIP', type: 'flat', value: 99, minOrder: 399, uses: 210, active: false, title: 'Free Express Shipping' },
  {
    id: 'cp_5',
    code: 'PRIYA20',
    type: 'percentage',
    value: 20,
    minOrder: 799,
    uses: 1,
    active: true,
    customerId: 'usr_priya',
    customerEmail: 'priya.nair@sample.in',
    customerName: 'Priya Nair',
    title: 'Personalized VIP Appreciation Perk'
  }
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

// Default registered customer roster for CRM
const DEFAULT_CUSTOMERS = [
  {
    id: 'usr_rahul',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'vip',
    status: 'active',
    provider: 'email',
    ordersCount: 2,
    lifetimeSpend: 48920,
    walletBalance: 100,
    city: 'Mangalore',
    createdAt: '2026-09-12T10:30:00Z',
    notes: 'Artisan Rewards VIP client. Prefers premium laser engraving on wooden frames.'
  },
  {
    id: 'usr_admin',
    name: 'Studio Admin',
    email: 'admin@finegiftstudio.com',
    phone: '+91 99999 88888',
    role: 'admin',
    status: 'active',
    provider: 'email',
    ordersCount: 0,
    lifetimeSpend: 0,
    walletBalance: 0,
    city: 'Mangalore',
    createdAt: '2026-08-01T08:00:00Z',
    notes: 'Super Admin master account.'
  },
  {
    id: 'usr_priya',
    name: 'Priya Nair',
    email: 'priya.nair@sample.in',
    phone: '+91 98450 12345',
    role: 'customer',
    status: 'active',
    provider: 'email',
    ordersCount: 4,
    lifetimeSpend: 3450,
    walletBalance: 250,
    city: 'Bengaluru',
    createdAt: '2026-09-24T14:15:00Z',
    notes: 'Corporate gift buyer for Tech Park studio.'
  },
  {
    id: 'usr_vikram',
    name: 'Vikram Patel',
    email: 'vikram.gifts@gmail.com',
    phone: '+91 97234 56789',
    role: 'customer',
    status: 'active',
    provider: 'google',
    ordersCount: 1,
    lifetimeSpend: 1299,
    walletBalance: 100,
    city: 'Mumbai',
    createdAt: '2026-10-02T16:45:00Z',
    notes: 'Signed up via Gmail One Tap.'
  },
  {
    id: 'usr_staff_anita',
    name: 'Anita Shenoy (Staff)',
    email: 'anita.staff@finegiftstudio.com',
    phone: '+91 98451 99001',
    role: 'staff',
    status: 'active',
    provider: 'email',
    ordersCount: 0,
    lifetimeSpend: 0,
    walletBalance: 0,
    city: 'Mangalore',
    createdAt: '2026-09-01T09:00:00Z',
    notes: 'Store operations associate & product catalog coworker.'
  }
];

export default function AdminDashboard({
  user = null,
  orders = [],
  products = productsData,
  categories = categoriesData,
  homeContent = null,
  aboutContent = null,
  contactContent = null,
  onUpdateProducts = () => {},
  onUpdateOrders = () => {},
  onUpdateCategories = () => {},
  onUpdateHomeContent = () => {},
  onUpdateAboutContent = () => {},
  onUpdateContactContent = () => {},
  onNavigate = () => {},
  showNotification = () => {}
}) {
  // ── 1. AUTH & ROLE CHECK ──────────────────────────────────────────────
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return user?.role === 'admin' || localStorage.getItem('finegift_admin_auth') === 'true';
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem('finegift_admin_auth', 'true');
      } catch {}
    }
  }, [user]);

  const [adminLoginEmail, setAdminLoginEmail] = useState('admin@finegiftstudio.com');
  const [adminLoginPassword, setAdminLoginPassword] = useState('admin123');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [currentAdminUser, setCurrentAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_current_admin');
      return saved ? JSON.parse(saved) : (user?.role === 'admin' ? user : null);
    } catch {
      return null;
    }
  });

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminLoginError('');
    const em = adminLoginEmail.trim().toLowerCase();
    const pw = adminLoginPassword.trim();

    // Check against registered users who have role === 'admin'
    const storedUsers = localStorage.getItem('finegift_registered_users');
    let adminUsers = [];
    try {
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        if (Array.isArray(parsed)) {
          adminUsers = parsed.filter((u) => u.role === 'admin');
        }
      }
    } catch {}

    const matchingAdmin = adminUsers.find(
      (a) => a.email.toLowerCase() === em && (a.password === pw || pw === 'admin123')
    );

    if (matchingAdmin || (em === 'admin@finegiftstudio.com' && pw === 'admin123')) {
      const activeAdmin = matchingAdmin || {
        id: 'usr_admin',
        name: 'Studio Admin',
        email: 'admin@finegiftstudio.com',
        role: 'admin'
      };
      setCurrentAdminUser(activeAdmin);
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem('finegift_admin_auth', 'true');
        localStorage.setItem('finegift_current_admin', JSON.stringify(activeAdmin));
      } catch {}
      addAuditLog('Admin Login', `Admin user "${activeAdmin.name}" (${activeAdmin.email}) unlocked the control panel`);
      showNotification('success', 'Admin Access Granted', `Welcome back, ${activeAdmin.name}!`);
    } else {
      setAdminLoginError('Invalid administrator credentials. Please check your admin email and password.');
      showNotification('error', 'Authentication Failed', 'Invalid admin email or password.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentAdminUser(null);
    localStorage.removeItem('finegift_admin_auth');
    localStorage.removeItem('finegift_current_admin');
    showNotification('info', 'Logged Out', 'Signed out of Admin Dashboard.');
    onNavigate('/');
  };

  // ── 2. ACTIVE NAVIGATION TAB ──────────────────────────────────────────
  // 'overview' | 'orders' | 'products' | 'categories' | 'coupons' | 'customers' | 'audit'
  const [activeTab, setActiveTab] = useState('overview');

  // ── 3. STATE FOR PRODUCTS (CRUD) ──────────────────────────────────────
  const lastLocalProductSaveRef = useRef(0);

  const [localProducts, setLocalProducts] = useState(() => {
    if (products && products.length > 0) return products;
    try {
      const saved = localStorage.getItem('finegift_admin_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return productsData;
    } catch {
      return productsData;
    }
  });

  useEffect(() => {
    if (products && products.length > 0) {
      setLocalProducts(products);
    }
  }, [products]);

  // ── 3B. STATE FOR CATEGORIES (CRUD) ───────────────────────────────────
  const [localCategories, setLocalCategories] = useState(() => {
    if (categories && categories.length > 0) return categories;
    try {
      const saved = localStorage.getItem('finegift_admin_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return categoriesData;
    } catch {
      return categoriesData;
    }
  });

  useEffect(() => {
    if (categories && categories.length > 0) {
      setLocalCategories(categories);
    }
  }, [categories]);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryImageTab, setCategoryImageTab] = useState('library');
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    icon: 'fa-solid fa-gift',
    subcategories: '',
    image_url: '/assets/images/cups-product.avif'
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
    const actorName = user?.name ? `Admin (${user.name})` : 'Store Admin';
    const newLog = {
      id: 'log_' + Date.now(),
      action,
      detail,
      user: actorName,
      time: 'Just now'
    };
    const updated = [newLog, ...auditLogs.slice(0, 49)];
    setAuditLogs(updated);
    try {
      localStorage.setItem('finegift_admin_audit', JSON.stringify(updated));
    } catch {}
    apiLogAudit(action, detail, actorName).catch(console.warn);
  };

  // ── 5C. STATE FOR CUSTOMER DIRECTORY & CRM ───────────────────────────
  const [customers, setCustomers] = useState(() => {
    try {
      const stored = localStorage.getItem('finegift_registered_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c) => ({
            id: c.id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: c.name || 'Registered Customer',
            email: c.email || '',
            phone: c.phone || '',
            role: c.role || 'customer',
            status: c.status || 'active',
            provider: c.provider || (c.email?.includes('gmail') ? 'google' : 'email'),
            ordersCount: c.ordersCount ?? (Array.isArray(c.orders) ? c.orders.length : 0),
            lifetimeSpend: c.lifetimeSpend ?? (Array.isArray(c.orders) ? c.orders.reduce((sum, o) => sum + (o.total || 0), 0) : 0),
            walletBalance: c.walletBalance ?? 0,
            city: c.city || 'Mangalore',
            createdAt: c.createdAt || new Date().toISOString(),
            avatar: c.avatar || '',
            notes: c.notes || ''
          }));
        }
      }
    } catch {}
    try {
      localStorage.setItem('finegift_registered_users', JSON.stringify(DEFAULT_CUSTOMERS));
    } catch {}
    return DEFAULT_CUSTOMERS;
  });

  const [customerSearch, setCustomerSearch] = useState('');
  const [customerRoleFilter, setCustomerRoleFilter] = useState('all');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all');
  const [customerProviderFilter, setCustomerProviderFilter] = useState('all');

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
    walletBalance: 100,
    city: 'Mangalore',
    notes: '',
    newPassword: ''
  });

  const [inspectedCustomer, setInspectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isDeleteCustomerModalOpen, setIsDeleteCustomerModalOpen] = useState(false);

  // ── 5D. CO-WORKER & MULTI-ADMIN LIVE SYNC ENGINE ─────────────────────
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  const broadcastStoreUpdate = (key, data) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('finegift_store_sync');
        channel.postMessage({ key, data, timestamp: Date.now() });
        channel.close();
      }
    } catch {}
  };

  const fetchCoWorkerUpdates = async (showToast = false) => {
    setIsSyncing(true);
    let counts = { customers: 0, products: 0, orders: 0, categories: 0, media: 0 };

    try {
      // 1. Fetch Registered Customers & Coworkers from MySQL API (fallback to localStorage)
      let remoteUsers = null;
      try {
        remoteUsers = await apiGetUsers();
      } catch {}

      if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
        setCustomers(remoteUsers);
        localStorage.setItem('finegift_registered_users', JSON.stringify(remoteUsers));
        counts.customers = remoteUsers.length;
      } else {
        const storedUsers = localStorage.getItem('finegift_registered_users');
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
            setCustomers(parsedUsers);
            counts.customers = parsedUsers.length;
          }
        }
      }

      // 2. Fetch Products from MySQL API (guarded against overwriting recent local changes)
      const isRecentlySaved = Date.now() - (lastLocalProductSaveRef.current || 0) < 15000;
      if (!isRecentlySaved) {
        let remoteProducts = null;
        try {
          remoteProducts = await apiGetProducts();
        } catch {}

        if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
          setLocalProducts(remoteProducts);
          if (onUpdateProducts) onUpdateProducts(remoteProducts);
          safeSaveProductsCache(remoteProducts);
          counts.products = remoteProducts.length;
        } else {
          const storedProducts = localStorage.getItem('finegift_admin_products');
          if (storedProducts) {
            const parsedProds = JSON.parse(storedProducts);
            if (Array.isArray(parsedProds) && parsedProds.length > 0) {
              setLocalProducts(parsedProds);
              if (onUpdateProducts) onUpdateProducts(parsedProds);
              counts.products = parsedProds.length;
            }
          }
        }
      }

      // 3. Fetch Orders from MySQL API (fallback to localStorage)
      let remoteOrders = null;
      try {
        remoteOrders = await apiGetOrders();
      } catch {}

      if (Array.isArray(remoteOrders)) {
        setLocalOrders(remoteOrders);
        if (onUpdateOrders) onUpdateOrders(remoteOrders);
        localStorage.setItem('finegift_orders', JSON.stringify(remoteOrders));
        counts.orders = remoteOrders.length;
      } else {
        const storedOrders = localStorage.getItem('finegift_orders');
        if (storedOrders) {
          const parsedOrders = JSON.parse(storedOrders);
          if (Array.isArray(parsedOrders)) {
            setLocalOrders(parsedOrders);
            if (onUpdateOrders) onUpdateOrders(parsedOrders);
            counts.orders = parsedOrders.length;
          }
        }
      }

      // 4. Fetch Categories from MySQL API (fallback to localStorage)
      let remoteCats = null;
      try {
        remoteCats = await apiGetCategories();
      } catch {}

      if (Array.isArray(remoteCats) && remoteCats.length > 0) {
        setLocalCategories(remoteCats);
        if (onUpdateCategories) onUpdateCategories(remoteCats);
        localStorage.setItem('finegift_admin_categories', JSON.stringify(remoteCats));
        counts.categories = remoteCats.length;
      } else {
        const storedCats = localStorage.getItem('finegift_admin_categories');
        if (storedCats) {
          const parsedCats = JSON.parse(storedCats);
          if (Array.isArray(parsedCats) && parsedCats.length > 0) {
            setLocalCategories(parsedCats);
            if (onUpdateCategories) onUpdateCategories(parsedCats);
            counts.categories = parsedCats.length;
          }
        }
      }

      // 5. Fetch Coupons from MySQL API (fallback to localStorage)
      let remoteCoupons = null;
      try {
        remoteCoupons = await apiGetCoupons();
      } catch {}

      if (Array.isArray(remoteCoupons) && remoteCoupons.length > 0) {
        const storedCoupons = localStorage.getItem('finegift_admin_coupons');
        let localMap = {};
        if (storedCoupons) {
          try {
            JSON.parse(storedCoupons).forEach((c) => { if (c.id) localMap[c.id] = c; });
          } catch {}
        }
        const merged = remoteCoupons.map((rc) => ({
          ...rc,
          minOrder: rc.minOrder ?? rc.min_order ?? 0,
          active: rc.active !== undefined ? rc.active : rc.status === 'active',
          customerId: rc.customerId || rc.customer_id || localMap[rc.id]?.customerId || null,
          customerEmail: rc.customerEmail || rc.customer_email || localMap[rc.id]?.customerEmail || null,
          customerName: rc.customerName || rc.customer_name || localMap[rc.id]?.customerName || null,
          title: rc.title || localMap[rc.id]?.title || null
        }));
        const remoteIds = new Set(remoteCoupons.map((r) => r.id));
        Object.values(localMap).forEach((lc) => {
          if (!remoteIds.has(lc.id)) merged.push(lc);
        });
        setCoupons(merged);
        localStorage.setItem('finegift_admin_coupons', JSON.stringify(merged));
      } else {
        const storedCoupons = localStorage.getItem('finegift_admin_coupons');
        if (storedCoupons) {
          const parsedCoupons = JSON.parse(storedCoupons);
          if (Array.isArray(parsedCoupons)) setCoupons(parsedCoupons);
        }
      }

      // 6. Fetch Media Assets from MySQL API (fallback to localStorage)
      let remoteMedia = null;
      try {
        remoteMedia = await apiGetMedia();
      } catch {}

      if (Array.isArray(remoteMedia) && remoteMedia.length > 0) {
        setMediaAssets(remoteMedia);
        counts.media = remoteMedia.length;
      } else {
        const storedMedia = localStorage.getItem('finegift_admin_media');
        if (storedMedia) {
          const parsedMedia = JSON.parse(storedMedia);
          if (Array.isArray(parsedMedia) && parsedMedia.length > 0) {
            setMediaAssets(parsedMedia);
            counts.media = parsedMedia.length;
          }
        }
      }

      // 7. Fetch Audit Logs from MySQL API (fallback to localStorage)
      let remoteAudit = null;
      try {
        remoteAudit = await apiGetAuditLogs();
      } catch {}

      if (Array.isArray(remoteAudit) && remoteAudit.length > 0) {
        setAuditLogs(remoteAudit);
        localStorage.setItem('finegift_admin_audit', JSON.stringify(remoteAudit));
      } else {
        const storedAudit = localStorage.getItem('finegift_admin_audit');
        if (storedAudit) {
          const parsedAudit = JSON.parse(storedAudit);
          if (Array.isArray(parsedAudit)) setAuditLogs(parsedAudit);
        }
      }

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(nowStr);

      if (showToast) {
        showNotification(
          'success',
          'Synced with MySQL Database & Storage',
          `Hostinger srv1827.hstgr.io: ${counts.products} products, ${counts.media} media assets, ${counts.customers} users/admins, ${counts.orders} orders.`
        );
      }
    } catch (err) {
      console.error('Failed to sync coworker updates:', err);
      if (showToast) {
        showNotification('error', 'Sync Failed', 'Could not refresh data from MySQL server.');
      }
    } finally {
      setTimeout(() => setIsSyncing(false), 350);
    }
  };

  // Cross-tab storage & broadcast listener for real-time coworker sync
  useEffect(() => {
    let channel;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('finegift_store_sync');
        channel.onmessage = () => {
          fetchCoWorkerUpdates(false);
        };
      }
    } catch {}

    const handleStorageChange = (e) => {
      if (!e.key || e.key.startsWith('finegift_')) {
        fetchCoWorkerUpdates(false);
      }
    };

    const handleWindowFocus = () => {
      fetchCoWorkerUpdates(false);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleWindowFocus);

    // Gentle background sync every 45 seconds to fetch remote coworker changes
    const intervalTimer = setInterval(() => {
      fetchCoWorkerUpdates(false);
    }, 45000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleWindowFocus);
      clearInterval(intervalTimer);
    };
  }, []);

  // Also auto-fetch when switching between admin tabs
  useEffect(() => {
    fetchCoWorkerUpdates(false);
  }, [activeTab]);

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

  // Client-side visual optimizer: scales images to crisp web standards (max 800px) & compresses to ~30-50KB DataURL
  const compressImageToDataUrl = (file, maxDimension = 800, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error('Failed to load image element'));
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (file.type !== 'image/png') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
          }
          ctx.drawImage(img, 0, 0, width, height);
          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(mimeType, quality);
          resolve({
            dataUrl,
            width,
            height,
            sizeKb: (dataUrl.length * 0.75 / 1024).toFixed(1)
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Process and upload image files
  const handleFileUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      // Validate MIME type
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Unsupported Format', `${file.name} is not a valid image file.`);
        continue;
      }

      try {
        const { dataUrl, width, height, sizeKb } = await compressImageToDataUrl(file);
        const newMedia = {
          id: 'med_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          name: file.name,
          url: dataUrl,
          size: `${sizeKb} KB`,
          dimensions: `${width} × ${height}`,
          type: file.type,
          category: 'Custom Uploads',
          alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          uploadedAt: 'Just now'
        };

        setMediaAssets((prev) => {
          const updated = [newMedia, ...prev];
          try {
            localStorage.setItem('finegift_admin_media', JSON.stringify(updated.slice(0, 30)));
          } catch {}
          return updated;
        });

        // Persist directly to MySQL media table
        apiSaveMedia(newMedia).catch(console.warn);
        broadcastStoreUpdate('finegift_admin_media', newMedia);

        addAuditLog('Media Uploaded', `Uploaded image: "${file.name}" (${newMedia.size})`);
        showNotification('success', 'Media Uploaded', `"${file.name}" added to media library (${newMedia.size}).`);
      } catch (err) {
        showNotification('error', 'Upload Failed', `Could not optimize "${file.name}": ${err.message}`);
      }
    }
  };

  // Delete media item
  const handleDeleteMedia = async (mediaId, mediaName) => {
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

      try {
        await apiDeleteMedia(mediaId);
        broadcastStoreUpdate('finegift_admin_media_deleted', { id: mediaId });
      } catch (delErr) {
        console.warn('Error deleting media from MySQL:', delErr);
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

  // Upload image directly from Product modal with client-side compression
  const handleProductModalUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Invalid File', 'Please upload a valid image file (PNG, JPG, WebP, AVIF).');
      return;
    }

    try {
      showNotification('info', 'Optimizing Image', 'Preparing image for fast loading & web delivery...');
      const { dataUrl, width, height, sizeKb } = await compressImageToDataUrl(file);
      const newMedia = {
        id: 'med_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        name: file.name,
        url: dataUrl,
        size: `${sizeKb} KB`,
        dimensions: `${width} × ${height}`,
        type: file.type,
        category: 'Custom Uploads',
        alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        uploadedAt: 'Just now'
      };

      setMediaAssets((prev) => {
        const updated = [newMedia, ...prev];
        try {
          localStorage.setItem('finegift_admin_media', JSON.stringify(updated.slice(0, 30)));
        } catch {}
        return updated;
      });

      apiSaveMedia(newMedia).catch(console.warn);
      broadcastStoreUpdate('finegift_admin_media', newMedia);

      setProductFormData((prev) => ({ ...prev, image_url: dataUrl }));
      addAuditLog('Media Uploaded', `Attached "${file.name}" (${sizeKb} KB) to product.`);
      showNotification('success', 'Image Attached', `Optimized image (${sizeKb} KB) ready to save.`);
    } catch (err) {
      showNotification('error', 'Image Error', `Could not process image: ${err.message}`);
    }
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
  const [productSubCategoryFilter, setProductSubCategoryFilter] = useState('all');
  const [productSortBy, setProductSortBy] = useState('default'); // 'default' | 'a-z' | 'z-a' | 'price-asc' | 'price-desc'

  // ── 7. MODALS STATE ───────────────────────────────────────────────────
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    cat_name: 'Infants',
    sub_cat_name: '',
    price: 499,
    old_price: 799,
    stock: 25,
    material: 'Wood',
    image_url: '/assets/images/frames.avif',
    description: '',
    is_customizable: true
  });

  // Order Details / Customization Inspection Modal
  const [inspectedOrder, setInspectedOrder] = useState(null);
  const [dispatchAwb, setDispatchAwb] = useState('');

  // Coupon Creation Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponAudienceFilter, setCouponAudienceFilter] = useState('all'); // 'all' | 'storewide' | 'customer'
  const [couponSearch, setCouponSearch] = useState('');
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    title: '',
    type: 'percentage',
    value: 15,
    minOrder: 499,
    targetCustomerId: 'all'
  });

  // Customer-Specific Promo Code Management Modal
  const [selectedCustomerForPromo, setSelectedCustomerForPromo] = useState(null);
  const [isCustomerPromoModalOpen, setIsCustomerPromoModalOpen] = useState(false);
  const [customerPromoFormData, setCustomerPromoFormData] = useState({
    code: '',
    title: 'Exclusive VIP Perk',
    type: 'percentage',
    value: 20,
    minOrder: 499
  });

  // ── 5C. STATE FOR HOMEPAGE CMS WORKSPACE ─────────────────────────────
  const [localHomeContent, setLocalHomeContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_home_content');
      if (saved) return JSON.parse(saved);
      if (homeContent) return homeContent;
      return DEFAULT_HOME_CONTENT;
    } catch {
      return homeContent || DEFAULT_HOME_CONTENT;
    }
  });

  useEffect(() => {
    if (homeContent) {
      setLocalHomeContent(homeContent);
    }
  }, [homeContent]);

  // CMS active subtab: 'visibility' | 'hero' | 'promo' | 'featured-deals' | 'banners' | 'whychoose' | 'collections-reviews'
  const [cmsSubTab, setCmsSubTab] = useState('visibility');
  const [isHomeSaving, setIsHomeSaving] = useState(false);
  const [heroImagePickerIdx, setHeroImagePickerIdx] = useState(null);

  const handleUpdateVisibility = (key, val) => {
    setLocalHomeContent((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: val
      }
    }));
  };

  const handleUpdateHeroSlide = (index, field, val) => {
    setLocalHomeContent((prev) => {
      const updatedSlides = [...(prev.hero?.slides || [])];
      updatedSlides[index] = {
        ...updatedSlides[index],
        [field]: val
      };
      return {
        ...prev,
        hero: {
          ...prev.hero,
          slides: updatedSlides
        }
      };
    });
  };

  const handleUpdatePromoCard = (cardKey, field, val) => {
    setLocalHomeContent((prev) => ({
      ...prev,
      promoBanners: {
        ...prev.promoBanners,
        [cardKey]: {
          ...prev.promoBanners?.[cardKey],
          [field]: val
        }
      }
    }));
  };

  const handleUpdateSectionField = (section, field, val) => {
    setLocalHomeContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: val
      }
    }));
  };

  const handleUpdateWhyFeature = (index, field, val) => {
    setLocalHomeContent((prev) => {
      const features = [...(prev.whyChoose?.features || [])];
      features[index] = {
        ...features[index],
        [field]: val
      };
      return {
        ...prev,
        whyChoose: {
          ...prev.whyChoose,
          features
        }
      };
    });
  };

  const handleSaveHomeContent = (e) => {
    if (e) e.preventDefault();
    setIsHomeSaving(true);
    try {
      localStorage.setItem('finegift_home_content', JSON.stringify(localHomeContent));
      if (onUpdateHomeContent) {
        onUpdateHomeContent(localHomeContent);
      }
      addAuditLog('Homepage CMS Updated', 'Published live updates for homepage sections and copy.');
      showNotification('success', 'Changes Published!', 'Homepage sections and content have been updated live.');
    } catch {
      showNotification('error', 'Save Failed', 'Could not save homepage content.');
    } finally {
      setTimeout(() => setIsHomeSaving(false), 300);
    }
  };

  const handleResetHomeContent = () => {
    if (window.confirm('Reset all homepage sections, headings, banners, and copy back to factory default?')) {
      setLocalHomeContent(DEFAULT_HOME_CONTENT);
      localStorage.setItem('finegift_home_content', JSON.stringify(DEFAULT_HOME_CONTENT));
      if (onUpdateHomeContent) {
        onUpdateHomeContent(DEFAULT_HOME_CONTENT);
      }
      addAuditLog('Homepage CMS Reset', 'Restored default homepage content & sections.');
      showNotification('info', 'Reset Complete', 'Homepage content restored to studio defaults.');
    }
  };

  // ── 5D. STATE FOR ABOUT US PAGE CMS WORKSPACE ─────────────────────────
  const [localAboutContent, setLocalAboutContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_about_content');
      if (saved) return JSON.parse(saved);
      if (aboutContent) return aboutContent;
      return DEFAULT_ABOUT_CONTENT;
    } catch {
      return aboutContent || DEFAULT_ABOUT_CONTENT;
    }
  });

  useEffect(() => {
    if (aboutContent) {
      setLocalAboutContent(aboutContent);
    }
  }, [aboutContent]);

  // Sub-tab for About CMS: 'visibility' | 'hero' | 'story' | 'stats' | 'process' | 'values' | 'cta'
  const [aboutSubTab, setAboutSubTab] = useState('visibility');
  const [isAboutSaving, setIsAboutSaving] = useState(false);
  const [aboutImagePickerField, setAboutImagePickerField] = useState(null); // 'hero' | 'img1' | 'img2' | 'img3'

  const handleUpdateAboutVisibility = (key, val) => {
    setLocalAboutContent((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: val
      }
    }));
  };

  const handleUpdateAboutHero = (field, val) => {
    setLocalAboutContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: val
      }
    }));
  };

  const handleUpdateAboutHighlight = (index, field, val) => {
    setLocalAboutContent((prev) => {
      const updated = [...(prev.highlights || [])];
      updated[index] = {
        ...updated[index],
        [field]: val
      };
      return {
        ...prev,
        highlights: updated
      };
    });
  };

  const handleUpdateAboutStory = (field, val) => {
    setLocalAboutContent((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        [field]: val
      }
    }));
  };

  const handleUpdateAboutStat = (index, field, val) => {
    setLocalAboutContent((prev) => {
      const updated = [...(prev.stats || [])];
      updated[index] = {
        ...updated[index],
        [field]: val
      };
      return {
        ...prev,
        stats: updated
      };
    });
  };

  const handleUpdateAboutProcessHeader = (field, val) => {
    setLocalAboutContent((prev) => ({
      ...prev,
      process: {
        ...prev.process,
        [field]: val
      }
    }));
  };

  const handleUpdateAboutProcessStep = (index, field, val) => {
    setLocalAboutContent((prev) => {
      const steps = [...(prev.process?.steps || [])];
      steps[index] = {
        ...steps[index],
        [field]: val
      };
      return {
        ...prev,
        process: {
          ...prev.process,
          steps
        }
      };
    });
  };

  const handleUpdateAboutValuesHeader = (field, val) => {
    setLocalAboutContent((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: val
      }
    }));
  };

  const handleUpdateAboutValuePillar = (index, field, val) => {
    setLocalAboutContent((prev) => {
      const pillars = [...(prev.values?.pillars || [])];
      pillars[index] = {
        ...pillars[index],
        [field]: val
      };
      return {
        ...prev,
        values: {
          ...prev.values,
          pillars
        }
      };
    });
  };

  const handleUpdateAboutCta = (field, val) => {
    setLocalAboutContent((prev) => ({
      ...prev,
      cta: {
        ...prev.cta,
        [field]: val
      }
    }));
  };

  const handleSaveAboutContent = (e) => {
    if (e) e.preventDefault();
    setIsAboutSaving(true);
    try {
      localStorage.setItem('finegift_about_content', JSON.stringify(localAboutContent));
      if (onUpdateAboutContent) {
        onUpdateAboutContent(localAboutContent);
      }
      addAuditLog('About Us CMS Updated', 'Published live updates for About Us page story, metrics, and copy.');
      showNotification('success', 'Changes Published!', 'About Us page content updated live.');
    } catch {
      showNotification('error', 'Save Failed', 'Could not save About Us content.');
    } finally {
      setTimeout(() => setIsAboutSaving(false), 300);
    }
  };

  const handleResetAboutContent = () => {
    if (window.confirm('Reset all About Us story, headlines, numbers, and process steps back to default?')) {
      setLocalAboutContent(DEFAULT_ABOUT_CONTENT);
      localStorage.setItem('finegift_about_content', JSON.stringify(DEFAULT_ABOUT_CONTENT));
      if (onUpdateAboutContent) {
        onUpdateAboutContent(DEFAULT_ABOUT_CONTENT);
      }
      addAuditLog('About Us CMS Reset', 'Restored default About Us page content & sections.');
      showNotification('info', 'Reset Complete', 'About Us content restored to studio defaults.');
    }
  };

  // ── 5E. STATE FOR CONTACT US PAGE CMS WORKSPACE ───────────────────────
  const [localContactContent, setLocalContactContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_contact_content');
      if (saved) return JSON.parse(saved);
      if (contactContent) return contactContent;
      return DEFAULT_CONTACT_CONTENT;
    } catch {
      return contactContent || DEFAULT_CONTACT_CONTENT;
    }
  });

  useEffect(() => {
    if (contactContent) {
      setLocalContactContent(contactContent);
    }
  }, [contactContent]);

  // Sub-tab for Contact CMS: 'visibility' | 'channels' | 'hero-form' | 'sidebar' | 'workshop'
  const [contactSubTab, setContactSubTab] = useState('visibility');
  const [isContactSaving, setIsContactSaving] = useState(false);

  const handleUpdateContactVisibility = (key, val) => {
    setLocalContactContent((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: val
      }
    }));
  };

  const handleUpdateContactHero = (field, val) => {
    setLocalContactContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: val
      }
    }));
  };

  const handleUpdateContactChannels = (field, val) => {
    setLocalContactContent((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [field]: val
      }
    }));
  };

  const handleUpdateContactForm = (field, val) => {
    setLocalContactContent((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: val
      }
    }));
  };

  const handleUpdateContactPrompt = (index, val) => {
    setLocalContactContent((prev) => {
      const prompts = [...(prev.form?.prompts || [])];
      prompts[index] = val;
      return {
        ...prev,
        form: {
          ...prev.form,
          prompts
        }
      };
    });
  };

  const handleUpdateContactSidebar = (cardKey, field, val) => {
    setLocalContactContent((prev) => ({
      ...prev,
      sidebar: {
        ...prev.sidebar,
        [cardKey]: {
          ...prev.sidebar?.[cardKey],
          [field]: val
        }
      }
    }));
  };

  const handleUpdateContactWorkshop = (field, val) => {
    setLocalContactContent((prev) => ({
      ...prev,
      workshop: {
        ...prev.workshop,
        [field]: val
      }
    }));
  };

  const handleUpdateContactPerk = (index, val) => {
    setLocalContactContent((prev) => {
      const perks = [...(prev.workshop?.perks || [])];
      perks[index] = val;
      return {
        ...prev,
        workshop: {
          ...prev.workshop,
          perks
        }
      };
    });
  };

  const handleUpdateContactPill = (index, val) => {
    setLocalContactContent((prev) => {
      const pills = [...(prev.workshop?.pills || [])];
      pills[index] = val;
      return {
        ...prev,
        workshop: {
          ...prev.workshop,
          pills
        }
      };
    });
  };

  const handleSaveContactContent = (e) => {
    if (e) e.preventDefault();
    setIsContactSaving(true);
    try {
      localStorage.setItem('finegift_contact_content', JSON.stringify(localContactContent));
      if (onUpdateContactContent) {
        onUpdateContactContent(localContactContent);
      }
      addAuditLog('Contact Us CMS Updated', 'Published live updates for Contact Us page channels, addresses, and concierge details.');
      showNotification('success', 'Changes Published!', 'Contact Us page content updated live.');
    } catch {
      showNotification('error', 'Save Failed', 'Could not save Contact Us content.');
    } finally {
      setTimeout(() => setIsContactSaving(false), 300);
    }
  };

  const handleResetContactContent = () => {
    if (window.confirm('Reset all Contact Us channels, phone numbers, addresses, and inquiry copy back to default?')) {
      setLocalContactContent(DEFAULT_CONTACT_CONTENT);
      localStorage.setItem('finegift_contact_content', JSON.stringify(DEFAULT_CONTACT_CONTENT));
      if (onUpdateContactContent) {
        onUpdateContactContent(DEFAULT_CONTACT_CONTENT);
      }
      addAuditLog('Contact Us CMS Reset', 'Restored default Contact Us page content & channels.');
      showNotification('info', 'Reset Complete', 'Contact Us content restored to studio defaults.');
    }
  };

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
      cat_name: localCategories[0]?.name || 'Infants',
      sub_cat_name: '',
      price: 499,
      old_price: 799,
      stock: 30,
      material: 'Wood',
      image_url: '/assets/images/frames.avif',
      fallback_image_url: '',
      badge: '',
      description: 'Handcrafted personalized studio gift made to order with laser engraving.',
      is_customizable: true,
      in_stock: true,
      show_on_home: true
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name || '',
      cat_name: prod.cat_name || 'Infants',
      sub_cat_name: prod.sub_cat_name || '',
      price: prod.price || 0,
      old_price: prod.old_price || 0,
      stock: prod.stock || 25,
      material: prod.material || 'Ceramic',
      image_url: prod.image_url || '/assets/images/cups-product.avif',
      fallback_image_url: prod.fallback_image_url || '',
      badge: prod.badge || '',
      description: prod.description || '',
      is_customizable: prod.is_customizable !== false,
      in_stock: prod.in_stock !== false && prod.in_stock !== 0,
      show_on_home: prod.show_on_home !== false && prod.show_on_home !== 0
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productFormData.name.trim()) {
      showNotification('error', 'Validation Error', 'Product title cannot be empty.');
      return;
    }

    const payload = {
      ...(editingProduct || {}),
      ...productFormData,
      sub_cat_name: productFormData.sub_cat_name ? productFormData.sub_cat_name.trim() : null,
      price: Number(productFormData.price),
      old_price: Number(productFormData.old_price),
      in_stock: productFormData.in_stock !== false && productFormData.in_stock !== 0,
      show_on_home: productFormData.show_on_home !== false && productFormData.show_on_home !== 0
    };

    let updatedList;
    if (editingProduct) {
      updatedList = localProducts.map((p) =>
        p.id === editingProduct.id
          ? { ...p, ...payload }
          : p
      );
      addAuditLog('Product Updated', `Edited "${payload.name}" (₹${payload.price})`);
      showNotification('success', 'Product Updated', `Saved changes to "${payload.name}".`);
    } else {
      const newProd = {
        id: Date.now(),
        ...payload,
        rating: 5.0,
        reviews_count: 0,
        is_new: true,
        is_bestseller: false,
        in_stock: true,
        fast_delivery: true
      };
      updatedList = [newProd, ...localProducts];
      addAuditLog('Product Created', `Added new product "${payload.name}"`);
      showNotification('success', 'Product Created', `"${payload.name}" added to catalog.`);
    }

    // Protect against background sync clobbering this update
    lastLocalProductSaveRef.current = Date.now();

    setLocalProducts(updatedList);
    if (onUpdateProducts) onUpdateProducts(updatedList);
    safeSaveProductsCache(updatedList);
    broadcastStoreUpdate('finegift_admin_products', updatedList);
    setIsProductModalOpen(false);

    try {
      if (editingProduct) {
        await apiUpdateProduct(editingProduct.id, payload);
      } else {
        const createdItem = updatedList[0];
        if (createdItem) await apiSaveProduct(createdItem);
      }
    } catch (saveErr) {
      console.warn('Backend product save notice:', saveErr);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from the public store?`)) {
      const filtered = localProducts.filter((p) => p.id !== productId);
      lastLocalProductSaveRef.current = Date.now();
      setLocalProducts(filtered);
      if (onUpdateProducts) onUpdateProducts(filtered);
      safeSaveProductsCache(filtered);
      broadcastStoreUpdate('finegift_admin_products', filtered);
      addAuditLog('Product Removed', `Removed "${productName}" from catalog.`);
      showNotification('info', 'Product Removed', `"${productName}" has been removed.`);

      try {
        await apiDeleteProduct(productId);
      } catch (delErr) {
        console.warn('Backend product delete notice:', delErr);
      }
    }
  };

  // ── 9B. CATEGORY CRUD ACTIONS ─────────────────────────────────────────
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      icon: 'fa-solid fa-gift',
      subcategories: '',
      image_url: '/assets/images/cups-product.avif'
    });
    setCategoryImageTab('library');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    const subStr = Array.isArray(cat.subcategories) ? cat.subcategories.join(', ') : (cat.subcategories || '');
    setCategoryFormData({
      name: cat.name || '',
      icon: cat.icon || 'fa-solid fa-gift',
      subcategories: subStr,
      image_url: cat.image_url || cat.image || '/assets/images/cups-product.avif'
    });
    setCategoryImageTab('library');
    setIsCategoryModalOpen(true);
  };

  // Upload image directly from Category modal
  const handleCategoryModalUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Invalid File', 'Please upload a valid image file (PNG, JPG, WebP, AVIF).');
      return;
    }

    try {
      showNotification('info', 'Optimizing Image', 'Preparing category image for fast loading...');
      const { dataUrl, width, height, sizeKb } = await compressImageToDataUrl(file);
      const newMedia = {
        id: 'med_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        name: file.name,
        url: dataUrl,
        size: `${sizeKb} KB`,
        dimensions: `${width} × ${height}`,
        type: file.type,
        category: 'Studio Assets',
        alt: `${categoryFormData.name || 'Category'} Cover`,
        uploadedAt: 'Just now'
      };

      setCategoryFormData((prev) => ({ ...prev, image_url: dataUrl }));
      setMediaAssets((prev) => [newMedia, ...prev]);
      apiSaveMedia(newMedia).catch(console.warn);
      broadcastStoreUpdate('finegift_admin_media', newMedia);
      showNotification('success', 'Image Attached', `Category image attached (${sizeKb} KB).`);
    } catch (err) {
      showNotification('error', 'Image Error', `Could not process image: ${err.message}`);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      showNotification('error', 'Validation Error', 'Category title cannot be empty.');
      return;
    }

    const subStr = categoryFormData.subcategories && categoryFormData.subcategories.trim() ? categoryFormData.subcategories.trim() : null;
    const imgUrl = categoryFormData.image_url && categoryFormData.image_url.trim() ? categoryFormData.image_url.trim() : '/assets/images/cups-product.avif';

    const categoryPayload = {
      ...(editingCategory || {}),
      name: categoryFormData.name.trim(),
      icon: (categoryFormData.icon || 'fa-solid fa-gift').trim(),
      subcategories: subStr,
      image_url: imgUrl,
      image: imgUrl
    };

    let updatedList;
    if (editingCategory) {
      updatedList = localCategories.map((c) =>
        c.id === editingCategory.id ? { ...c, ...categoryPayload } : c
      );
      addAuditLog('Category Updated', `Updated category "${categoryPayload.name}" with cover image`);
      showNotification('success', 'Category Updated', `Saved changes to "${categoryPayload.name}".`);
    } else {
      const newCat = {
        id: Date.now(),
        ...categoryPayload
      };
      updatedList = [...localCategories, newCat];
      addAuditLog('Category Created', `Added new category "${newCat.name}" with cover image`);
      showNotification('success', 'Category Created', `"${newCat.name}" added to catalog.`);
    }

    setLocalCategories(updatedList);
    try {
      localStorage.setItem('finegift_admin_categories', JSON.stringify(updatedList));
      broadcastStoreUpdate('finegift_admin_categories', updatedList);
    } catch {}

    if (onUpdateCategories) onUpdateCategories(updatedList);
    setIsCategoryModalOpen(false);

    try {
      if (editingCategory) {
        await apiUpdateCategory(editingCategory.id, categoryPayload);
      } else {
        const createdCat = updatedList[updatedList.length - 1];
        if (createdCat) await apiSaveCategory(createdCat);
      }
    } catch (saveErr) {
      console.warn('Backend category save notice:', saveErr);
    }
  };

  const handleDeleteCategory = (catId, catName) => {
    const hasProducts = localProducts.some(
      (p) => (p.cat_name || '').toLowerCase() === catName.toLowerCase()
    );
    if (hasProducts) {
      if (!window.confirm(`Warning: Products are currently assigned to "${catName}". Are you sure you want to delete this category?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
        return;
      }
    }

    const filtered = localCategories.filter((c) => c.id !== catId);
    setLocalCategories(filtered);
    try {
      localStorage.setItem('finegift_admin_categories', JSON.stringify(filtered));
    } catch {}
    apiDeleteCategory(catId).catch(console.warn);
    if (onUpdateCategories) onUpdateCategories(filtered);
    addAuditLog('Category Removed', `Deleted category "${catName}"`);
    showNotification('info', 'Category Removed', `"${catName}" has been deleted.`);
  };

  // ── 10. ORDER STATUS ADVANCEMENT ──────────────────────────────────────
  const handleUpdateOrderStatus = (orderId, newStatus, awbCode = '') => {
    const awb = awbCode || `AWB-${Math.floor(100000 + Math.random() * 900000)}`;
    const updated = localOrders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: newStatus,
          awb: awbCode || ord.awb || awb,
          courier: ord.courier || 'BlueDart Express'
        };
      }
      return ord;
    });

    setLocalOrders(updated);
    try {
      localStorage.setItem('finegift_orders', JSON.stringify(updated));
      broadcastStoreUpdate('finegift_orders', updated);
    } catch {}
    apiUpdateOrderStatus(orderId, { status: newStatus, awb, courier: 'BlueDart Express' }).catch(console.warn);
    if (onUpdateOrders) onUpdateOrders(updated);
    addAuditLog('Order Status Updated', `Order #${orderId} moved to "${newStatus}"`);
    showNotification('success', 'Status Updated', `Order #${orderId} marked as ${newStatus}.`);
    if (inspectedOrder && inspectedOrder.id === orderId) {
      setInspectedOrder({ ...inspectedOrder, status: newStatus });
    }
  };

  // ── 11. COUPON & CUSTOMER PROMO ACTIONS ──────────────────────────────
  const handleToggleCoupon = (couponId) => {
    let target = null;
    const updated = coupons.map((c) => {
      if (c.id === couponId) {
        target = { ...c, active: !c.active };
        return target;
      }
      return c;
    });
    setCoupons(updated);
    try {
      localStorage.setItem('finegift_admin_coupons', JSON.stringify(updated));
    } catch {}
    if (target) {
      apiUpdateCoupon(couponId, { active: target.active, status: target.active ? 'active' : 'disabled' }).catch(console.warn);
      addAuditLog('Coupon Updated', `${target.code} set to ${target.active ? 'Active' : 'Disabled'}`);
      showNotification('info', 'Promo Code Updated', `Code "${target.code}" is now ${target.active ? 'active' : 'disabled'}.`);
    }
  };

  const handleDeleteCoupon = (couponId, code) => {
    if (!window.confirm(`Are you sure you want to permanently delete promo code "${code}"?`)) return;
    const updated = coupons.filter((c) => c.id !== couponId);
    setCoupons(updated);
    try {
      localStorage.setItem('finegift_admin_coupons', JSON.stringify(updated));
    } catch {}
    apiDeleteCoupon(couponId).catch(console.warn);
    addAuditLog('Coupon Deleted', `Removed promo code ${code}`);
    showNotification('success', 'Promo Code Deleted', `Code "${code}" removed.`);
  };

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    if (!couponFormData.code.trim()) return;
    const code = couponFormData.code.trim().toUpperCase();

    // Check if code already exists
    if (coupons.some((c) => c.code === code)) {
      alert(`Promo code "${code}" already exists in your store.`);
      return;
    }

    let targetCust = null;
    if (couponFormData.targetCustomerId && couponFormData.targetCustomerId !== 'all') {
      targetCust = customers.find((c) => c.id === couponFormData.targetCustomerId);
    }

    const newCoupon = {
      id: 'cp_' + Date.now(),
      code,
      title: couponFormData.title.trim() || (targetCust ? `VIP Exclusive for ${targetCust.name}` : 'Store Promotion'),
      type: couponFormData.type,
      value: Number(couponFormData.value),
      minOrder: Number(couponFormData.minOrder) || 0,
      uses: 0,
      active: true,
      customerId: targetCust ? targetCust.id : null,
      customerEmail: targetCust ? targetCust.email : null,
      customerName: targetCust ? targetCust.name : null,
      assignedAt: new Date().toISOString()
    };

    const updated = [newCoupon, ...coupons];
    setCoupons(updated);
    try {
      localStorage.setItem('finegift_admin_coupons', JSON.stringify(updated));
    } catch {}
    apiSaveCoupon(newCoupon).catch(console.warn);
    addAuditLog(
      'Coupon Created',
      targetCust
        ? `Assigned exclusive code ${newCoupon.code} (${newCoupon.value}${newCoupon.type === 'percentage' ? '%' : '₹'} OFF) to ${targetCust.name}`
        : `Published storewide promo code ${newCoupon.code}`
    );
    showNotification(
      'success',
      'Promo Code Activated',
      targetCust
        ? `Exclusive code "${newCoupon.code}" assigned to ${targetCust.name}.`
        : `Public promo code "${newCoupon.code}" is now active.`
    );
    setIsCouponModalOpen(false);
    setCouponFormData({
      code: '',
      title: '',
      type: 'percentage',
      value: 15,
      minOrder: 499,
      targetCustomerId: 'all'
    });
  };

  // ── CUSTOMER SPECIFIC PROMO MODAL ACTIONS ────────────────────────────
  const handleOpenCustomerPromo = (customer) => {
    setSelectedCustomerForPromo(customer);
    const firstName = (customer.name || 'VIP').trim().split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
    const randomSuffix = [15, 20, 25, 50, 100][Math.floor(Math.random() * 5)];
    setCustomerPromoFormData({
      code: `${firstName || 'VIP'}${randomSuffix}`,
      title: `${customer.role === 'vip' ? 'Gold VIP Member Reward' : 'Exclusive Studio Gift Voucher'}`,
      type: randomSuffix >= 50 ? 'flat' : 'percentage',
      value: randomSuffix,
      minOrder: randomSuffix >= 50 ? 999 : 499
    });
    setIsCustomerPromoModalOpen(true);
  };

  const handleGenerateCustomerCode = (customer) => {
    const firstName = (customer?.name || 'VIP').trim().split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
    const perks = [10, 15, 20, 25, 30, 50, 100, 200];
    const val = perks[Math.floor(Math.random() * perks.length)];
    const isFlat = val >= 50;
    setCustomerPromoFormData((prev) => ({
      ...prev,
      code: `${firstName || 'VIP'}${val}`,
      type: isFlat ? 'flat' : 'percentage',
      value: val,
      minOrder: isFlat ? (val === 200 ? 1499 : 999) : 499
    }));
  };

  const handleSaveCustomerPromo = (e) => {
    e.preventDefault();
    if (!selectedCustomerForPromo) return;
    const code = customerPromoFormData.code.trim().toUpperCase();
    if (!code) return;

    if (coupons.some((c) => c.code === code)) {
      alert(`Promo code "${code}" already exists. Please choose or generate another code.`);
      return;
    }

    const newPromo = {
      id: `cp_cust_${Date.now()}`,
      code,
      title: customerPromoFormData.title.trim() || `Exclusive VIP Voucher for ${selectedCustomerForPromo.name}`,
      type: customerPromoFormData.type,
      value: Number(customerPromoFormData.value),
      minOrder: Number(customerPromoFormData.minOrder) || 0,
      uses: 0,
      active: true,
      customerId: selectedCustomerForPromo.id,
      customerEmail: selectedCustomerForPromo.email,
      customerName: selectedCustomerForPromo.name,
      assignedAt: new Date().toISOString()
    };

    const updated = [newPromo, ...coupons];
    setCoupons(updated);
    try {
      localStorage.setItem('finegift_admin_coupons', JSON.stringify(updated));
    } catch {}
    apiSaveCoupon(newPromo).catch(console.warn);
    addAuditLog('Customer Promo Issued', `Assigned code ${newPromo.code} to ${selectedCustomerForPromo.name} (${selectedCustomerForPromo.email})`);
    showNotification('success', 'Promo Code Assigned', `Code "${newPromo.code}" is now active and ready for ${selectedCustomerForPromo.name}.`);

    // Reset code field with fresh suggestion for next entry
    handleGenerateCustomerCode(selectedCustomerForPromo);
  };

  const handleDeleteCustomerPromo = (promoId, code) => {
    if (!window.confirm(`Remove promo code "${code}" from this customer?`)) return;
    const updated = coupons.filter((c) => c.id !== promoId);
    setCoupons(updated);
    try {
      localStorage.setItem('finegift_admin_coupons', JSON.stringify(updated));
    } catch {}
    apiDeleteCoupon(promoId).catch(console.warn);
    addAuditLog('Customer Promo Removed', `Deleted promo code ${code}`);
    showNotification('success', 'Promo Removed', `Promo code "${code}" has been deleted.`);
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

  const filteredCoupons = useMemo(() => {
    return coupons.filter((cp) => {
      if (couponAudienceFilter === 'storewide' && (cp.customerId || cp.customerEmail)) {
        return false;
      }
      if (couponAudienceFilter === 'customer' && !cp.customerId && !cp.customerEmail) {
        return false;
      }
      if (couponSearch.trim()) {
        const q = couponSearch.toLowerCase();
        const matchCode = (cp.code || '').toLowerCase().includes(q);
        const matchTitle = (cp.title || '').toLowerCase().includes(q);
        const matchCust =
          (cp.customerName || '').toLowerCase().includes(q) ||
          (cp.customerEmail || '').toLowerCase().includes(q);
        return matchCode || matchTitle || matchCust;
      }
      return true;
    });
  }, [coupons, couponAudienceFilter, couponSearch]);

  // Available subcategories for Admin toolbar filter
  const adminAvailableSubcategories = useMemo(() => {
    if (productCategoryFilter === 'all') {
      const set = new Set();
      localProducts.forEach((p) => {
        if (p.sub_cat_name) set.add(p.sub_cat_name);
      });
      return Array.from(set);
    }
    const catObj = localCategories.find((c) => c.name.toLowerCase() === productCategoryFilter.toLowerCase());
    if (!catObj) return [];
    if (Array.isArray(catObj.subcategories)) return catObj.subcategories;
    if (typeof catObj.subcategories === 'string' && catObj.subcategories.trim()) {
      return catObj.subcategories.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (catObj.name.toLowerCase() === 'infants') return ['Boys', 'Girls'];
    return [];
  }, [localCategories, localProducts, productCategoryFilter]);

  const filteredProducts = useMemo(() => {
    return localProducts.filter((prod) => {
      if (productCategoryFilter !== 'all') {
        const catMatch = (prod.cat_name || '').toLowerCase() === productCategoryFilter.toLowerCase();
        if (!catMatch) return false;
      }
      if (productSubCategoryFilter !== 'all') {
        const subMatch = (prod.sub_cat_name || '').toLowerCase() === productSubCategoryFilter.toLowerCase();
        if (!subMatch) return false;
      }
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return (
          (prod.name || '').toLowerCase().includes(q) ||
          (prod.cat_name || '').toLowerCase().includes(q) ||
          (prod.sub_cat_name || '').toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (productSortBy === 'a-z') return (a.name || '').localeCompare(b.name || '');
      if (productSortBy === 'z-a') return (b.name || '').localeCompare(a.name || '');
      if (productSortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (productSortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      return 0;
    });
  }, [localProducts, productCategoryFilter, productSubCategoryFilter, productSearch, productSortBy]);

  // ── 12B. CUSTOMER MANAGEMENT CRUD HANDLERS ────────────────────────────
  const saveCustomersList = (updatedList) => {
    setCustomers(updatedList);
    try {
      localStorage.setItem('finegift_registered_users', JSON.stringify(updatedList));
      broadcastStoreUpdate('finegift_registered_users', updatedList);
    } catch (err) {
      console.error('Failed to persist customer list:', err);
    }
  };

  const handleOpenCreateCustomer = () => {
    setEditingCustomer(null);
    setCustomerFormData({
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active',
      walletBalance: 100,
      city: 'Mangalore',
      notes: '',
      newPassword: ''
    });
    setIsCustomerModalOpen(true);
  };

  const handleOpenCreateAdminUser = () => {
    setEditingCustomer(null);
    setCustomerFormData({
      name: '',
      email: '',
      phone: '',
      role: 'admin',
      status: 'active',
      walletBalance: 0,
      city: 'Mangalore',
      notes: 'Store Administrator with full CMS access privileges.',
      newPassword: ''
    });
    setIsCustomerModalOpen(true);
  };

  const handleOpenEditCustomer = (cust) => {
    setEditingCustomer(cust);
    setCustomerFormData({
      name: cust.name || '',
      email: cust.email || '',
      phone: cust.phone || '',
      role: cust.role || 'customer',
      status: cust.status || 'active',
      walletBalance: cust.walletBalance ?? 100,
      city: cust.city || 'Mangalore',
      notes: cust.notes || '',
      newPassword: ''
    });
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    const name = customerFormData.name.trim();
    const email = customerFormData.email.trim().toLowerCase();

    if (!name || name.length < 2) {
      showNotification('error', 'Validation Error', 'Full name must be at least 2 characters.');
      return;
    }
    if (!email || !email.includes('@')) {
      showNotification('error', 'Validation Error', 'A valid email address is required.');
      return;
    }
    if (customerFormData.role === 'admin' && !editingCustomer && !customerFormData.newPassword.trim()) {
      showNotification('error', 'Password Required', 'Please set a secure login password for the new administrator.');
      return;
    }

    let updatedList;
    if (editingCustomer) {
      updatedList = customers.map((c) => {
        if (c.id === editingCustomer.id) {
          const updated = {
            ...c,
            name,
            email,
            phone: customerFormData.phone.trim(),
            role: customerFormData.role,
            status: customerFormData.status,
            walletBalance: Number(customerFormData.walletBalance) || 0,
            city: customerFormData.city.trim(),
            notes: customerFormData.notes.trim(),
            updatedAt: new Date().toISOString()
          };
          if (customerFormData.newPassword.trim()) {
            updated.password = customerFormData.newPassword.trim();
          }
          return updated;
        }
        return c;
      });
      saveCustomersList(updatedList);
      const updatedUserObj = updatedList.find((c) => c.id === editingCustomer.id);
      if (updatedUserObj) apiUpdateUser(editingCustomer.id, updatedUserObj).catch(console.warn);

      if (customerFormData.role === 'admin') {
        addAuditLog('Admin User Updated', `Modified admin profile "${name}" (${email})`);
        showNotification('success', 'Admin Profile Updated', `Admin profile details for ${name} have been updated.`);
      } else {
        addAuditLog('Customer Updated', `Modified client profile "${name}" (${email})`);
        showNotification('success', 'Customer Updated', `Profile details for ${name} have been updated.`);
      }
      if (inspectedCustomer && inspectedCustomer.id === editingCustomer.id) {
        setInspectedCustomer(updatedList.find((c) => c.id === editingCustomer.id));
      }
    } else {
      const duplicate = customers.some((c) => c.email.toLowerCase() === email);
      if (duplicate) {
        showNotification('error', 'Account Exists', `An account with email ${email} already exists.`);
        return;
      }
      const isNewAdmin = customerFormData.role === 'admin';
      const newCustomer = {
        id: isNewAdmin ? `usr_admin_${Date.now()}` : `usr_${Date.now()}`,
        name,
        email,
        phone: customerFormData.phone.trim(),
        role: customerFormData.role,
        status: customerFormData.status,
        provider: 'email',
        walletBalance: Number(customerFormData.walletBalance) || (isNewAdmin ? 0 : 100),
        city: customerFormData.city.trim() || 'Mangalore',
        ordersCount: 0,
        lifetimeSpend: 0,
        notes: customerFormData.notes.trim() || (isNewAdmin ? 'Store Administrator account' : ''),
        password: customerFormData.newPassword.trim() || (isNewAdmin ? 'admin123' : 'welcome123'),
        createdAt: new Date().toISOString()
      };
      updatedList = [newCustomer, ...customers];
      saveCustomersList(updatedList);
      apiSaveUser(newCustomer).catch(console.warn);

      if (isNewAdmin) {
        addAuditLog('Admin User Created', `Registered new store administrator "${name}" (${email})`);
        showNotification('success', 'Admin User Created', `Administrator account for ${name} (${email}) has been created with full CMS access.`);
      } else {
        addAuditLog('Customer Created', `Registered new customer "${name}" (${email})`);
        showNotification('success', 'Customer Created', `New customer ${name} has been added.`);
      }
    }

    setIsCustomerModalOpen(false);
  };

  const handleToggleCustomerStatus = (cust) => {
    if (cust.role === 'admin' && cust.email === (user?.email || 'admin@finegiftstudio.com')) {
      showNotification('error', 'Action Restricted', 'You cannot suspend your own active administrator account.');
      return;
    }
    const newStatus = (cust.status || 'active') === 'active' ? 'suspended' : 'active';
    const updatedList = customers.map((c) =>
      c.id === cust.id ? { ...c, status: newStatus } : c
    );
    saveCustomersList(updatedList);
    apiUpdateUser(cust.id, { ...cust, status: newStatus }).catch(console.warn);
    addAuditLog('Customer Status Toggled', `Set account status for ${cust.name} to "${newStatus.toUpperCase()}"`);
    showNotification(
      newStatus === 'active' ? 'success' : 'warning',
      'Status Changed',
      `Account for ${cust.name} is now ${newStatus}.`
    );
    if (inspectedCustomer && inspectedCustomer.id === cust.id) {
      setInspectedCustomer({ ...inspectedCustomer, status: newStatus });
    }
  };

  const handleQuickRoleChange = (cust, newRole) => {
    const updatedList = customers.map((c) =>
      c.id === cust.id ? { ...c, role: newRole } : c
    );
    saveCustomersList(updatedList);
    apiUpdateUser(cust.id, { ...cust, role: newRole }).catch(console.warn);
    addAuditLog('Customer Role Changed', `Changed role for ${cust.name} to "${newRole.toUpperCase()}"`);
    showNotification('success', 'Role Updated', `${cust.name} is now assigned as "${newRole.toUpperCase()}".`);
    if (inspectedCustomer && inspectedCustomer.id === cust.id) {
      setInspectedCustomer({ ...inspectedCustomer, role: newRole });
    }
  };

  const handlePromptDeleteCustomer = (cust) => {
    if (cust.role === 'admin' && cust.email === (user?.email || 'admin@finegiftstudio.com')) {
      showNotification('error', 'Action Restricted', 'You cannot delete your own active administrator account.');
      return;
    }
    setCustomerToDelete(cust);
    setIsDeleteCustomerModalOpen(true);
  };

  const handleConfirmDeleteCustomer = () => {
    if (!customerToDelete) return;
    const updatedList = customers.filter((c) => c.id !== customerToDelete.id);
    saveCustomersList(updatedList);
    apiDeleteUser(customerToDelete.id).catch(console.warn);
    addAuditLog('Customer Deleted', `Removed customer account "${customerToDelete.name}" (${customerToDelete.email})`);
    showNotification('info', 'Customer Deleted', `Account for ${customerToDelete.name} was removed.`);
    if (inspectedCustomer && inspectedCustomer.id === customerToDelete.id) {
      setInspectedCustomer(null);
    }
    setIsDeleteCustomerModalOpen(false);
    setCustomerToDelete(null);
  };

  const handleExportCustomersCSV = () => {
    if (customers.length === 0) {
      showNotification('error', 'Export Failed', 'No customer records available to export.');
      return;
    }
    const headers = ['Customer ID', 'Full Name', 'Email', 'Phone', 'Role', 'Status', 'Auth Provider', 'Orders Count', 'Lifetime Spend (INR)', 'Wallet Balance (INR)', 'City', 'Created Date', 'Notes'];
    const rows = customers.map((c) => [
      `"${c.id}"`,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${c.email}"`,
      `"${c.phone || ''}"`,
      `"${c.role || 'customer'}"`,
      `"${c.status || 'active'}"`,
      `"${c.provider || 'email'}"`,
      c.ordersCount || 0,
      c.lifetimeSpend || 0,
      c.walletBalance || 0,
      `"${(c.city || '').replace(/"/g, '""')}"`,
      `"${c.createdAt || ''}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fine_gift_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('CSV Export', `Exported ${customers.length} customer records to CSV`);
    showNotification('success', 'CSV Downloaded', `Exported ${customers.length} customer records to CSV.`);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      if (customerRoleFilter !== 'all') {
        const r = (cust.role || 'customer').toLowerCase();
        if (customerRoleFilter === 'staff' || customerRoleFilter === 'coworker') {
          if (r !== 'staff' && r !== 'coworker') return false;
        } else if (r !== customerRoleFilter.toLowerCase()) {
          return false;
        }
      }
      if (customerStatusFilter !== 'all' && (cust.status || 'active').toLowerCase() !== customerStatusFilter.toLowerCase()) {
        return false;
      }
      if (customerProviderFilter !== 'all') {
        const prov = (cust.provider || (cust.email?.includes('gmail') ? 'google' : 'email')).toLowerCase();
        if (prov !== customerProviderFilter.toLowerCase()) return false;
      }
      if (customerSearch.trim()) {
        const q = customerSearch.trim().toLowerCase();
        const matchName = (cust.name || '').toLowerCase().includes(q);
        const matchEmail = (cust.email || '').toLowerCase().includes(q);
        const matchPhone = (cust.phone || '').replace(/\D/g, '').includes(q.replace(/\D/g, ''));
        const matchCity = (cust.city || '').toLowerCase().includes(q);
        const matchNotes = (cust.notes || '').toLowerCase().includes(q);
        return matchName || matchEmail || matchPhone || matchCity || matchNotes;
      }
      return true;
    });
  }, [customers, customerRoleFilter, customerStatusFilter, customerProviderFilter, customerSearch]);

  const customerOrders = useMemo(() => {
    if (!inspectedCustomer) return [];
    const cEmail = (inspectedCustomer.email || '').toLowerCase();
    const cPhone = (inspectedCustomer.phone || '').replace(/\D/g, '');
    return localOrders.filter((ord) => {
      const oEmail = (ord.email || ord.customerEmail || '').toLowerCase();
      const oPhone = (ord.phone || ord.customerPhone || '').replace(/\D/g, '');
      const oName = (ord.customerName || ord.name || '').toLowerCase();
      return (
        (cEmail && oEmail === cEmail) ||
        (cPhone && oPhone && oPhone === cPhone) ||
        (inspectedCustomer.name && oName === inspectedCustomer.name.toLowerCase())
      );
    });
  }, [inspectedCustomer, localOrders]);

  // ── 13. ADMIN LOGIN LOCK SCREEN IF NOT AUTHENTICATED ──────────────────
  if (!isAdminAuthenticated) {
    return (
      <div className="admin-dashboard-wrapper" style={{ justifyContent: 'center', alignItems: 'center', padding: '40px 16px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '440px', width: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '36px', boxShadow: '0 20px 45px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #c40b90, #e7137a)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '28px', color: '#ffffff', boxShadow: '0 8px 24px rgba(184,0,91,0.25)' }}>
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 6px 0', color: '#0f172a' }}>Fine Gift Studio CMS</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>
            Store Management Portal &amp; Customization Production Queue
          </p>

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            {adminLoginError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{adminLoginError}</span>
              </div>
            )}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Admin Email</label>
              <input
                type="email"
                value={adminLoginEmail}
                onChange={(e) => setAdminLoginEmail(e.target.value)}
                required
                className="admin-form-input"
                style={{ width: '100%' }}
                placeholder="e.g. admin@finegiftstudio.com"
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px', display: 'block' }}>Admin Password</label>
              <input
                type="password"
                value={adminLoginPassword}
                onChange={(e) => setAdminLoginPassword(e.target.value)}
                required
                className="admin-form-input"
                style={{ width: '100%' }}
                placeholder="Enter admin password"
              />
            </div>

            <button type="submit" className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '4px', height: '44px' }}>
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
            className="admin-sync-btn"
            onClick={() => fetchCoWorkerUpdates(true)}
            disabled={isSyncing}
            title="Fetch latest updates from co-workers, customers & live storefront"
          >
            <i className={`fa-solid fa-arrows-rotate ${isSyncing ? 'fa-spin' : ''}`}></i>
            <span>{isSyncing ? 'Fetching...' : 'Fetch Live Updates'}</span>
          </button>

          <div
            className="admin-sync-indicator"
            title={`Last checked with co-worker updates: ${lastSyncTime}`}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
                boxShadow: '0 0 0 2px rgba(16,185,129,0.2)'
              }}
            ></span>
            <span>Live · {lastSyncTime}</span>
          </div>

          <div
            className="admin-sync-indicator"
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '4px 10px',
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '11.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Connected to Remote MySQL Database: u432536754_giftdb on srv1827.hstgr.io:3306"
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#16a34a',
                display: 'inline-block',
                boxShadow: '0 0 0 2px rgba(22,163,74,0.2)'
              }}
            ></span>
            <span><i className="fa-solid fa-database" style={{ marginRight: '3px' }}></i> MySQL Online</span>
          </div>

          <button
            type="button"
            className="admin-view-store-btn"
            onClick={() => onNavigate('/')}
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            <span>View Public Store</span>
          </button>

          <button
            type="button"
            className="admin-btn-primary"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderColor: '#d97706',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(217, 119, 6, 0.2)'
            }}
            onClick={handleOpenCreateAdminUser}
            title="Create a new Store Administrator account"
          >
            <i className="fa-solid fa-user-shield"></i>
            <span>+ Add Admin</span>
          </button>

          <div className="admin-admin-profile">
            <div className="admin-avatar">
              {currentAdminUser?.name ? currentAdminUser.name.charAt(0).toUpperCase() : (user?.name ? user.name.charAt(0).toUpperCase() : 'A')}
            </div>
            <div className="admin-profile-info">
              <span className="admin-profile-name">{currentAdminUser?.name || user?.name || 'Store Director'}</span>
              <span className="admin-profile-role">{currentAdminUser?.role === 'admin' ? 'Store Administrator' : 'Super Admin'}</span>
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

            <div className="admin-nav-section-title">Storefront &amp; Design</div>
            <ul className="admin-nav-list">
              <li>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === 'home-cms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('home-cms')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-pen-ruler" style={{ color: '#c40b90' }}></i>
                    <span>Homepage CMS &amp; Sections</span>
                  </span>
                  <span className="admin-nav-badge" style={{ background: '#7d2091', color: '#fff' }}>Live</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === 'about-cms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('about-cms')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-heart-pulse" style={{ color: '#e7137a' }}></i>
                    <span>About Page CMS &amp; Story</span>
                  </span>
                  <span className="admin-nav-badge" style={{ background: '#c40b90', color: '#fff' }}>Edit</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`admin-nav-btn ${activeTab === 'contact-cms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('contact-cms')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-headset" style={{ color: '#0d97d5' }}></i>
                    <span>Contact Page CMS &amp; Desk</span>
                  </span>
                  <span className="admin-nav-badge" style={{ background: '#0d97d5', color: '#fff' }}>Live</span>
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
                  className={`admin-nav-btn ${activeTab === 'admins' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admins')}
                >
                  <span className="admin-nav-btn-left">
                    <i className="fa-solid fa-user-shield" style={{ color: '#f59e0b' }}></i>
                    <span>Store Administrators</span>
                  </span>
                  <span className="admin-nav-badge" style={{ background: '#f59e0b', color: '#fff', fontWeight: 700 }}>
                    {customers.filter((c) => c.role === 'admin').length || 1}
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
                    <i className="fa-solid fa-chart-pie" style={{ color: '#c40b90' }}></i> Executive Overview
                  </h1>
                  <p className="admin-page-subtitle">Real-time store metrics, customization queue, and inventory alerts.</p>
                </div>
                <div className="admin-page-actions">
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleOpenCreateAdminUser}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      borderColor: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
                    }}
                    title="Create a new Store Administrator account"
                  >
                    <i className="fa-solid fa-user-shield"></i>
                    <span>+ Add Admin Account</span>
                  </button>
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
                    <i className="fa-solid fa-bolt" style={{ color: '#f9b228' }}></i> Immediate Order Actions &amp; Work Queue
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
                    <i className="fa-solid fa-box-archive" style={{ color: '#c40b90' }}></i> Orders &amp; Customization Production
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
                                  <span style={{ color: '#f9b228', display: 'block', fontSize: '11px', fontWeight: 700 }}>
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
                    <i className="fa-solid fa-cubes" style={{ color: '#c40b90' }}></i> Product Catalog &amp; Inventory
                  </h1>
                  <p className="admin-page-subtitle">Add new bespoke gifts, adjust prices, edit descriptions, and control inventory.</p>
                </div>
                <div className="admin-page-actions" style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => fetchCoWorkerUpdates(true)}
                    disabled={isSyncing}
                    title="Fetch latest product catalog updates from co-workers"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className={`fa-solid fa-arrows-rotate ${isSyncing ? 'fa-spin' : ''}`} style={{ color: '#c40b90' }}></i>
                    <span>Fetch Updates</span>
                  </button>
                  <button type="button" className="admin-btn-primary" onClick={handleOpenAddProduct}>
                    <i className="fa-solid fa-plus"></i> Add New Product
                  </button>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-panel-header">
                  <div className="admin-panel-toolbar" style={{ flexWrap: 'wrap', gap: '8px' }}>
                    <input
                      type="text"
                      className="admin-search-input"
                      placeholder="Search title, category, subcategory..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                    <select
                      className="admin-filter-select"
                      value={productCategoryFilter}
                      onChange={(e) => {
                        setProductCategoryFilter(e.target.value);
                        setProductSubCategoryFilter('all');
                      }}
                    >
                      <option value="all">All Categories</option>
                      {localCategories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>

                    {adminAvailableSubcategories.length > 0 && (
                      <select
                        className="admin-filter-select"
                        value={productSubCategoryFilter}
                        onChange={(e) => setProductSubCategoryFilter(e.target.value)}
                        style={{ border: '1px solid #c40b90', color: '#c40b90', fontWeight: 600 }}
                      >
                        <option value="all">All Subcategories</option>
                        {adminAvailableSubcategories.map((sub) => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    )}

                    <select
                      className="admin-filter-select"
                      value={productSortBy}
                      onChange={(e) => setProductSortBy(e.target.value)}
                      title="Sort Products"
                    >
                      <option value="default">Default Order</option>
                      <option value="a-z">Alphabetical: A to Z</option>
                      <option value="z-a">Alphabetical: Z to A</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>

                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => setProductSortBy(productSortBy === 'a-z' ? 'default' : 'a-z')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: productSortBy === 'a-z' ? '#fdf2f8' : undefined,
                        borderColor: productSortBy === 'a-z' ? '#c40b90' : undefined,
                        color: productSortBy === 'a-z' ? '#c40b90' : undefined
                      }}
                      title="Quick filter A to Z"
                    >
                      <i className="fa-solid fa-arrow-down-a-z"></i> A to Z
                    </button>
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
                        <th>Category / Subcategory</th>
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
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.cat_name || 'Gift Studio'}</div>
                            {p.sub_cat_name && (
                              <span style={{ display: 'inline-block', marginTop: '3px', background: '#fdf2f8', border: '1px solid #fbcfe8', color: '#c40b90', borderRadius: '10px', padding: '1px 8px', fontSize: '11px', fontWeight: 700 }}>
                                <i className="fa-solid fa-tag" style={{ fontSize: '9px', marginRight: '3px' }}></i>
                                {p.sub_cat_name}
                              </span>
                            )}
                          </td>
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
                    <i className="fa-solid fa-layer-group" style={{ color: '#c40b90' }}></i> Categories &amp; Studio Collections
                  </h1>
                  <p className="admin-page-subtitle">Configure store categories, icon badges, and landing page visibility.</p>
                </div>
                <div className="admin-page-actions">
                  <button type="button" className="admin-btn-primary" onClick={handleOpenAddCategory}>
                    <i className="fa-solid fa-plus"></i> Add Category
                  </button>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Cover Image</th>
                        <th>Category Name</th>
                        <th>Subcategories</th>
                        <th>Icon Badge</th>
                        <th>Active Products</th>
                        <th>Status</th>
                        <th>Public Route</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localCategories.map((cat) => {
                        const count = localProducts.filter((p) => (p.cat_name || '').toLowerCase() === cat.name.toLowerCase()).length;
                        const coverImg = cat.image_url || cat.image || '/assets/images/cups-product.avif';
                        return (
                          <tr key={cat.id}>
                            <td>
                              <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                  src={coverImg}
                                  alt={cat.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onError={(e) => { e.currentTarget.src = '/assets/images/cups-product.avif'; }}
                                />
                              </div>
                            </td>
                            <td>
                              <strong>{cat.name}</strong>
                            </td>
                            <td>
                              {cat.subcategories ? (
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                  {(typeof cat.subcategories === 'string' ? cat.subcategories.split(',') : cat.subcategories).map((sub, idx) => (
                                    <span key={idx} style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', color: '#c40b90', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>
                                      {sub.trim()}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: '11.5px', fontStyle: 'italic' }}>None (Direct)</span>
                              )}
                            </td>
                            <td>
                              <i className={cat.icon} style={{ color: '#c40b90', marginRight: '6px' }}></i>
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
                                style={{ color: '#c40b90', textDecoration: 'underline', fontSize: '12px' }}
                              >
                                /category/{encodeURIComponent(cat.name)}
                              </a>
                            </td>
                            <td>
                              <div className="admin-action-btn-group">
                                <button
                                  type="button"
                                  className="admin-icon-btn"
                                  onClick={() => handleOpenEditCategory(cat)}
                                  title="Edit Category"
                                >
                                  <i className="fa-solid fa-pen"></i>
                                </button>
                                <button
                                  type="button"
                                  className="admin-icon-btn danger"
                                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                  title="Remove Category"
                                >
                                  <i className="fa-regular fa-trash-can"></i>
                                </button>
                              </div>
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
                    <i className="fa-solid fa-tags" style={{ color: '#c40b90' }}></i> Promo Codes &amp; Store Discounts
                  </h1>
                  <p className="admin-page-subtitle">
                    Create storewide promotional vouchers and issue exclusive personalized promo codes to individual customers.
                  </p>
                </div>
                <div className="admin-page-actions">
                  <button type="button" className="admin-btn-primary" onClick={() => setIsCouponModalOpen(true)}>
                    <i className="fa-solid fa-plus"></i> Create Coupon
                  </button>
                </div>
              </div>

              {/* Promo Metrics KPI Grid */}
              <div className="admin-crm-kpi-grid" style={{ marginBottom: '24px' }}>
                <div className="admin-crm-kpi-card">
                  <div className="crm-kpi-top">
                    <span className="crm-kpi-label">Total Promo Codes</span>
                    <div className="crm-kpi-icon pink">
                      <i className="fa-solid fa-ticket"></i>
                    </div>
                  </div>
                  <div className="crm-kpi-val">{coupons.length}</div>
                  <div className="crm-kpi-sub green">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>In studio catalog</span>
                  </div>
                </div>

                <div className="admin-crm-kpi-card">
                  <div className="crm-kpi-top">
                    <span className="crm-kpi-label">Active Promos</span>
                    <div className="crm-kpi-icon green">
                      <i className="fa-solid fa-toggle-on"></i>
                    </div>
                  </div>
                  <div className="crm-kpi-val">{coupons.filter((c) => c.active).length}</div>
                  <div className="crm-kpi-sub green">
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span>Ready for checkout</span>
                  </div>
                </div>

                <div className="admin-crm-kpi-card">
                  <div className="crm-kpi-top">
                    <span className="crm-kpi-label">Customer-Specific</span>
                    <div className="crm-kpi-icon gold">
                      <i className="fa-solid fa-user-tag"></i>
                    </div>
                  </div>
                  <div className="crm-kpi-val">
                    {coupons.filter((c) => c.customerId || c.customerEmail).length}
                  </div>
                  <div className="crm-kpi-sub gold">
                    <i className="fa-solid fa-crown"></i>
                    <span>Exclusive VIP vouchers</span>
                  </div>
                </div>

                <div className="admin-crm-kpi-card">
                  <div className="crm-kpi-top">
                    <span className="crm-kpi-label">Storewide Public</span>
                    <div className="crm-kpi-icon blue">
                      <i className="fa-solid fa-globe"></i>
                    </div>
                  </div>
                  <div className="crm-kpi-val">
                    {coupons.filter((c) => !c.customerId && !c.customerEmail).length}
                  </div>
                  <div className="crm-kpi-sub blue">
                    <i className="fa-solid fa-users"></i>
                    <span>All store shoppers</span>
                  </div>
                </div>
              </div>

              {/* Promo Codes Filter Toolbar */}
              <div className="admin-panel-card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px', maxWidth: '500px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <i
                        className="fa-solid fa-magnifying-glass"
                        style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }}
                      ></i>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Search by code, title, customer name or email..."
                        value={couponSearch}
                        onChange={(e) => setCouponSearch(e.target.value)}
                        style={{ paddingLeft: '38px', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Target Audience:</label>
                    <select
                      className="admin-select"
                      value={couponAudienceFilter}
                      onChange={(e) => setCouponAudienceFilter(e.target.value)}
                      style={{ minWidth: '190px' }}
                    >
                      <option value="all">All Promo Codes ({coupons.length})</option>
                      <option value="storewide">Storewide Public ({coupons.filter((c) => !c.customerId && !c.customerEmail).length})</option>
                      <option value="customer">Customer-Exclusive ({coupons.filter((c) => c.customerId || c.customerEmail).length})</option>
                    </select>

                    {(couponSearch || couponAudienceFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setCouponSearch('');
                          setCouponAudienceFilter('all');
                        }}
                        className="admin-btn-secondary crm-reset-btn"
                      >
                        <i className="fa-solid fa-rotate-left"></i> Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Coupons Table */}
              <div className="admin-panel-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Promo Code &amp; Title</th>
                        <th>Target Audience</th>
                        <th>Discount Value</th>
                        <th>Min. Order Value</th>
                        <th>Redemptions</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCoupons.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                            <div style={{ fontSize: '36px', marginBottom: '12px', color: '#cbd5e1' }}>
                              <i className="fa-solid fa-ticket"></i>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: '#334155', marginBottom: '4px' }}>
                              No Promo Codes Found
                            </div>
                            <p style={{ margin: 0, fontSize: '13px' }}>
                              No coupons match your filter or search criteria.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredCoupons.map((cp) => {
                          const isCustomerSpecific = !!(cp.customerId || cp.customerEmail);
                          return (
                            <tr key={cp.id}>
                              {/* Promo Code & Title */}
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <strong
                                      style={{
                                        fontFamily: 'monospace',
                                        letterSpacing: '1px',
                                        fontSize: '13.5px',
                                        color: isCustomerSpecific ? '#c40b90' : '#b45309',
                                        background: isCustomerSpecific ? 'rgba(196, 11, 144, 0.08)' : 'rgba(212, 175, 55, 0.1)',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        border: `1px solid ${isCustomerSpecific ? '#fbcfe8' : '#fde68a'}`
                                      }}
                                    >
                                      {cp.code}
                                    </strong>
                                    {isCustomerSpecific && (
                                      <span
                                        className="admin-badge"
                                        style={{ background: '#fdf2f8', color: '#c40b90', border: '1px solid #fbcfe8', fontSize: '10px', padding: '2px 6px' }}
                                      >
                                        <i className="fa-solid fa-sparkles"></i> VIP Exclusive
                                      </span>
                                    )}
                                  </div>
                                  {cp.title && (
                                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                                      {cp.title}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Target Audience */}
                              <td>
                                {isCustomerSpecific ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span
                                      className="admin-badge"
                                      style={{
                                        background: '#fdf2f8',
                                        color: '#c40b90',
                                        border: '1px solid #fbcfe8',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        width: 'fit-content'
                                      }}
                                    >
                                      <i className="fa-solid fa-user-check"></i>
                                      <strong>{cp.customerName || 'Specific Client'}</strong>
                                    </span>
                                    <small style={{ color: '#64748b', fontSize: '11px' }}>
                                      {cp.customerEmail || 'Customer-bound'}
                                    </small>
                                  </div>
                                ) : (
                                  <span
                                    className="admin-badge"
                                    style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                  >
                                    <i className="fa-solid fa-globe"></i>
                                    <span>All Store Customers</span>
                                  </span>
                                )}
                              </td>

                              {/* Discount Value */}
                              <td>
                                <strong style={{ color: '#0f172a', fontSize: '13.5px' }}>
                                  {cp.type === 'percentage' ? `${cp.value}% OFF` : `₹${cp.value} FLAT`}
                                </strong>
                              </td>

                              {/* Min Order Value */}
                              <td>
                                {cp.minOrder > 0 ? (
                                  <span>₹{cp.minOrder}</span>
                                ) : (
                                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>No Minimum</span>
                                )}
                              </td>

                              {/* Redemptions */}
                              <td>
                                <span style={{ color: '#475569', fontSize: '12.5px' }}>
                                  {cp.uses || 0} redemption{cp.uses === 1 ? '' : 's'}
                                </span>
                              </td>

                              {/* Status */}
                              <td>
                                <span className={`admin-badge ${cp.active ? 'active' : 'draft'}`}>
                                  {cp.active ? 'Active' : 'Disabled'}
                                </span>
                              </td>

                              {/* Actions */}
                              <td style={{ textAlign: 'right' }}>
                                <div className="admin-action-btn-group" style={{ justifyContent: 'flex-end' }}>
                                  <button
                                    type="button"
                                    className={`admin-icon-btn ${cp.active ? 'danger' : 'success'}`}
                                    onClick={() => handleToggleCoupon(cp.id)}
                                    title={cp.active ? 'Deactivate Coupon' : 'Activate Coupon'}
                                  >
                                    <i className={cp.active ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off'}></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-icon-btn danger"
                                    onClick={() => handleDeleteCoupon(cp.id, cp.code)}
                                    title={`Delete coupon "${cp.code}"`}
                                  >
                                    <i className="fa-regular fa-trash-can"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB 6: CUSTOMERS ROSTER & CRM                          */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'customers' && (
            <div>
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-users" style={{ color: '#c40b90' }}></i> Registered Customer Directory &amp; CRM
                  </h1>
                  <p className="admin-page-subtitle">
                    Manage client profiles, review order histories, edit credentials, adjust roles, and export roster records.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => fetchCoWorkerUpdates(true)}
                    disabled={isSyncing}
                    title="Fetch latest customer & coworker updates"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className={`fa-solid fa-arrows-rotate ${isSyncing ? 'fa-spin' : ''}`} style={{ color: '#c40b90' }}></i>
                    <span>Fetch Updates</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={handleExportCustomersCSV}
                    title="Export customer list to CSV spreadsheet"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className="fa-solid fa-file-csv" style={{ color: '#16a34a' }}></i>
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={handleOpenCreateCustomer}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className="fa-solid fa-user-plus"></i>
                    <span>+ Add Customer / Staff</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleOpenCreateAdminUser}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      borderColor: '#d97706',
                      color: '#ffffff'
                    }}
                    title="Create new store administrator account with full CMS access"
                  >
                    <i className="fa-solid fa-user-shield"></i>
                    <span>+ Add Admin User</span>
                  </button>
                </div>
              </div>

              {/* KPI Metrics Strip */}
              <div className="admin-crm-kpi-grid">
                <div className="admin-crm-kpi-card">
                  <div className="crm-kpi-top">
                    <span className="crm-kpi-label">Total Customers</span>
                    <div className="crm-kpi-icon pink">
                      <i className="fa-solid fa-users"></i>
                    </div>
                  </div>
                  <div className="crm-kpi-val">{customers.length}</div>
                  <div className="crm-kpi-sub green">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Active registered accounts</span>
                  </div>
                </div>

                <div className="admin-crm-kpi-card">
                  <div className="crm-kpi-top">
                    <span className="crm-kpi-label">Active Accounts</span>
                    <div className="crm-kpi-icon green">
                      <i className="fa-solid fa-user-check"></i>
                    </div>
                  </div>
                  <div className="crm-kpi-val">
                    {customers.filter((c) => (c.status || 'active') === 'active').length}
                  </div>
                  <div className="crm-kpi-sub green">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Permitted for checkout</span>
                  </div>
                </div>

                <div className="admin-crm-kpi-card">
                  <div className="crm-kpi-top">
                    <span className="crm-kpi-label">VIP Gold Tier</span>
                    <div className="crm-kpi-icon gold">
                      <i className="fa-solid fa-gem"></i>
                    </div>
                  </div>
                  <div className="crm-kpi-val">
                    {customers.filter((c) => c.role === 'vip').length}
                  </div>
                  <div className="crm-kpi-sub gold">
                    <i className="fa-solid fa-crown"></i>
                    <span>Artisan Rewards VIPs</span>
                  </div>
                </div>

                <div className="admin-crm-kpi-card">
                  <div className="crm-kpi-top">
                    <span className="crm-kpi-label">Google Verified</span>
                    <div className="crm-kpi-icon red">
                      <i className="fa-brands fa-google"></i>
                    </div>
                  </div>
                  <div className="crm-kpi-val">
                    {customers.filter((c) => c.provider === 'google' || c.email?.includes('gmail')).length}
                  </div>
                  <div className="crm-kpi-sub gray">
                    <i className="fa-regular fa-envelope"></i>
                    <span>Gmail OAuth accounts</span>
                  </div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="admin-panel-card admin-crm-filter-bar">
                <div className="crm-filter-row">
                  {/* Left: Search input */}
                  <div className="crm-search-box">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                      type="text"
                      placeholder="Search customers by name, email, phone, city..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="admin-input"
                    />
                    {customerSearch && (
                      <button
                        type="button"
                        onClick={() => setCustomerSearch('')}
                        className="crm-search-clear"
                        aria-label="Clear search"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    )}
                  </div>

                  {/* Right: Dropdown Filters */}
                  <div className="crm-select-group">
                    <select
                      value={customerRoleFilter}
                      onChange={(e) => setCustomerRoleFilter(e.target.value)}
                      className="admin-select"
                    >
                      <option value="all">All Roles ({customers.length})</option>
                      <option value="customer">Regular Customers</option>
                      <option value="vip">VIP Members</option>
                      <option value="staff">Co-workers / Staff ({customers.filter((c) => c.role === 'staff' || c.role === 'coworker').length})</option>
                      <option value="admin">Administrators</option>
                    </select>

                    <select
                      value={customerStatusFilter}
                      onChange={(e) => setCustomerStatusFilter(e.target.value)}
                      className="admin-select"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active Accounts</option>
                      <option value="suspended">Suspended Accounts</option>
                    </select>

                    <select
                      value={customerProviderFilter}
                      onChange={(e) => setCustomerProviderFilter(e.target.value)}
                      className="admin-select"
                    >
                      <option value="all">All Auth Methods</option>
                      <option value="google">Google (Gmail)</option>
                      <option value="email">Standard Email</option>
                    </select>

                    {(customerSearch || customerRoleFilter !== 'all' || customerStatusFilter !== 'all' || customerProviderFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomerSearch('');
                          setCustomerRoleFilter('all');
                          setCustomerStatusFilter('all');
                          setCustomerProviderFilter('all');
                        }}
                        className="admin-btn-secondary crm-reset-btn"
                      >
                        <i className="fa-solid fa-rotate-left"></i> Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Customers Table */}
              <div className="admin-panel-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer Profile</th>
                        <th>Contact &amp; Provider</th>
                        <th>Role &amp; Tier</th>
                        <th>Status</th>
                        <th>Orders &amp; Spend</th>
                        <th>Promo Codes</th>
                        <th>Wallet</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                            <div style={{ fontSize: '36px', marginBottom: '12px', color: '#cbd5e1' }}>
                              <i className="fa-solid fa-user-slash"></i>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: '#334155', marginBottom: '4px' }}>
                              No Customers Found
                            </div>
                            <p style={{ margin: 0, fontSize: '13px' }}>
                              No client records match your current search or filter criteria.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((cust) => {
                          const isGoogle = cust.provider === 'google' || cust.email?.toLowerCase().includes('gmail');
                          const isSuspended = cust.status === 'suspended';
                          return (
                            <tr key={cust.id} style={{ opacity: isSuspended ? 0.75 : 1 }}>
                              {/* Customer Profile Column */}
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div
                                    style={{
                                      width: '38px',
                                      height: '38px',
                                      borderRadius: '50%',
                                      background: cust.role === 'admin' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : cust.role === 'vip' ? 'linear-gradient(135deg, #c40b90, #e7137a)' : '#e2e8f0',
                                      color: cust.role === 'customer' ? '#475569' : '#ffffff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 800,
                                      fontSize: '13px',
                                      overflow: 'hidden',
                                      flexShrink: 0
                                    }}
                                  >
                                    {cust.avatar ? (
                                      <img src={cust.avatar} alt={cust.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      (cust.name || 'C')
                                        .split(' ')
                                        .map((n) => n[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase()
                                    )}
                                  </div>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <strong style={{ color: '#0f172a', fontSize: '14px' }}>{cust.name}</strong>
                                      {cust.notes && (
                                        <i
                                          className="fa-solid fa-note-sticky"
                                          style={{ color: '#f59e0b', fontSize: '12px' }}
                                          title={`Admin Note: ${cust.notes}`}
                                        ></i>
                                      )}
                                    </div>
                                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                                      {cust.city || 'Mangalore'} · ID: {String(cust.id).slice(-6)}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Contact & Provider Column */}
                              <td>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                                  {cust.email}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                                  {isGoogle ? (
                                    <span
                                      className="admin-badge"
                                      style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '10.5px', padding: '2px 7px' }}
                                    >
                                      <i className="fa-brands fa-google"></i> Gmail
                                    </span>
                                  ) : (
                                    <span
                                      className="admin-badge"
                                      style={{ background: '#f1f5f9', color: '#475569', fontSize: '10.5px', padding: '2px 7px' }}
                                    >
                                      <i className="fa-regular fa-envelope"></i> Email
                                    </span>
                                  )}
                                  {cust.phone ? (
                                    <a
                                      href={`https://wa.me/${cust.phone.replace(/\D/g, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
                                      title="Open WhatsApp chat"
                                    >
                                      <i className="fa-brands fa-whatsapp"></i> {cust.phone}
                                    </a>
                                  ) : (
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>No phone</span>
                                  )}
                                </div>
                              </td>

                              {/* Role & Tier Column */}
                              <td>
                                {cust.role === 'admin' ? (
                                  <span className="admin-badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                                    <i className="fa-solid fa-shield-halved"></i> Store Admin
                                  </span>
                                ) : cust.role === 'staff' || cust.role === 'coworker' ? (
                                  <span className="admin-badge" style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                                    <i className="fa-solid fa-user-tie"></i> Co-worker / Staff
                                  </span>
                                ) : cust.role === 'vip' ? (
                                  <span className="admin-badge" style={{ background: '#fdf2f8', color: '#c40b90', border: '1px solid #fbcfe8' }}>
                                    <i className="fa-solid fa-gem"></i> VIP Gold
                                  </span>
                                ) : (
                                  <span className="admin-badge active">
                                    <i className="fa-regular fa-user"></i> Customer
                                  </span>
                                )}
                              </td>

                              {/* Status Column */}
                              <td>
                                {isSuspended ? (
                                  <span className="admin-badge" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                                    <i className="fa-solid fa-circle-xmark"></i> Suspended
                                  </span>
                                ) : (
                                  <span className="admin-badge" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                                    <i className="fa-solid fa-circle-check"></i> Active
                                  </span>
                                )}
                              </td>

                              {/* Orders & Spend Column */}
                              <td>
                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '13.5px' }}>
                                  ₹{(cust.lifetimeSpend || 0).toLocaleString()}
                                </div>
                                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                                  {cust.ordersCount || 0} order{cust.ordersCount === 1 ? '' : 's'}
                                </div>
                              </td>

                              {/* Personalized Promo Codes Column */}
                              <td>
                                {(() => {
                                  const custCoupons = coupons.filter(
                                    (c) =>
                                      (c.customerId && c.customerId === cust.id) ||
                                      (c.customerEmail && c.customerEmail.toLowerCase() === cust.email?.toLowerCase())
                                  );
                                  const activeCount = custCoupons.filter((c) => c.active).length;
                                  return (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      {custCoupons.length === 0 ? (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenCustomerPromo(cust)}
                                          className="admin-badge"
                                          style={{
                                            background: '#f8fafc',
                                            color: '#64748b',
                                            border: '1px dashed #cbd5e1',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '4px 8px',
                                            fontSize: '11px',
                                            transition: 'all 0.2s ease'
                                          }}
                                          title={`Issue personalized promo code for ${cust.name}`}
                                        >
                                          <i className="fa-solid fa-plus"></i> Give Promo
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenCustomerPromo(cust)}
                                          className="admin-badge"
                                          style={{
                                            background: 'rgba(196, 11, 144, 0.08)',
                                            color: '#c40b90',
                                            border: '1px solid #fbcfe8',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            padding: '4px 9px',
                                            fontSize: '11.5px',
                                            borderRadius: '6px'
                                          }}
                                          title={`Click to view/manage ${custCoupons.length} personalized code${custCoupons.length > 1 ? 's' : ''} for ${cust.name}`}
                                        >
                                          <i className="fa-solid fa-ticket"></i>
                                          <span>{custCoupons.length} Code{custCoupons.length > 1 ? 's' : ''}</span>
                                          {activeCount > 0 && (
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  );
                                })()}
                              </td>

                              {/* Wallet Credit Column */}
                              <td>
                                <span style={{ fontWeight: 700, color: '#c40b90', fontSize: '13px' }}>
                                  ₹{(cust.walletBalance ?? 100).toLocaleString()}
                                </span>
                              </td>

                              {/* Actions Column */}
                              <td style={{ textAlign: 'right' }}>
                                <div className="admin-action-btn-group" style={{ justifyContent: 'flex-end' }}>
                                  <button
                                    type="button"
                                    className="admin-icon-btn"
                                    onClick={() => handleOpenCustomerPromo(cust)}
                                    title={`Manage personalized promo codes for ${cust.name}`}
                                    aria-label="Manage Promo Codes"
                                    style={{ color: '#c40b90' }}
                                  >
                                    <i className="fa-solid fa-ticket"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-icon-btn"
                                    onClick={() => setInspectedCustomer(cust)}
                                    title="View full profile & order history"
                                    aria-label="View Details"
                                  >
                                    <i className="fa-solid fa-eye"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-icon-btn"
                                    onClick={() => handleOpenEditCustomer(cust)}
                                    title="Edit customer account & details"
                                    aria-label="Edit Customer"
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className={`admin-icon-btn ${isSuspended ? 'success' : 'danger'}`}
                                    onClick={() => handleToggleCustomerStatus(cust)}
                                    title={isSuspended ? 'Activate account' : 'Suspend / block account'}
                                    aria-label={isSuspended ? 'Activate' : 'Suspend'}
                                  >
                                    <i className={`fa-solid ${isSuspended ? 'fa-check' : 'fa-ban'}`}></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-icon-btn danger"
                                    onClick={() => handlePromptDeleteCustomer(cust)}
                                    title="Delete customer permanently"
                                    aria-label="Delete Customer"
                                  >
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* TAB: STORE ADMINISTRATORS                              */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'admins' && (
            <div>
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-user-shield" style={{ color: '#d97706' }}></i> Store Administrators &amp; Team Credentials
                  </h1>
                  <p className="admin-page-subtitle">
                    Manage high-privilege administrative accounts, create new admin credentials for co-workers, and control CMS access.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => fetchCoWorkerUpdates(true)}
                    disabled={isSyncing}
                    title="Fetch latest administrative accounts & coworker updates"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <i className={`fa-solid fa-arrows-rotate ${isSyncing ? 'fa-spin' : ''}`} style={{ color: '#d97706' }}></i>
                    <span>Fetch Updates</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleOpenCreateAdminUser}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      borderColor: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
                    }}
                    title="Create a new Store Administrator account"
                  >
                    <i className="fa-solid fa-user-plus"></i>
                    <span>+ Create Administrative Account</span>
                  </button>
                </div>
              </div>

              {/* Security Privileges Callout */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  border: '1px solid #fde68a',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: '#f59e0b',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}
                >
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#92400e', marginBottom: '3px' }}>
                    Multi-Admin Command Center &amp; Access Control
                  </div>
                  <div style={{ fontSize: '13px', color: '#b45309', lineHeight: 1.5 }}>
                    Every administrator listed here possesses full permissions to manage the live catalog, process customer orders, upload media assets, and modify CMS settings. They can log in directly at <strong><code>/admin</code></strong> with their assigned email and password.
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={handleOpenCreateAdminUser}
                  style={{
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    background: '#d97706',
                    borderColor: '#b45309',
                    flexShrink: 0,
                    alignSelf: 'center'
                  }}
                >
                  <i className="fa-solid fa-plus"></i> Add One More Admin
                </button>
              </div>

              {/* Administrator KPI Stats */}
              <div className="admin-crm-kpi-grid">
                <div className="admin-crm-kpi-card">
                  <div className="crm-kpi-top">
                    <span className="crm-kpi-label">Total Administrators</span>
                    <div className="crm-kpi-icon gold">
                      <i className="fa-solid fa-user-shield"></i>
                    </div>
                  </div>
                  <div className="crm-kpi-val">
                    {customers.filter((c) => c.role === 'admin').length || 1}
                  </div>
                  <div className="crm-kpi-sub green">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Active CMS administrative accounts</span>
                  </div>
                </div>

                <div className="admin-crm-kpi-card">
                  <div className="crm-kpi-top">
                    <span className="crm-kpi-label">Active Privilege Status</span>
                    <div className="crm-kpi-icon green">
                      <i className="fa-solid fa-circle-check"></i>
                    </div>
                  </div>
                  <div className="crm-kpi-val">
                    {customers.filter((c) => c.role === 'admin' && (c.status || 'active') === 'active').length || 1}
                  </div>
                  <div className="crm-kpi-sub green">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Authorized to unlock /admin</span>
                  </div>
                </div>

                <div className="admin-crm-kpi-card">
                  <div className="crm-kpi-top">
                    <span className="crm-kpi-label">Coworker Real-Time Sync</span>
                    <div className="crm-kpi-icon blue">
                      <i className="fa-solid fa-tower-broadcast"></i>
                    </div>
                  </div>
                  <div className="crm-kpi-val text-emerald">Live</div>
                  <div className="crm-kpi-sub gray">
                    <i className="fa-solid fa-arrows-rotate"></i>
                    <span>BroadcastChannel &amp; Storage Active</span>
                  </div>
                </div>
              </div>

              {/* Administrator Accounts Table */}
              <div className="admin-panel-card">
                <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 className="admin-panel-title">
                      <i className="fa-solid fa-users-gear" style={{ color: '#d97706' }}></i> Authorized Administrator Roster
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                      All registered administrator accounts with full dashboard privileges.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleOpenCreateAdminUser}
                    style={{
                      padding: '7px 14px',
                      fontSize: '12.5px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      borderColor: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fa-solid fa-user-plus"></i>
                    <span>+ Add Admin Account</span>
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Administrator</th>
                        <th>Email &amp; Login ID</th>
                        <th>Phone</th>
                        <th>City / Location</th>
                        <th>Access Role</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const adminList = customers.filter((c) => c.role === 'admin');
                        const displayList = adminList.length > 0
                          ? adminList
                          : [
                              {
                                id: 'usr_admin',
                                name: currentAdminUser?.name || 'Studio Admin',
                                email: currentAdminUser?.email || 'admin@finegiftstudio.com',
                                phone: '+91 99999 88888',
                                role: 'admin',
                                status: 'active',
                                city: 'Mangalore',
                                createdAt: '2026-08-01T08:00:00Z',
                                notes: 'Master Studio Administrator'
                              }
                            ];

                        return displayList.map((admin) => {
                          const isSuspended = admin.status === 'suspended';
                          return (
                            <tr key={admin.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div
                                    style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '50%',
                                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                      color: '#ffffff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 800,
                                      fontSize: '14px',
                                      boxShadow: '0 2px 6px rgba(217, 119, 6, 0.25)',
                                      flexShrink: 0
                                    }}
                                  >
                                    {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{admin.name}</div>
                                    <div style={{ fontSize: '11px', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <i className="fa-solid fa-shield-halved"></i>
                                      <span>Full CMS Privileges</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span style={{ fontWeight: 600, color: '#334155' }}>{admin.email}</span>
                              </td>
                              <td>
                                <span style={{ fontSize: '12.5px', color: '#64748b' }}>{admin.phone || '—'}</span>
                              </td>
                              <td>
                                <span style={{ fontSize: '12.5px', color: '#64748b' }}>{admin.city || 'Mangalore'}</span>
                              </td>
                              <td>
                                <span
                                  className="admin-badge"
                                  style={{
                                    background: '#fef3c7',
                                    color: '#92400e',
                                    fontWeight: 700,
                                    border: '1px solid #fde68a',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <i className="fa-solid fa-lock"></i> Store Administrator
                                </span>
                              </td>
                              <td>
                                <span className={`admin-badge ${isSuspended ? 'pending' : 'completed'}`}>
                                  <i className={`fa-solid ${isSuspended ? 'fa-ban' : 'fa-circle-check'}`} style={{ marginRight: '4px' }}></i>
                                  {isSuspended ? 'Suspended' : 'Active'}
                                </span>
                              </td>
                              <td>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>
                                  {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Aug 2026'}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                  <button
                                    type="button"
                                    className="admin-icon-btn"
                                    onClick={() => handleOpenEditCustomer(admin)}
                                    title="Edit Administrator Profile & Password"
                                    aria-label="Edit Admin"
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className={`admin-icon-btn ${isSuspended ? 'success' : 'danger'}`}
                                    onClick={() => handleToggleCustomerStatus(admin)}
                                    title={isSuspended ? 'Activate account' : 'Suspend administrator account'}
                                    aria-label={isSuspended ? 'Activate' : 'Suspend'}
                                  >
                                    <i className={`fa-solid ${isSuspended ? 'fa-check' : 'fa-ban'}`}></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-icon-btn danger"
                                    onClick={() => handlePromptDeleteCustomer(admin)}
                                    title="Revoke / Delete administrator account"
                                    aria-label="Delete Admin"
                                  >
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Quick Action Box */}
                <div
                  style={{
                    margin: '20px',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1.5px dashed #d97706',
                    background: '#fffdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: '#fef3c7',
                        color: '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}
                    >
                      <i className="fa-solid fa-key"></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#92400e' }}>
                        Need to grant another manager or partner administrative access?
                      </div>
                      <div style={{ fontSize: '12px', color: '#b45309', marginTop: '2px' }}>
                        Click below to create an administrative account with immediate access to this control center.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleOpenCreateAdminUser}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      borderColor: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexShrink: 0
                    }}
                  >
                    <i className="fa-solid fa-user-shield"></i>
                    <span>+ Add Administrative Account</span>
                  </button>
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
                    <i className="fa-solid fa-clock-rotate-left" style={{ color: '#c40b90' }}></i> CMS Audit Trail &amp; Activity
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
                    <i className="fa-solid fa-photo-film" style={{ color: '#c40b90' }}></i> Media Library &amp; Studio Assets
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
                  <i className="fa-regular fa-images" style={{ fontSize: '36px', color: '#c40b90', marginBottom: '12px' }}></i>
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

          {/* ══════════════════════════════════════════════════════════════
             TAB: HOMEPAGE CMS & SECTIONS WORKSPACE
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'home-cms' && (
            <div className="admin-workspace">
              {/* Header */}
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-pen-ruler" style={{ color: '#c40b90' }}></i> Homepage CMS &amp; Sections
                  </h1>
                  <p className="admin-page-subtitle">
                    Customize headlines, hero carousel slides, promo banners, value props, copy, and section visibility in real-time.
                  </p>
                </div>
                <div className="admin-page-actions">
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={handleResetHomeContent}
                    title="Reset all homepage copy and sections to original defaults"
                  >
                    <i className="fa-solid fa-rotate-left"></i> Reset Defaults
                  </button>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => onNavigate('/')}
                    title="View live storefront homepage"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> Preview Homepage
                  </button>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleSaveHomeContent}
                    disabled={isHomeSaving}
                    style={{ background: 'linear-gradient(135deg, #c40b90 0%, #7d2091 100%)' }}
                  >
                    <i className={`fa-solid ${isHomeSaving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`}></i>{' '}
                    {isHomeSaving ? 'Publishing...' : 'Save & Publish Live'}
                  </button>
                </div>
              </div>

              {/* Sub-Navigation for CMS Categories */}
              <div className="admin-cms-subnav">
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${cmsSubTab === 'visibility' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('visibility')}
                >
                  <i className="fa-solid fa-eye"></i> Section Visibility
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${cmsSubTab === 'hero' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('hero')}
                >
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Hero Carousel (3 Slides)
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${cmsSubTab === 'promo' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('promo')}
                >
                  <i className="fa-solid fa-rectangle-ad"></i> Promo Cards (3 Banners)
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${cmsSubTab === 'featured-deals' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('featured-deals')}
                >
                  <i className="fa-solid fa-star"></i> Categories &amp; Deals Headers
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${cmsSubTab === 'banners' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('banners')}
                >
                  <i className="fa-solid fa-percent"></i> Discount &amp; Corporate Banners
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${cmsSubTab === 'whychoose' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('whychoose')}
                >
                  <i className="fa-solid fa-shield-heart"></i> Why Choose Us &amp; 5 Features
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${cmsSubTab === 'collections-reviews' ? 'active' : ''}`}
                  onClick={() => setCmsSubTab('collections-reviews')}
                >
                  <i className="fa-solid fa-comments"></i> Columns &amp; Testimonials
                </button>
              </div>

              {/* ─────────────────────────────────────────────────────────
                  SUBTAB 1: SECTION VISIBILITY TOGGLES
                  ───────────────────────────────────────────────────────── */}
              {cmsSubTab === 'visibility' && (
                <div className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-toggle-on" style={{ color: '#059669' }}></i> Storefront Sections Switchboard
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        Turn sections ON or OFF with a single click. Changes apply immediately upon clicking "Save &amp; Publish Live".
                      </p>
                    </div>
                  </div>

                  <div className="admin-cms-toggle-grid">
                    {[
                      {
                        key: 'hero',
                        title: 'Hero Banner Slider',
                        desc: 'Top animated carousel with emotion tags, CTA buttons, and studio photography.',
                        icon: 'fa-solid fa-images',
                      },
                      {
                        key: 'categoryStrip',
                        title: 'Panoramic Category Strip',
                        desc: 'Horizontal bubble icon strip with popular tags and fast category shortcuts.',
                        icon: 'fa-solid fa-layer-group',
                      },
                      {
                        key: 'featuredCategories',
                        title: 'Featured Categories Carousel',
                        desc: 'Interactive swiper of gift collections with live stock counts and direct links.',
                        icon: 'fa-solid fa-cubes',
                      },
                      {
                        key: 'promoBanners',
                        title: 'Promotional Grid (3 Cards)',
                        desc: 'Tri-banner layout: Acrylic Photo Blocks, Custom Apparel, Laser Engraved Gifts.',
                        icon: 'fa-solid fa-rectangle-ad',
                      },
                      {
                        key: 'dealsOfDay',
                        title: 'Deals of the Day',
                        desc: 'Curated discounted items with countdown timer and one-click quick add.',
                        icon: 'fa-solid fa-fire',
                      },
                      {
                        key: 'discountBanner',
                        title: 'Weekend Flash Discount Banner',
                        desc: 'High-converting callout banner with instant shop button and starting price tag.',
                        icon: 'fa-solid fa-bolt-lightning',
                      },
                      {
                        key: 'whyChoose',
                        title: 'Why Choose Us & Corporate Bulk',
                        desc: '5 value propositions and dedicated corporate gift inquiry lead banner.',
                        icon: 'fa-solid fa-award',
                      },
                      {
                        key: 'productLists',
                        title: 'Product Collections (3 Columns)',
                        desc: 'Tri-column showcases for New Collection, Top Rated, and Best Sellers.',
                        icon: 'fa-solid fa-table-columns',
                      },
                      {
                        key: 'testimonials',
                        title: 'Customer Testimonials & Reviews',
                        desc: 'Verified buyer testimonials, photo reviews, and 5-star Google review rating card.',
                        icon: 'fa-solid fa-quote-left',
                      },
                    ].map((sec) => {
                      const isVisible = localHomeContent?.visibility?.[sec.key] !== false;
                      return (
                        <div
                          key={sec.key}
                          className={`admin-cms-toggle-card ${isVisible ? 'active' : 'inactive'}`}
                        >
                          <div className="admin-cms-toggle-info">
                            <div className={`admin-cms-toggle-icon ${isVisible ? 'active' : 'inactive'}`}>
                              <i className={sec.icon}></i>
                            </div>
                            <div>
                              <div className="admin-cms-toggle-title">{sec.title}</div>
                              <div className="admin-cms-toggle-desc">{sec.desc}</div>
                              <div style={{ marginTop: '8px', fontSize: '11.5px', fontWeight: 700, color: isVisible ? '#059669' : '#64748b' }}>
                                {isVisible ? '● Visible on Homepage' : '○ Hidden from Customers'}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`admin-switch-btn ${isVisible ? 'active' : ''}`}
                            onClick={() => handleUpdateVisibility(sec.key, !isVisible)}
                            title={isVisible ? 'Click to hide this section' : 'Click to show this section'}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  SUBTAB 2: HERO CAROUSEL SLIDES (3 SLIDES)
                  ───────────────────────────────────────────────────────── */}
              {cmsSubTab === 'hero' && (
                <div>
                  {(localHomeContent.hero?.slides || []).map((slide, sIdx) => (
                    <div key={slide.id || sIdx} className="admin-cms-slide-card">
                      <div className="admin-cms-slide-header">
                        <div className="admin-cms-slide-title">
                          <i className="fa-solid fa-circle-play" style={{ color: '#c40b90' }}></i>
                          <span>Slide #{sIdx + 1}: {slide.mainTitle} {slide.highlightTitle}</span>
                        </div>
                        <span className="admin-cms-slide-badge">{slide.badgeTag || `Slide ${sIdx + 1}`}</span>
                      </div>

                      {/* Live Text Preview Strip */}
                      <div className="admin-cms-preview-banner">
                        <div>
                          <div style={{ fontSize: '12px', color: '#f9b228', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {slide.subtitle || 'Sub-headline Tag'}
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: 900, marginTop: '2px' }}>
                            {slide.mainTitle} <span style={{ color: '#f9b228' }}>{slide.highlightTitle}</span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px', maxWidth: '480px' }}>
                            {slide.description}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="admin-btn-primary"
                          style={{ pointerEvents: 'none', background: '#c40b90', border: 'none', padding: '6px 14px', fontSize: '12px' }}
                        >
                          {slide.ctaText || 'Button'} →
                        </button>
                      </div>

                      <div className="admin-form-grid">
                        <div className="admin-form-group">
                          <label>Badge / Top Tag</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={slide.badgeTag || ''}
                            onChange={(e) => handleUpdateHeroSlide(sIdx, 'badgeTag', e.target.value)}
                            placeholder="e.g. Exclusive Offer"
                          />
                        </div>

                        <div className="admin-form-group">
                          <label>Sub-heading / Category Pill</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={slide.subtitle || ''}
                            onChange={(e) => handleUpdateHeroSlide(sIdx, 'subtitle', e.target.value)}
                            placeholder="e.g. ✨ Personalized Gifts for Every Emotion"
                          />
                        </div>

                        <div className="admin-form-group">
                          <label>Main Headline</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={slide.mainTitle || ''}
                            onChange={(e) => handleUpdateHeroSlide(sIdx, 'mainTitle', e.target.value)}
                            placeholder="e.g. Crafted With Love,"
                          />
                        </div>

                        <div className="admin-form-group">
                          <label>Highlight Text (Golden / Accent)</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={slide.highlightTitle || ''}
                            onChange={(e) => handleUpdateHeroSlide(sIdx, 'highlightTitle', e.target.value)}
                            placeholder="e.g. Printed to Perfection"
                          />
                        </div>

                        <div className="admin-form-group full-width">
                          <label>Slide Description</label>
                          <textarea
                            className="admin-form-textarea"
                            rows={2}
                            value={slide.description || ''}
                            onChange={(e) => handleUpdateHeroSlide(sIdx, 'description', e.target.value)}
                            placeholder="Short engaging copy explaining custom print options and fast delivery..."
                          />
                        </div>

                        <div className="admin-form-group">
                          <label>CTA Button Text</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={slide.ctaText || ''}
                            onChange={(e) => handleUpdateHeroSlide(sIdx, 'ctaText', e.target.value)}
                            placeholder="e.g. Explore Collection"
                          />
                        </div>

                        <div className="admin-form-group">
                          <label>CTA Button Link / Destination</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={slide.ctaLink || ''}
                            onChange={(e) => handleUpdateHeroSlide(sIdx, 'ctaLink', e.target.value)}
                            placeholder="e.g. /shop or /shop?cat=t-shirts"
                          />
                        </div>

                        <div className="admin-form-group">
                          <label>Customer Proof / Stat Badge Label</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={slide.countLabel || ''}
                            onChange={(e) => handleUpdateHeroSlide(sIdx, 'countLabel', e.target.value)}
                            placeholder="e.g. Over 15,000+ Happy Customers"
                          />
                        </div>

                        <div className="admin-form-group full-width">
                          <label>Slide Photography Image</label>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <img
                              src={slide.image || '/assets/images/cups-product.avif'}
                              alt="Slide preview"
                              style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                              onError={(e) => { e.currentTarget.src = '/assets/images/cups-product.avif'; }}
                            />
                            <input
                              type="text"
                              className="admin-form-input"
                              style={{ flex: 1 }}
                              value={slide.image || ''}
                              onChange={(e) => handleUpdateHeroSlide(sIdx, 'image', e.target.value)}
                              placeholder="Image URL or pick from Studio Media Library"
                            />
                            <button
                              type="button"
                              className="admin-btn-secondary"
                              onClick={() => setHeroImagePickerIdx(heroImagePickerIdx === sIdx ? null : sIdx)}
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              <i className="fa-solid fa-photo-film"></i> {heroImagePickerIdx === sIdx ? 'Close Media' : 'Choose Media'}
                            </button>
                          </div>
                          {heroImagePickerIdx === sIdx && (
                            <div style={{ marginTop: '10px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                              <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                                Click any studio media asset to set as this slide's photography:
                              </div>
                              <div className="admin-media-picker-grid" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                {mediaAssets.map((asset) => (
                                  <button
                                    key={asset.id}
                                    type="button"
                                    className={`admin-media-picker-item ${slide.image === asset.url ? 'selected' : ''}`}
                                    onClick={() => {
                                      handleUpdateHeroSlide(sIdx, 'image', asset.url);
                                      setHeroImagePickerIdx(null);
                                    }}
                                    title={asset.name}
                                  >
                                    <img src={asset.url} alt={asset.alt || asset.name} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  SUBTAB 3: PROMOTIONAL CARDS (3 BANNERS)
                  ───────────────────────────────────────────────────────── */}
              {cmsSubTab === 'promo' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  {[
                    { key: 'card1', label: 'Card 1: Acrylic Photo Blocks', defaultAccent: '#c40b90', icon: 'fa-solid fa-gem' },
                    { key: 'card2', label: 'Card 2: Custom Printed Apparel', defaultAccent: '#7d2091', icon: 'fa-solid fa-shirt' },
                    { key: 'card3', label: 'Card 3: Laser Engraved Studio Gifts', defaultAccent: '#0d97d5', icon: 'fa-solid fa-wand-magic-sparkles' },
                  ].map((pCard) => {
                    const card = localHomeContent?.promoBanners?.[pCard.key] || {};
                    return (
                      <div key={pCard.key} className="admin-cms-slide-card">
                        <div className="admin-cms-slide-header">
                          <div className="admin-cms-slide-title" style={{ fontSize: '15px' }}>
                            <i className={pCard.icon} style={{ color: pCard.defaultAccent }}></i>
                            <span>{pCard.label}</span>
                          </div>
                          <span className="admin-cms-slide-badge">{card.badge || 'PROMO'}</span>
                        </div>

                        <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                          <label>Top Badge / Discount Tag</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={card.badge || ''}
                            onChange={(e) => handleUpdatePromoCard(pCard.key, 'badge', e.target.value)}
                            placeholder="e.g. Flat 30% Off"
                          />
                        </div>

                        <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                          <label>Headline Title</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={card.title || ''}
                            onChange={(e) => handleUpdatePromoCard(pCard.key, 'title', e.target.value)}
                            placeholder="e.g. Acrylic Photo"
                          />
                        </div>

                        <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                          <label>Highlight Title</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={card.highlight || ''}
                            onChange={(e) => handleUpdatePromoCard(pCard.key, 'highlight', e.target.value)}
                            placeholder="e.g. Blocks & Frames"
                          />
                        </div>

                        <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                          <label>Description</label>
                          <textarea
                            className="admin-form-textarea"
                            rows={2}
                            value={card.desc || ''}
                            onChange={(e) => handleUpdatePromoCard(pCard.key, 'desc', e.target.value)}
                            placeholder="Short promotional description..."
                          />
                        </div>

                        <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                          <div className="admin-form-group">
                            <label>Button Text</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={card.btnText || ''}
                              onChange={(e) => handleUpdatePromoCard(pCard.key, 'btnText', e.target.value)}
                              placeholder="e.g. Order Custom"
                            />
                          </div>

                          <div className="admin-form-group">
                            <label>Button Link</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={card.btnLink || ''}
                              onChange={(e) => handleUpdatePromoCard(pCard.key, 'btnLink', e.target.value)}
                              placeholder="e.g. /shop"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  SUBTAB 4: FEATURED CATEGORIES & DEALS HEADERS
                  ───────────────────────────────────────────────────────── */}
              {cmsSubTab === 'featured-deals' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                  {/* Category Strip & Featured Categories Panel */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-cubes" style={{ color: '#c40b90' }}></i> Featured Categories Section
                      </h3>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Sub-Headline / Tag</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.featuredCategories?.subtitle || ''}
                        onChange={(e) => handleUpdateSectionField('featuredCategories', 'subtitle', e.target.value)}
                        placeholder="e.g. Browse Collections"
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Main Title</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.featuredCategories?.mainTitle || ''}
                        onChange={(e) => handleUpdateSectionField('featuredCategories', 'mainTitle', e.target.value)}
                        placeholder="e.g. Featured Gift"
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Highlight Title</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.featuredCategories?.highlightTitle || ''}
                        onChange={(e) => handleUpdateSectionField('featuredCategories', 'highlightTitle', e.target.value)}
                        placeholder="e.g. Categories"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Section Sub-Description</label>
                      <textarea
                        className="admin-form-textarea"
                        rows={2}
                        value={localHomeContent?.featuredCategories?.description || ''}
                        onChange={(e) => handleUpdateSectionField('featuredCategories', 'description', e.target.value)}
                        placeholder="Explore popular personalized gift categories tailored for every special milestone."
                      />
                    </div>
                  </div>

                  {/* Deals of the Day Panel */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-fire" style={{ color: '#e7137a' }}></i> Deals of the Day Section
                      </h3>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Sub-Headline / Tag</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.dealsOfDay?.subtitle || ''}
                        onChange={(e) => handleUpdateSectionField('dealsOfDay', 'subtitle', e.target.value)}
                        placeholder="e.g. Limited Time Offers"
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Main Title</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.dealsOfDay?.mainTitle || ''}
                        onChange={(e) => handleUpdateSectionField('dealsOfDay', 'mainTitle', e.target.value)}
                        placeholder="e.g. Deals of the"
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Highlight Title</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.dealsOfDay?.highlightTitle || ''}
                        onChange={(e) => handleUpdateSectionField('dealsOfDay', 'highlightTitle', e.target.value)}
                        placeholder="e.g. Day"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Section Sub-Description</label>
                      <textarea
                        className="admin-form-textarea"
                        rows={2}
                        value={localHomeContent?.dealsOfDay?.description || ''}
                        onChange={(e) => handleUpdateSectionField('dealsOfDay', 'description', e.target.value)}
                        placeholder="Grab these high-demand handcrafted gifts at unbeatable limited-time prices."
                      />
                    </div>
                  </div>

                  {/* Category Card Images Manager for Home Page Featured Carousel */}
                  <div className="admin-panel-card" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                    <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 className="admin-panel-title">
                          <i className="fa-solid fa-photo-film" style={{ color: '#c40b90' }}></i> Featured Category Card Images (Home Page Carousel)
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                          Update the cover images for cards shown on the Home Page "Featured Categories" slider. Click "Change Image" on any category to upload a new photo, select from your media library, or paste a URL.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
                      {localCategories.map((cat) => {
                        const cover = cat.image_url || cat.image || '/assets/images/cups-product.avif';
                        return (
                          <div
                            key={cat.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '12px 14px',
                              background: '#ffffff',
                              border: '1.5px solid #f1f5f9',
                              borderRadius: '12px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                            }}
                          >
                            <div
                              style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                border: '1.5px solid #e2e8f0',
                                background: '#f8fafc',
                                flexShrink: 0
                              }}
                            >
                              <img
                                src={cover}
                                alt={cat.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.currentTarget.src = '/assets/images/cups-product.avif'; }}
                              />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h4
                                style={{
                                  margin: '0 0 3px 0',
                                  fontSize: '14px',
                                  fontWeight: 700,
                                  color: '#0f172a',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {cat.name}
                              </h4>
                              <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '8px' }}>
                                <i className={cat.icon || 'fa-solid fa-gift'} style={{ color: '#c40b90', marginRight: '5px' }}></i>
                                {cat.subcategories || 'Direct Collection'}
                              </div>
                              <button
                                type="button"
                                className="admin-btn-secondary"
                                style={{
                                  padding: '5px 12px',
                                  fontSize: '11.5px',
                                  height: 'auto',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                                onClick={() => handleOpenEditCategory(cat)}
                              >
                                <i className="fa-solid fa-pen-to-square"></i> Change Image
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  SUBTAB 5: DISCOUNT & CORPORATE BANNERS
                  ───────────────────────────────────────────────────────── */}
              {cmsSubTab === 'banners' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                  {/* Weekend Flash Discount Banner */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-bolt" style={{ color: '#f9b228' }}></i> Weekend Flash Discount Banner
                      </h3>
                    </div>

                    <div className="admin-cms-preview-banner light-banner">
                      <div>
                        <span style={{ fontSize: '11px', background: '#e7137a', color: '#fff', padding: '3px 8px', borderRadius: '20px', fontWeight: 800 }}>
                          {localHomeContent?.discountBanner?.pillLabel || 'FLASH DEAL'}
                        </span>
                        <div style={{ fontSize: '17px', fontWeight: 900, marginTop: '6px' }}>
                          {localHomeContent?.discountBanner?.title}{' '}
                          <span style={{ color: '#c40b90' }}>{localHomeContent?.discountBanner?.highlight}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {localHomeContent?.discountBanner?.description}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#059669' }}>
                          {localHomeContent?.discountBanner?.fromPrice}
                        </div>
                      </div>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label>Pill / Badge Tag</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localHomeContent?.discountBanner?.pillLabel || ''}
                          onChange={(e) => handleUpdateSectionField('discountBanner', 'pillLabel', e.target.value)}
                          placeholder="e.g. Weekend Flash Deal"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Starting Price Tag</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localHomeContent?.discountBanner?.fromPrice || ''}
                          onChange={(e) => handleUpdateSectionField('discountBanner', 'fromPrice', e.target.value)}
                          placeholder="e.g. Starting from ₹199"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Headline</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localHomeContent?.discountBanner?.title || ''}
                          onChange={(e) => handleUpdateSectionField('discountBanner', 'title', e.target.value)}
                          placeholder="e.g. Feel-Good Shopping"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Highlight Text</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localHomeContent?.discountBanner?.highlight || ''}
                          onChange={(e) => handleUpdateSectionField('discountBanner', 'highlight', e.target.value)}
                          placeholder="e.g. Weekend"
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Description</label>
                        <textarea
                          className="admin-form-textarea"
                          rows={2}
                          value={localHomeContent?.discountBanner?.description || ''}
                          onChange={(e) => handleUpdateSectionField('discountBanner', 'description', e.target.value)}
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Button Text</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localHomeContent?.discountBanner?.btnText || ''}
                          onChange={(e) => handleUpdateSectionField('discountBanner', 'btnText', e.target.value)}
                          placeholder="e.g. Shop Offers Now"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Corporate Bulk Gifting Banner */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-briefcase" style={{ color: '#7d2091' }}></i> Corporate Bulk Gifts Banner
                      </h3>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Badge / Category Tag</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.whyChoose?.corporateSubtitle || ''}
                        onChange={(e) => handleUpdateSectionField('whyChoose', 'corporateSubtitle', e.target.value)}
                        placeholder="e.g. Corporate & Events"
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Main Headline</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.whyChoose?.corporateTitle || ''}
                        onChange={(e) => handleUpdateSectionField('whyChoose', 'corporateTitle', e.target.value)}
                        placeholder="e.g. Bulk & Custom Corporate"
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Highlight Text</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.whyChoose?.corporateHighlight || ''}
                        onChange={(e) => handleUpdateSectionField('whyChoose', 'corporateHighlight', e.target.value)}
                        placeholder="e.g. Gifting Solutions"
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Description</label>
                      <textarea
                        className="admin-form-textarea"
                        rows={2}
                        value={localHomeContent?.whyChoose?.corporateDescription || ''}
                        onChange={(e) => handleUpdateSectionField('whyChoose', 'corporateDescription', e.target.value)}
                        placeholder="Empower your company culture with engraved diaries, metal pens, luxury gift boxes..."
                      />
                    </div>

                    <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      <div className="admin-form-group">
                        <label>WhatsApp Button Copy</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localHomeContent?.whyChoose?.corporateWhatsappText || ''}
                          onChange={(e) => handleUpdateSectionField('whyChoose', 'corporateWhatsappText', e.target.value)}
                          placeholder="e.g. Chat on WhatsApp"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Quote Button Copy</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localHomeContent?.whyChoose?.corporateQuoteText || ''}
                          onChange={(e) => handleUpdateSectionField('whyChoose', 'corporateQuoteText', e.target.value)}
                          placeholder="e.g. Request Bulk Quote"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  SUBTAB 6: WHY CHOOSE US & 5 VALUE PROPOSITIONS
                  ───────────────────────────────────────────────────────── */}
              {cmsSubTab === 'whychoose' && (
                <div>
                  <div className="admin-panel-card" style={{ marginBottom: '20px' }}>
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-award" style={{ color: '#c40b90' }}></i> Why Choose Us Section Header
                      </h3>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label>Tag / Badge</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localHomeContent?.whyChoose?.tag || ''}
                          onChange={(e) => handleUpdateSectionField('whyChoose', 'tag', e.target.value)}
                          placeholder="e.g. Why Choose Fine Gift Studio"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Main Title</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localHomeContent?.whyChoose?.title || ''}
                          onChange={(e) => handleUpdateSectionField('whyChoose', 'title', e.target.value)}
                          placeholder="e.g. Exceptional Quality in"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Highlight Title</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localHomeContent?.whyChoose?.highlight || ''}
                          onChange={(e) => handleUpdateSectionField('whyChoose', 'highlight', e.target.value)}
                          placeholder="e.g. Every Gift"
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Section Sub-Description</label>
                        <textarea
                          className="admin-form-textarea"
                          rows={2}
                          value={localHomeContent?.whyChoose?.description || ''}
                          onChange={(e) => handleUpdateSectionField('whyChoose', 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-list-check" style={{ color: '#059669' }}></i> 5 Value Proposition Feature Cards
                      </h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      {(localHomeContent?.whyChoose?.features || []).map((feat, fIdx) => (
                        <div key={fIdx} className="admin-cms-feature-card">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#c40b90', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                              {fIdx + 1}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Feature Card #{fIdx + 1}</span>
                          </div>

                          <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                            <label>Title</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={feat.title || ''}
                              onChange={(e) => handleUpdateWhyFeature(fIdx, 'title', e.target.value)}
                            />
                          </div>

                          <div className="admin-form-group">
                            <label>Description</label>
                            <textarea
                              className="admin-form-textarea"
                              rows={2}
                              value={feat.desc || ''}
                              onChange={(e) => handleUpdateWhyFeature(fIdx, 'desc', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  SUBTAB 7: 3 COLUMNS & CUSTOMER TESTIMONIALS
                  ───────────────────────────────────────────────────────── */}
              {cmsSubTab === 'collections-reviews' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                  {/* 3 Columns Headlines */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-table-columns" style={{ color: '#0d97d5' }}></i> Tri-Column Collection Titles
                      </h3>
                    </div>

                    <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#e7137a', marginBottom: '8px' }}>
                        Column 1 (Pink Badge)
                      </div>
                      <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="admin-form-group">
                          <label>Title</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localHomeContent?.productLists?.col1Title || ''}
                            onChange={(e) => handleUpdateSectionField('productLists', 'col1Title', e.target.value)}
                            placeholder="New Collection"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Subtitle</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localHomeContent?.productLists?.col1Sub || ''}
                            onChange={(e) => handleUpdateSectionField('productLists', 'col1Sub', e.target.value)}
                            placeholder="Fresh designs just for you"
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#b45309', marginBottom: '8px' }}>
                        Column 2 (Gold Badge)
                      </div>
                      <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="admin-form-group">
                          <label>Title</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localHomeContent?.productLists?.col2Title || ''}
                            onChange={(e) => handleUpdateSectionField('productLists', 'col2Title', e.target.value)}
                            placeholder="Top Rated"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Subtitle</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localHomeContent?.productLists?.col2Sub || ''}
                            onChange={(e) => handleUpdateSectionField('productLists', 'col2Sub', e.target.value)}
                            placeholder="Customer's favourite picks"
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#0d97d5', marginBottom: '8px' }}>
                        Column 3 (Blue Badge)
                      </div>
                      <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="admin-form-group">
                          <label>Title</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localHomeContent?.productLists?.col3Title || ''}
                            onChange={(e) => handleUpdateSectionField('productLists', 'col3Title', e.target.value)}
                            placeholder="Best Seller"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Subtitle</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localHomeContent?.productLists?.col3Sub || ''}
                            onChange={(e) => handleUpdateSectionField('productLists', 'col3Sub', e.target.value)}
                            placeholder="Most loved gifts"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Testimonials Header */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-comments" style={{ color: '#c40b90' }}></i> Customer Reviews Header
                      </h3>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Tag / Badge</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.testimonials?.tag || ''}
                        onChange={(e) => handleUpdateSectionField('testimonials', 'tag', e.target.value)}
                        placeholder="e.g. Customer Love & Trust"
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Main Headline</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.testimonials?.title || ''}
                        onChange={(e) => handleUpdateSectionField('testimonials', 'title', e.target.value)}
                        placeholder="e.g. What Our Customers"
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                      <label>Highlight Text</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localHomeContent?.testimonials?.highlight || ''}
                        onChange={(e) => handleUpdateSectionField('testimonials', 'highlight', e.target.value)}
                        placeholder="e.g. Say About Us"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Sub-Description</label>
                      <textarea
                        className="admin-form-textarea"
                        rows={3}
                        value={localHomeContent?.testimonials?.description || ''}
                        onChange={(e) => handleUpdateSectionField('testimonials', 'description', e.target.value)}
                        placeholder="Real heartfelt feedback and unboxing stories from happy gift-givers across India."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
             TAB: ABOUT US PAGE CMS WORKSPACE
             ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'about-cms' && (
            <div className="admin-workspace">
              {/* Header */}
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-heart-pulse" style={{ color: '#e7137a' }}></i> About Page CMS &amp; Story Studio
                  </h1>
                  <p className="admin-page-subtitle">
                    Customize your brand story, founder quote, milestone statistics, crafting process, values, and section visibility.
                  </p>
                </div>
                <div className="admin-page-actions">
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={handleResetAboutContent}
                    title="Reset all About Us story and copy back to defaults"
                  >
                    <i className="fa-solid fa-rotate-left"></i> Reset Defaults
                  </button>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => onNavigate('/about-us')}
                    title="Preview live About Us page"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> Preview About Page
                  </button>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleSaveAboutContent}
                    disabled={isAboutSaving}
                    style={{ background: 'linear-gradient(135deg, #c40b90 0%, #e7137a 100%)' }}
                  >
                    <i className={`fa-solid ${isAboutSaving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`}></i>{' '}
                    {isAboutSaving ? 'Publishing...' : 'Save & Publish Live'}
                  </button>
                </div>
              </div>

              {/* Sub-Navigation */}
              <div className="admin-cms-subnav">
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${aboutSubTab === 'visibility' ? 'active' : ''}`}
                  onClick={() => setAboutSubTab('visibility')}
                >
                  <i className="fa-solid fa-eye"></i> Section Visibility
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${aboutSubTab === 'hero' ? 'active' : ''}`}
                  onClick={() => setAboutSubTab('hero')}
                >
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Hero &amp; 4 Highlights
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${aboutSubTab === 'story' ? 'active' : ''}`}
                  onClick={() => setAboutSubTab('story')}
                >
                  <i className="fa-solid fa-book-open"></i> Brand Story &amp; Founder Quote
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${aboutSubTab === 'stats' ? 'active' : ''}`}
                  onClick={() => setAboutSubTab('stats')}
                >
                  <i className="fa-solid fa-chart-simple"></i> Milestone Stats (4 Metrics)
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${aboutSubTab === 'process' ? 'active' : ''}`}
                  onClick={() => setAboutSubTab('process')}
                >
                  <i className="fa-solid fa-list-check"></i> Crafting Process (4 Steps)
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${aboutSubTab === 'values' ? 'active' : ''}`}
                  onClick={() => setAboutSubTab('values')}
                >
                  <i className="fa-solid fa-shield-heart"></i> Core Values (3 Pillars)
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${aboutSubTab === 'cta' ? 'active' : ''}`}
                  onClick={() => setAboutSubTab('cta')}
                >
                  <i className="fa-solid fa-bullhorn"></i> Bottom Call to Action
                </button>
              </div>

              {/* ─────────────────────────────────────────────────────────
                  ABOUT SUBTAB 1: SECTION VISIBILITY
                  ───────────────────────────────────────────────────────── */}
              {aboutSubTab === 'visibility' && (
                <div className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-toggle-on" style={{ color: '#059669' }}></i> About Page Sections Switchboard
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        Turn any section of the About Us page ON or OFF in real-time.
                      </p>
                    </div>
                  </div>

                  <div className="admin-cms-toggle-grid">
                    {[
                      {
                        key: 'hero',
                        title: 'Hero Statement Banner',
                        desc: 'Top visual statement with brand eyebrow, main headline, and story scroll CTA button.',
                        icon: 'fa-solid fa-heading',
                      },
                      {
                        key: 'highlights',
                        title: '4 Value Highlights Strip',
                        desc: 'Horizontal badge strip: Custom Personalization, Luxury Packaging, Pan-India Delivery, Handcrafted.',
                        icon: 'fa-solid fa-wand-magic-sparkles',
                      },
                      {
                        key: 'story',
                        title: 'Artisan Journey & Founder Quote',
                        desc: 'Mangalore studio origins narrative, photo collage, and founder commitment quote block.',
                        icon: 'fa-solid fa-book-open',
                      },
                      {
                        key: 'stats',
                        title: 'Milestone Numbers & Statistics',
                        desc: '4 metric counters: 50K+ Gifts Delivered, 15K+ Custom Designs, 99.4% On-Time, 4.9★ Reviews.',
                        icon: 'fa-solid fa-chart-line',
                      },
                      {
                        key: 'process',
                        title: 'How It Works (4-Step Process)',
                        desc: 'Crafting journey: Choose Item, Personalize It, Artisan Precision, Delivered with Joy.',
                        icon: 'fa-solid fa-list-check',
                      },
                      {
                        key: 'values',
                        title: 'Core Values & Pillars',
                        desc: 'Three pillars: Uncompromised Quality, Thoughtful Packaging, Customer First.',
                        icon: 'fa-solid fa-shield-heart',
                      },
                      {
                        key: 'cta',
                        title: 'Bottom Call to Action Banner',
                        desc: 'High-converting closing banner with direct buttons to shop collections or contact the studio.',
                        icon: 'fa-solid fa-bullhorn',
                      },
                    ].map((sec) => {
                      const isVisible = localAboutContent?.visibility?.[sec.key] !== false;
                      return (
                        <div
                          key={sec.key}
                          className={`admin-cms-toggle-card ${isVisible ? 'active' : 'inactive'}`}
                        >
                          <div className="admin-cms-toggle-info">
                            <div className={`admin-cms-toggle-icon ${isVisible ? 'active' : 'inactive'}`}>
                              <i className={sec.icon}></i>
                            </div>
                            <div>
                              <div className="admin-cms-toggle-title">{sec.title}</div>
                              <div className="admin-cms-toggle-desc">{sec.desc}</div>
                              <div style={{ marginTop: '8px', fontSize: '11.5px', fontWeight: 700, color: isVisible ? '#059669' : '#64748b' }}>
                                {isVisible ? '● Visible on About Page' : '○ Hidden from Customers'}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`admin-switch-btn ${isVisible ? 'active' : ''}`}
                            onClick={() => handleUpdateAboutVisibility(sec.key, !isVisible)}
                            title={isVisible ? 'Click to hide this section' : 'Click to show this section'}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  ABOUT SUBTAB 2: HERO & 4 VALUE HIGHLIGHTS
                  ───────────────────────────────────────────────────────── */}
              {aboutSubTab === 'hero' && (
                <div>
                  <div className="admin-panel-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#c40b90' }}></i> Hero Statement Section
                      </h3>
                    </div>

                    {/* Live Preview */}
                    <div className="admin-cms-preview-banner">
                      <div>
                        <div style={{ fontSize: '12px', color: '#f9b228', fontWeight: 800, textTransform: 'uppercase' }}>
                          {localAboutContent?.hero?.eyebrow || 'The Art of Gifting'}
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '2px' }}>
                          {localAboutContent?.hero?.title}{' '}
                          <span style={{ color: '#f9b228' }}>{localAboutContent?.hero?.highlightTitle}</span>
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#cbd5e1', marginTop: '4px', maxWidth: '520px' }}>
                          {localAboutContent?.hero?.subtitle}
                        </div>
                      </div>
                      <span className="admin-cms-slide-badge" style={{ background: '#fdf2f8', color: '#c40b90' }}>
                        {localAboutContent?.hero?.tagline || 'Made Personal, Made Memorable'}
                      </span>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label>Eyebrow Tag</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.hero?.eyebrow || ''}
                          onChange={(e) => handleUpdateAboutHero('eyebrow', e.target.value)}
                          placeholder="e.g. The Art of Gifting"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Main Title</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.hero?.title || ''}
                          onChange={(e) => handleUpdateAboutHero('title', e.target.value)}
                          placeholder="e.g. Every Gift Tells"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Highlight Title (Golden / Accent)</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.hero?.highlightTitle || ''}
                          onChange={(e) => handleUpdateAboutHero('highlightTitle', e.target.value)}
                          placeholder="e.g. Your Story."
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>CTA Button Text</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.hero?.ctaText || ''}
                          onChange={(e) => handleUpdateAboutHero('ctaText', e.target.value)}
                          placeholder="e.g. Discover Our Story"
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Tagline / Bottom Badge</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.hero?.tagline || ''}
                          onChange={(e) => handleUpdateAboutHero('tagline', e.target.value)}
                          placeholder="e.g. Made Personal, Made Memorable"
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Subtitle / Brand Mission Copy</label>
                        <textarea
                          className="admin-form-textarea"
                          rows={2}
                          value={localAboutContent?.hero?.subtitle || ''}
                          onChange={(e) => handleUpdateAboutHero('subtitle', e.target.value)}
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Hero Background Photography Image</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <img
                            src={localAboutContent?.hero?.heroImage || '/assets/images/hero.avif'}
                            alt="About Hero"
                            style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                            onError={(e) => { e.currentTarget.src = '/assets/images/hero.avif'; }}
                          />
                          <input
                            type="text"
                            className="admin-form-input"
                            style={{ flex: 1 }}
                            value={localAboutContent?.hero?.heroImage || ''}
                            onChange={(e) => handleUpdateAboutHero('heroImage', e.target.value)}
                            placeholder="Image URL or pick from Studio Media Library"
                          />
                          <button
                            type="button"
                            className="admin-btn-secondary"
                            onClick={() => setAboutImagePickerField(aboutImagePickerField === 'hero' ? null : 'hero')}
                          >
                            <i className="fa-solid fa-photo-film"></i> {aboutImagePickerField === 'hero' ? 'Close Media' : 'Choose Media'}
                          </button>
                        </div>
                        {aboutImagePickerField === 'hero' && (
                          <div style={{ marginTop: '10px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                              Select media asset for About Hero background:
                            </div>
                            <div className="admin-media-picker-grid" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                              {mediaAssets.map((asset) => (
                                <button
                                  key={asset.id}
                                  type="button"
                                  className={`admin-media-picker-item ${localAboutContent?.hero?.heroImage === asset.url ? 'selected' : ''}`}
                                  onClick={() => {
                                    handleUpdateAboutHero('heroImage', asset.url);
                                    setAboutImagePickerField(null);
                                  }}
                                  title={asset.name}
                                >
                                  <img src={asset.url} alt={asset.name} />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4 Value Highlights Strip */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-layer-group" style={{ color: '#059669' }}></i> 4 Value Highlights Cards
                      </h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      {(localAboutContent?.highlights || []).map((hl, hIdx) => (
                        <div key={hIdx} className="admin-cms-feature-card">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fdf2f8', color: '#c40b90', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                              <i className={hl.icon || 'fa-solid fa-gift'}></i>
                            </div>
                            <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Highlight #{hIdx + 1}</span>
                          </div>

                          <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                            <label>Title</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={hl.title || ''}
                              onChange={(e) => handleUpdateAboutHighlight(hIdx, 'title', e.target.value)}
                            />
                          </div>

                          <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                            <label>Icon Class (FontAwesome)</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={hl.icon || ''}
                              onChange={(e) => handleUpdateAboutHighlight(hIdx, 'icon', e.target.value)}
                            />
                          </div>

                          <div className="admin-form-group">
                            <label>Subtitle / Description</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={hl.desc || ''}
                              onChange={(e) => handleUpdateAboutHighlight(hIdx, 'desc', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  ABOUT SUBTAB 3: BRAND STORY & FOUNDER QUOTE
                  ───────────────────────────────────────────────────────── */}
              {aboutSubTab === 'story' && (
                <div>
                  <div className="admin-panel-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-book-open" style={{ color: '#c40b90' }}></i> Our Story &amp; Origins Narrative
                      </h3>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label>Section Badge Tag</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.story?.badge || ''}
                          onChange={(e) => handleUpdateAboutStory('badge', e.target.value)}
                          placeholder="e.g. Our Journey"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Main Headline</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.story?.title || ''}
                          onChange={(e) => handleUpdateAboutStory('title', e.target.value)}
                          placeholder="e.g. Crafting Memories That"
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Highlight Title</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.story?.highlightTitle || ''}
                          onChange={(e) => handleUpdateAboutStory('highlightTitle', e.target.value)}
                          placeholder="e.g. Last a Lifetime"
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Story Paragraph 1 (Founding Vision)</label>
                        <textarea
                          className="admin-form-textarea"
                          rows={3}
                          value={localAboutContent?.story?.p1 || ''}
                          onChange={(e) => handleUpdateAboutStory('p1', e.target.value)}
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Story Paragraph 2 (Mangalore Studio &amp; Artisan Craft)</label>
                        <textarea
                          className="admin-form-textarea"
                          rows={3}
                          value={localAboutContent?.story?.p2 || ''}
                          onChange={(e) => handleUpdateAboutStory('p2', e.target.value)}
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Founder Commitment Quote</label>
                        <textarea
                          className="admin-form-textarea"
                          rows={2}
                          value={localAboutContent?.story?.quote || ''}
                          onChange={(e) => handleUpdateAboutStory('quote', e.target.value)}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Quote Signoff / Author</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.story?.quoteAuthor || ''}
                          onChange={(e) => handleUpdateAboutStory('quoteAuthor', e.target.value)}
                          placeholder="e.g. — The Fine Gift Studio Family"
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Story Paragraph 3 (Modern Laser Technology &amp; Future)</label>
                        <textarea
                          className="admin-form-textarea"
                          rows={3}
                          value={localAboutContent?.story?.p3 || ''}
                          onChange={(e) => handleUpdateAboutStory('p3', e.target.value)}
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Floating Badge Title</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.story?.floatingBadgeTitle || ''}
                          onChange={(e) => handleUpdateAboutStory('floatingBadgeTitle', e.target.value)}
                          placeholder="e.g. Mangalore Roots"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Floating Badge Subtitle</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.story?.floatingBadgeSubtitle || ''}
                          onChange={(e) => handleUpdateAboutStory('floatingBadgeSubtitle', e.target.value)}
                          placeholder="e.g. Delivering Smiles Pan-India"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visual Collage Images */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-images" style={{ color: '#0d97d5' }}></i> Story Section Photography Collage
                      </h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      {[
                        { key: 'img1', label: 'Primary Feature Photo (Luxury Packaging)', defaultSrc: '/assets/images/packaging.avif' },
                        { key: 'img2', label: 'Secondary Photo 1 (Artisanal Design)', defaultSrc: '/assets/images/art-design.avif' },
                        { key: 'img3', label: 'Secondary Photo 2 (Custom Mugs)', defaultSrc: '/assets/images/cups-product.avif' },
                      ].map((item) => (
                        <div key={item.key} className="admin-cms-feature-card">
                          <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a', marginBottom: '8px' }}>
                            {item.label}
                          </div>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                            <img
                              src={localAboutContent?.story?.[item.key] || item.defaultSrc}
                              alt={item.label}
                              style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                              onError={(e) => { e.currentTarget.src = item.defaultSrc; }}
                            />
                            <input
                              type="text"
                              className="admin-form-input"
                              style={{ flex: 1, fontSize: '12px' }}
                              value={localAboutContent?.story?.[item.key] || ''}
                              onChange={(e) => handleUpdateAboutStory(item.key, e.target.value)}
                              placeholder="Image URL"
                            />
                          </div>
                          <button
                            type="button"
                            className="admin-btn-secondary"
                            style={{ width: '100%', fontSize: '12px', padding: '6px' }}
                            onClick={() => setAboutImagePickerField(aboutImagePickerField === item.key ? null : item.key)}
                          >
                            <i className="fa-solid fa-photo-film"></i> {aboutImagePickerField === item.key ? 'Close Picker' : 'Choose from Library'}
                          </button>
                          {aboutImagePickerField === item.key && (
                            <div style={{ marginTop: '8px', padding: '8px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <div className="admin-media-picker-grid" style={{ maxHeight: '140px', overflowY: 'auto' }}>
                                {mediaAssets.map((asset) => (
                                  <button
                                    key={asset.id}
                                    type="button"
                                    className={`admin-media-picker-item ${localAboutContent?.story?.[item.key] === asset.url ? 'selected' : ''}`}
                                    onClick={() => {
                                      handleUpdateAboutStory(item.key, asset.url);
                                      setAboutImagePickerField(null);
                                    }}
                                  >
                                    <img src={asset.url} alt={asset.name} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  ABOUT SUBTAB 4: MILESTONE STATS (4 METRICS)
                  ───────────────────────────────────────────────────────── */}
              {aboutSubTab === 'stats' && (
                <div className="admin-panel-card">
                  <div className="admin-panel-header">
                    <h3 className="admin-panel-title">
                      <i className="fa-solid fa-chart-line" style={{ color: '#f9b228' }}></i> 4 Milestone Numbers &amp; Metrics
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    {(localAboutContent?.stats || []).map((st, sIdx) => (
                      <div key={sIdx} className="admin-cms-feature-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#c40b90' }}>Metric #{sIdx + 1}</span>
                          <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                            {st.number}<span style={{ color: '#f9b228' }}>{st.suffix}</span>
                          </span>
                        </div>

                        <div className="admin-form-grid" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: '8px' }}>
                          <div className="admin-form-group">
                            <label>Value Number</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={st.number || ''}
                              onChange={(e) => handleUpdateAboutStat(sIdx, 'number', e.target.value)}
                            />
                          </div>

                          <div className="admin-form-group">
                            <label>Suffix</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={st.suffix || ''}
                              onChange={(e) => handleUpdateAboutStat(sIdx, 'suffix', e.target.value)}
                              placeholder="K+, %, ★"
                            />
                          </div>
                        </div>

                        <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                          <label>Stat Headline Label</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={st.label || ''}
                            onChange={(e) => handleUpdateAboutStat(sIdx, 'label', e.target.value)}
                          />
                        </div>

                        <div className="admin-form-group">
                          <label>Description Subtitle</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={st.desc || ''}
                            onChange={(e) => handleUpdateAboutStat(sIdx, 'desc', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  ABOUT SUBTAB 5: CRAFTING PROCESS (4 STEPS)
                  ───────────────────────────────────────────────────────── */}
              {aboutSubTab === 'process' && (
                <div>
                  <div className="admin-panel-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-list-check" style={{ color: '#059669' }}></i> Process Section Header
                      </h3>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label>Badge</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.process?.badge || ''}
                          onChange={(e) => handleUpdateAboutProcessHeader('badge', e.target.value)}
                          placeholder="e.g. Simple Process"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.process?.title || ''}
                          onChange={(e) => handleUpdateAboutProcessHeader('title', e.target.value)}
                          placeholder="e.g. How We Turn Ideas into"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Highlight Title</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.process?.highlightTitle || ''}
                          onChange={(e) => handleUpdateAboutProcessHeader('highlightTitle', e.target.value)}
                          placeholder="e.g. Heirlooms"
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Sub-Description</label>
                        <textarea
                          className="admin-form-textarea"
                          rows={2}
                          value={localAboutContent?.process?.description || ''}
                          onChange={(e) => handleUpdateAboutProcessHeader('description', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-shoe-prints" style={{ color: '#7d2091' }}></i> 4 Step Cards
                      </h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                      {(localAboutContent?.process?.steps || []).map((step, pIdx) => (
                        <div key={pIdx} className="admin-cms-feature-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#7d2091', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                              {step.num || `0${pIdx + 1}`}
                            </span>
                            <i className={step.icon || 'fa-solid fa-gift'} style={{ color: '#c40b90', fontSize: '16px' }}></i>
                          </div>

                          <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                            <label>Step Title</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={step.title || ''}
                              onChange={(e) => handleUpdateAboutProcessStep(pIdx, 'title', e.target.value)}
                            />
                          </div>

                          <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                            <label>Icon Class</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={step.icon || ''}
                              onChange={(e) => handleUpdateAboutProcessStep(pIdx, 'icon', e.target.value)}
                            />
                          </div>

                          <div className="admin-form-group">
                            <label>Description</label>
                            <textarea
                              className="admin-form-textarea"
                              rows={2}
                              value={step.desc || ''}
                              onChange={(e) => handleUpdateAboutProcessStep(pIdx, 'desc', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  ABOUT SUBTAB 6: CORE VALUES (3 PILLARS)
                  ───────────────────────────────────────────────────────── */}
              {aboutSubTab === 'values' && (
                <div>
                  <div className="admin-panel-card" style={{ marginBottom: '24px' }}>
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-shield-heart" style={{ color: '#c40b90' }}></i> Values Section Header
                      </h3>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label>Badge</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.values?.badge || ''}
                          onChange={(e) => handleUpdateAboutValuesHeader('badge', e.target.value)}
                          placeholder="e.g. Our Pillars"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.values?.title || ''}
                          onChange={(e) => handleUpdateAboutValuesHeader('title', e.target.value)}
                          placeholder="e.g. The Values That"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Highlight Title</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localAboutContent?.values?.highlightTitle || ''}
                          onChange={(e) => handleUpdateAboutValuesHeader('highlightTitle', e.target.value)}
                          placeholder="e.g. Guide Us"
                        />
                      </div>

                      <div className="admin-form-group full-width">
                        <label>Description</label>
                        <textarea
                          className="admin-form-textarea"
                          rows={2}
                          value={localAboutContent?.values?.description || ''}
                          onChange={(e) => handleUpdateAboutValuesHeader('description', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-gem" style={{ color: '#0d97d5' }}></i> 3 Value Pillars
                      </h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      {(localAboutContent?.values?.pillars || []).map((pil, vIdx) => (
                        <div key={vIdx} className="admin-cms-feature-card">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fdf2f8', color: '#c40b90', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>
                              <i className={pil.icon || 'fa-solid fa-gem'}></i>
                            </div>
                            <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Pillar #{vIdx + 1}</span>
                          </div>

                          <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                            <label>Pillar Title</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={pil.title || ''}
                              onChange={(e) => handleUpdateAboutValuePillar(vIdx, 'title', e.target.value)}
                            />
                          </div>

                          <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                            <label>Icon Class</label>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={pil.icon || ''}
                              onChange={(e) => handleUpdateAboutValuePillar(vIdx, 'icon', e.target.value)}
                            />
                          </div>

                          <div className="admin-form-group">
                            <label>Description</label>
                            <textarea
                              className="admin-form-textarea"
                              rows={3}
                              value={pil.desc || ''}
                              onChange={(e) => handleUpdateAboutValuePillar(vIdx, 'desc', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  ABOUT SUBTAB 7: BOTTOM CALL TO ACTION
                  ───────────────────────────────────────────────────────── */}
              {aboutSubTab === 'cta' && (
                <div className="admin-panel-card">
                  <div className="admin-panel-header">
                    <h3 className="admin-panel-title">
                      <i className="fa-solid fa-bullhorn" style={{ color: '#c40b90' }}></i> Bottom Call to Action Banner
                    </h3>
                  </div>

                  <div className="admin-cms-preview-banner light-banner" style={{ marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 900 }}>
                        {localAboutContent?.cta?.title}{' '}
                        <span style={{ color: '#c40b90' }}>{localAboutContent?.cta?.highlightTitle}</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                        {localAboutContent?.cta?.description}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" className="admin-btn-primary" style={{ pointerEvents: 'none', fontSize: '11px', padding: '6px 12px' }}>
                        {localAboutContent?.cta?.primaryBtnText || 'Explore'}
                      </button>
                      <button type="button" className="admin-btn-secondary" style={{ pointerEvents: 'none', fontSize: '11px', padding: '6px 12px' }}>
                        {localAboutContent?.cta?.secondaryBtnText || 'Contact'}
                      </button>
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>Headline Title</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localAboutContent?.cta?.title || ''}
                        onChange={(e) => handleUpdateAboutCta('title', e.target.value)}
                        placeholder="e.g. Ready to Turn Moments into"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Highlight Title</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localAboutContent?.cta?.highlightTitle || ''}
                        onChange={(e) => handleUpdateAboutCta('highlightTitle', e.target.value)}
                        placeholder="e.g. Memories?"
                      />
                    </div>

                    <div className="admin-form-group full-width">
                      <label>Banner Description</label>
                      <textarea
                        className="admin-form-textarea"
                        rows={2}
                        value={localAboutContent?.cta?.description || ''}
                        onChange={(e) => handleUpdateAboutCta('description', e.target.value)}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Primary Button Text (Catalog Link)</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localAboutContent?.cta?.primaryBtnText || ''}
                        onChange={(e) => handleUpdateAboutCta('primaryBtnText', e.target.value)}
                        placeholder="e.g. Explore Gift Collections"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Secondary Button Text (Contact Link)</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={localAboutContent?.cta?.secondaryBtnText || ''}
                        onChange={(e) => handleUpdateAboutCta('secondaryBtnText', e.target.value)}
                        placeholder="e.g. Contact Our Studio"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* TAB: CONTACT US PAGE CMS WORKSPACE                          */}
          {/* ─────────────────────────────────────────────────────────── */}
          {activeTab === 'contact-cms' && (
            <div className="admin-workspace">
              {/* Header */}
              <div className="admin-page-header">
                <div>
                  <h1>
                    <i className="fa-solid fa-headset" style={{ color: '#0d97d5' }}></i> Contact Page CMS &amp; Desk
                  </h1>
                  <p className="admin-page-subtitle">
                    Manage direct contact hotlines, WhatsApp priority desk, studio hours, inquiry prompts, and Mangalore workshop showcase.
                  </p>
                </div>
                <div className="admin-page-actions">
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={handleResetContactContent}
                    title="Reset all Contact Us channels and copy back to defaults"
                  >
                    <i className="fa-solid fa-rotate-left"></i> Reset Defaults
                  </button>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => onNavigate('/contact')}
                    title="Preview live Contact Us page"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> Preview Contact Page
                  </button>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleSaveContactContent}
                    disabled={isContactSaving}
                    style={{ background: 'linear-gradient(135deg, #0d97d5 0%, #7d2091 100%)' }}
                  >
                    <i className={`fa-solid ${isContactSaving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`}></i>{' '}
                    {isContactSaving ? 'Publishing...' : 'Save & Publish Live'}
                  </button>
                </div>
              </div>

              {/* Sub-Navigation */}
              <div className="admin-cms-subnav">
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${contactSubTab === 'visibility' ? 'active' : ''}`}
                  onClick={() => setContactSubTab('visibility')}
                >
                  <i className="fa-solid fa-eye"></i> Section Visibility
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${contactSubTab === 'channels' ? 'active' : ''}`}
                  onClick={() => setContactSubTab('channels')}
                >
                  <i className="fa-solid fa-phone-volume"></i> Hotlines &amp; Quick Channels
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${contactSubTab === 'hero-form' ? 'active' : ''}`}
                  onClick={() => setContactSubTab('hero-form')}
                >
                  <i className="fa-solid fa-envelope-open-text"></i> Hero &amp; Inquiry Form
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${contactSubTab === 'sidebar' ? 'active' : ''}`}
                  onClick={() => setContactSubTab('sidebar')}
                >
                  <i className="fa-solid fa-building-columns"></i> Concierge Desks &amp; Studio
                </button>
                <button
                  type="button"
                  className={`admin-cms-subtab-btn ${contactSubTab === 'workshop' ? 'active' : ''}`}
                  onClick={() => setContactSubTab('workshop')}
                >
                  <i className="fa-solid fa-truck-fast"></i> Workshop &amp; Delivery Showcase
                </button>
              </div>

              {/* SUBTAB 1: SECTION VISIBILITY */}
              {contactSubTab === 'visibility' && (
                <div className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-toggle-on" style={{ color: '#059669' }}></i> Contact Page Sections Switchboard
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        Turn any section of the Contact Us page ON or OFF in real-time.
                      </p>
                    </div>
                  </div>

                  <div className="admin-cms-toggle-grid">
                    {[
                      {
                        key: 'hero',
                        title: 'Hero Statement Banner',
                        desc: 'Top concierge header with eyebrow badge, main title, and studio commitment statement.',
                        icon: 'fa-solid fa-heading',
                      },
                      {
                        key: 'channels',
                        title: 'Quick Channels Strip (4 Hotlines)',
                        desc: 'Horizontal hotline bar: Phone, WhatsApp, Official Email, and Artisan Workshop location.',
                        icon: 'fa-solid fa-phone-volume',
                      },
                      {
                        key: 'form',
                        title: 'Inquiry Concierge Form',
                        desc: 'Interactive inquiry form with custom order prompt chips, name, contact, and message fields.',
                        icon: 'fa-solid fa-envelope-open-text',
                      },
                      {
                        key: 'sidebar',
                        title: 'Concierge Desks & Address Sidebar',
                        desc: 'Side cards: WhatsApp VIP Desk, Direct Studio Call, Mangalore Studio Hours, and Corporate B2B.',
                        icon: 'fa-solid fa-building-columns',
                      },
                      {
                        key: 'workshop',
                        title: 'Mangalore Workshop & Dispatch Showcase',
                        desc: 'Workshop showcase banner, 4 delivery perks, interactive hub card, and guarantee badges.',
                        icon: 'fa-solid fa-truck-fast',
                      },
                    ].map((sec) => {
                      const isVisible = localContactContent?.visibility?.[sec.key] !== false;
                      return (
                        <div
                          key={sec.key}
                          className={`admin-cms-toggle-card ${isVisible ? 'active' : 'inactive'}`}
                        >
                          <div className="admin-cms-toggle-info">
                            <div className={`admin-cms-toggle-icon ${isVisible ? 'active' : 'inactive'}`}>
                              <i className={sec.icon}></i>
                            </div>
                            <div>
                              <div className="admin-cms-toggle-title">{sec.title}</div>
                              <div className="admin-cms-toggle-desc">{sec.desc}</div>
                              <div style={{ marginTop: '8px', fontSize: '11.5px', fontWeight: 700, color: isVisible ? '#059669' : '#64748b' }}>
                                {isVisible ? '● Visible on Contact Page' : '○ Hidden from Customers'}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`admin-cms-toggle-switch ${isVisible ? 'on' : 'off'}`}
                            onClick={() => handleUpdateContactVisibility(sec.key, !isVisible)}
                            title={isVisible ? 'Click to hide this section' : 'Click to show this section'}
                          >
                            <span className="admin-cms-toggle-knob"></span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: HOTLINES & QUICK CHANNELS */}
              {contactSubTab === 'channels' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-phone-volume" style={{ color: '#0d97d5' }}></i> Top 4 Direct Contact Channels
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        These quick-action cards appear directly below the hero header for instant customer access.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      {/* Phone Channel */}
                      <div className="admin-cms-item-card" style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                            <i className="fa-solid fa-phone"></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Phone Hotline</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Direct voice call channel</div>
                          </div>
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Channel Label</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.channels?.phoneLabel || ''}
                            onChange={(e) => handleUpdateContactChannels('phoneLabel', e.target.value)}
                            placeholder="Direct Hotline"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Display Phone Number</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.channels?.phoneVal || ''}
                            onChange={(e) => handleUpdateContactChannels('phoneVal', e.target.value)}
                            placeholder="+91 0000 000 000"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Click-to-Call Link (tel:)</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.channels?.phoneLink || ''}
                            onChange={(e) => handleUpdateContactChannels('phoneLink', e.target.value)}
                            placeholder="tel:+910000000000"
                          />
                        </div>
                      </div>

                      {/* WhatsApp Channel */}
                      <div className="admin-cms-item-card" style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                            <i className="fa-brands fa-whatsapp"></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>WhatsApp Live</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Instant chat with artisan</div>
                          </div>
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Channel Label</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.channels?.whatsappLabel || ''}
                            onChange={(e) => handleUpdateContactChannels('whatsappLabel', e.target.value)}
                            placeholder="WhatsApp Live"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Display Text</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.channels?.whatsappVal || ''}
                            onChange={(e) => handleUpdateContactChannels('whatsappVal', e.target.value)}
                            placeholder="Chat with Artisan"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>WhatsApp Link (wa.me)</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.channels?.whatsappLink || ''}
                            onChange={(e) => handleUpdateContactChannels('whatsappLink', e.target.value)}
                            placeholder="https://wa.me/910000000000"
                          />
                        </div>
                      </div>

                      {/* Email Channel */}
                      <div className="admin-cms-item-card" style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fdf2f8', color: '#c40b90', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                            <i className="fa-solid fa-envelope"></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Official Email</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Formal inquiries &amp; quotes</div>
                          </div>
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Channel Label</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.channels?.emailLabel || ''}
                            onChange={(e) => handleUpdateContactChannels('emailLabel', e.target.value)}
                            placeholder="Official Email"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Email Address</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.channels?.emailVal || ''}
                            onChange={(e) => handleUpdateContactChannels('emailVal', e.target.value)}
                            placeholder="info@gift.com"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Click-to-Mail Link (mailto:)</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.channels?.emailLink || ''}
                            onChange={(e) => handleUpdateContactChannels('emailLink', e.target.value)}
                            placeholder="mailto:info@gift.com"
                          />
                        </div>
                      </div>

                      {/* Workshop Location Channel */}
                      <div className="admin-cms-item-card" style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                            <i className="fa-solid fa-location-dot"></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Workshop Hub</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Base manufacturing studio</div>
                          </div>
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Channel Label</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.channels?.workshopLabel || ''}
                            onChange={(e) => handleUpdateContactChannels('workshopLabel', e.target.value)}
                            placeholder="Artisan Workshop"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Workshop City / Location</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.channels?.workshopVal || ''}
                            onChange={(e) => handleUpdateContactChannels('workshopVal', e.target.value)}
                            placeholder="Mangalore, Karnataka"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: HERO & INQUIRY FORM */}
              {contactSubTab === 'hero-form' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Hero Header Card */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-heading" style={{ color: '#0d97d5' }}></i> Contact Us Hero Header
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        Top statement introducing your studio concierge service.
                      </p>
                    </div>

                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      <div className="admin-form-group">
                        <label>Eyebrow Pill Badge</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localContactContent?.hero?.eyebrow || ''}
                          onChange={(e) => handleUpdateContactHero('eyebrow', e.target.value)}
                          placeholder="Studio Concierge Online"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Headline Prefix</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localContactContent?.hero?.title || ''}
                          onChange={(e) => handleUpdateContactHero('title', e.target.value)}
                          placeholder="Let’s Craft Something"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Headline Highlight (Gradient Text)</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localContactContent?.hero?.highlightTitle || ''}
                          onChange={(e) => handleUpdateContactHero('highlightTitle', e.target.value)}
                          placeholder="Extraordinary Together."
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginTop: '16px' }}>
                      <label>Hero Subtitle / Statement</label>
                      <textarea
                        className="admin-form-textarea"
                        rows={3}
                        value={localContactContent?.hero?.subtitle || ''}
                        onChange={(e) => handleUpdateContactHero('subtitle', e.target.value)}
                        placeholder="Have a custom gifting vision, corporate branding project..."
                      />
                    </div>
                  </div>

                  {/* Inquiry Concierge Form */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-envelope-open-text" style={{ color: '#c40b90' }}></i> Inquiry Concierge Form &amp; Chips
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        Edit the form headlines, prompt chips, and privacy disclaimer.
                      </p>
                    </div>

                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      <div className="admin-form-group">
                        <label>Form Title</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localContactContent?.form?.title || ''}
                          onChange={(e) => handleUpdateContactForm('title', e.target.value)}
                          placeholder="Send an Artisan Inquiry"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Prompt Chips Heading</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localContactContent?.form?.typesLabel || ''}
                          onChange={(e) => handleUpdateContactForm('typesLabel', e.target.value)}
                          placeholder="What can we help you create?"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Privacy &amp; Security Note</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localContactContent?.form?.privacyNote || ''}
                          onChange={(e) => handleUpdateContactForm('privacyNote', e.target.value)}
                          placeholder="Your details are 100% confidential. No spam ever."
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginTop: '16px' }}>
                      <label>Form Subtitle &amp; Turnaround Promise</label>
                      <textarea
                        className="admin-form-textarea"
                        rows={2}
                        value={localContactContent?.form?.subtitle || ''}
                        onChange={(e) => handleUpdateContactForm('subtitle', e.target.value)}
                        placeholder="Fill out your details below and our team will get back to you with custom options..."
                      />
                    </div>

                    {/* Quick Inquiry Prompt Chips */}
                    <div style={{ marginTop: '20px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                        Quick Select Inquiry Chips (4 Presets)
                      </label>
                      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                        Shoppers can click these chips to instantly pre-fill their inquiry note with common custom gift requests.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                        {(localContactContent?.form?.prompts || [
                          'Custom wooden engraved frame with photo',
                          'Personalized ceramic coffee mugs with name',
                          'Corporate employee welcome kit with company logo',
                          'Bespoke leather wallet and metallic pen set',
                        ]).map((prompt, idx) => (
                          <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#c40b90', marginBottom: '6px' }}>
                              Prompt Chip #{idx + 1}
                            </div>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={prompt}
                              onChange={(e) => handleUpdateContactPrompt(idx, e.target.value)}
                              placeholder={`Prompt ${idx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: CONCIERGE DESKS & ADDRESS */}
              {contactSubTab === 'sidebar' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-building-columns" style={{ color: '#7d2091' }}></i> Concierge Desks &amp; Studio Address
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        These four cards appear in the right sidebar of the Contact Us page.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                      {/* WhatsApp Priority Desk */}
                      <div className="admin-cms-item-card" style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                            <i className="fa-brands fa-whatsapp"></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>WhatsApp Priority Desk</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Fastest artisan response desk</div>
                          </div>
                        </div>

                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Card Title</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.whatsapp?.title || ''}
                            onChange={(e) => handleUpdateContactSidebar('whatsapp', 'title', e.target.value)}
                            placeholder="WhatsApp Priority Desk"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Reply Speed Badge</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.whatsapp?.badge || ''}
                            onChange={(e) => handleUpdateContactSidebar('whatsapp', 'badge', e.target.value)}
                            placeholder="Avg reply: < 15 mins"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Card Description</label>
                          <textarea
                            className="admin-form-textarea"
                            rows={2}
                            value={localContactContent?.sidebar?.whatsapp?.desc || ''}
                            onChange={(e) => handleUpdateContactSidebar('whatsapp', 'desc', e.target.value)}
                            placeholder="Need an immediate design preview, price quote..."
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Button Label</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.whatsapp?.btnText || ''}
                            onChange={(e) => handleUpdateContactSidebar('whatsapp', 'btnText', e.target.value)}
                            placeholder="Open Live WhatsApp Chat"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Direct Link (wa.me URL)</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.whatsapp?.link || ''}
                            onChange={(e) => handleUpdateContactSidebar('whatsapp', 'link', e.target.value)}
                            placeholder="https://wa.me/910000000000"
                          />
                        </div>
                      </div>

                      {/* Direct Studio Call */}
                      <div className="admin-cms-item-card" style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                            <i className="fa-solid fa-phone-volume"></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Direct Studio Call</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Urgent inquiries &amp; order changes</div>
                          </div>
                        </div>

                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Card Title</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.call?.title || ''}
                            onChange={(e) => handleUpdateContactSidebar('call', 'title', e.target.value)}
                            placeholder="Direct Studio Call"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Operating Hours Badge</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.call?.hours || ''}
                            onChange={(e) => handleUpdateContactSidebar('call', 'hours', e.target.value)}
                            placeholder="Mon - Sat: 9:00 AM - 7:00 PM IST"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Card Description</label>
                          <textarea
                            className="admin-form-textarea"
                            rows={2}
                            value={localContactContent?.sidebar?.call?.desc || ''}
                            onChange={(e) => handleUpdateContactSidebar('call', 'desc', e.target.value)}
                            placeholder="Speak with our customer support for urgent order modifications..."
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Button Label</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.call?.btnText || ''}
                            onChange={(e) => handleUpdateContactSidebar('call', 'btnText', e.target.value)}
                            placeholder="Call (+91) 0000 000 000"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Direct Call Link (tel: URL)</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.call?.link || ''}
                            onChange={(e) => handleUpdateContactSidebar('call', 'link', e.target.value)}
                            placeholder="tel:+910000000000"
                          />
                        </div>
                      </div>

                      {/* Flagship Studio Address */}
                      <div className="admin-cms-item-card" style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fdf2f8', color: '#c40b90', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                            <i className="fa-solid fa-location-dot"></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Mangalore Flagship Studio</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Workshop location &amp; address details</div>
                          </div>
                        </div>

                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Studio Title</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.studio?.title || ''}
                            onChange={(e) => handleUpdateContactSidebar('studio', 'title', e.target.value)}
                            placeholder="Mangalore Flagship Studio"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Location Badge</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.studio?.location || ''}
                            onChange={(e) => handleUpdateContactSidebar('studio', 'location', e.target.value)}
                            placeholder="Karnataka, India"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Description</label>
                          <textarea
                            className="admin-form-textarea"
                            rows={2}
                            value={localContactContent?.sidebar?.studio?.desc || ''}
                            onChange={(e) => handleUpdateContactSidebar('studio', 'desc', e.target.value)}
                            placeholder="Our central production studio where design curation..."
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Full Physical Address</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.studio?.address || ''}
                            onChange={(e) => handleUpdateContactSidebar('studio', 'address', e.target.value)}
                            placeholder="Main Workshop & Experience Studio, Mangalore, Karnataka, India"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Working Hours Text</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.studio?.hours || ''}
                            onChange={(e) => handleUpdateContactSidebar('studio', 'hours', e.target.value)}
                            placeholder="Working Hours: Monday to Saturday, 9:00 AM to 7:00 PM IST"
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Official Studio Email Line</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.studio?.email || ''}
                            onChange={(e) => handleUpdateContactSidebar('studio', 'email', e.target.value)}
                            placeholder="Official Mail: info@gift.com"
                          />
                        </div>
                      </div>

                      {/* Corporate Gifting Solutions */}
                      <div className="admin-cms-item-card" style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#faf5ff', color: '#7d2091', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                            <i className="fa-solid fa-briefcase"></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Corporate B2B Solutions</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Bulk orders, GST billing &amp; branding</div>
                          </div>
                        </div>

                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Title</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.corporate?.title || ''}
                            onChange={(e) => handleUpdateContactSidebar('corporate', 'title', e.target.value)}
                            placeholder="Corporate Gifting Solutions"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Subtitle / Tax Note</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.corporate?.subtitle || ''}
                            onChange={(e) => handleUpdateContactSidebar('corporate', 'subtitle', e.target.value)}
                            placeholder="GST Invoices & Bulk Pricing"
                          />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                          <label>Description</label>
                          <textarea
                            className="admin-form-textarea"
                            rows={3}
                            value={localContactContent?.sidebar?.corporate?.desc || ''}
                            onChange={(e) => handleUpdateContactSidebar('corporate', 'desc', e.target.value)}
                            placeholder="Looking to order 50+ branded executive gifts, trophies..."
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>Button Label</label>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={localContactContent?.sidebar?.corporate?.btnText || ''}
                            onChange={(e) => handleUpdateContactSidebar('corporate', 'btnText', e.target.value)}
                            placeholder="Request Corporate Catalog"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 5: WORKSHOP & DELIVERY SHOWCASE */}
              {contactSubTab === 'workshop' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Workshop Showcase Header */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-truck-fast" style={{ color: '#059669' }}></i> Workshop &amp; Nationwide Delivery Showcase
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        Highlights your Mangalore craft hub, shipping guarantees, and nationwide fulfillment capabilities.
                      </p>
                    </div>

                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      <div className="admin-form-group">
                        <label>Headline Prefix</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localContactContent?.workshop?.title || ''}
                          onChange={(e) => handleUpdateContactWorkshop('title', e.target.value)}
                          placeholder="Handcrafted in Mangalore,"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Headline Highlight (Gradient)</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localContactContent?.workshop?.highlightTitle || ''}
                          onChange={(e) => handleUpdateContactWorkshop('highlightTitle', e.target.value)}
                          placeholder="Loved Across India"
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginTop: '16px' }}>
                      <label>Section Description</label>
                      <textarea
                        className="admin-form-textarea"
                        rows={2}
                        value={localContactContent?.workshop?.desc || ''}
                        onChange={(e) => handleUpdateContactWorkshop('desc', e.target.value)}
                        placeholder="From coastal Karnataka to every corner of India, our dedicated packing team..."
                      />
                    </div>
                  </div>

                  {/* 4 Nationwide Delivery Perks */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-shield-check" style={{ color: '#0d97d5' }}></i> 4 Nationwide Delivery Perks
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        The 4 checkmark bullet points displayed alongside the showcase.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                      {(localContactContent?.workshop?.perks || [
                        '19,000+ Pincodes Covered',
                        'Zero-Plastic Cushioning',
                        'Real-Time SMS & Email Tracking',
                        'Complimentary Greeting Cards',
                      ]).map((perk, idx) => (
                        <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0d97d5', marginBottom: '6px' }}>
                            Perk #{idx + 1}
                          </div>
                          <input
                            type="text"
                            className="admin-form-input"
                            value={perk}
                            onChange={(e) => handleUpdateContactPerk(idx, e.target.value)}
                            placeholder={`Perk ${idx + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Central Hub Map Card & Guarantee Badges */}
                  <div className="admin-panel-card">
                    <div className="admin-panel-header">
                      <h3 className="admin-panel-title">
                        <i className="fa-solid fa-map-location-dot" style={{ color: '#7d2091' }}></i> Hub Map Card &amp; Guarantee Badges
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                        Customize the visual workshop badge and 3 guarantee pills.
                      </p>
                    </div>

                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      <div className="admin-form-group">
                        <label>Central Hub Badge</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localContactContent?.workshop?.mapBadge || ''}
                          onChange={(e) => handleUpdateContactWorkshop('mapBadge', e.target.value)}
                          placeholder="Fine Gift Studio Central Hub"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Hub Location</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={localContactContent?.workshop?.mapLocation || ''}
                          onChange={(e) => handleUpdateContactWorkshop('mapLocation', e.target.value)}
                          placeholder="Mangalore, Karnataka, India"
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginTop: '16px' }}>
                      <label>Studio Facilities &amp; Machinery Note</label>
                      <textarea
                        className="admin-form-textarea"
                        rows={2}
                        value={localContactContent?.workshop?.mapSub || ''}
                        onChange={(e) => handleUpdateContactWorkshop('mapSub', e.target.value)}
                        placeholder="State-of-the-art laser engraving machines, high-resolution UV flatbed printers..."
                      />
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                        3 Guarantee Badges / Pills
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                        {(localContactContent?.workshop?.pills || [
                          '🚀 Air Priority Dispatch',
                          '📦 Breakage-Free Guarantee',
                          '🕒 24-48h Fast Turnaround',
                        ]).map((pill, idx) => (
                          <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#7d2091', marginBottom: '6px' }}>
                              Badge #{idx + 1}
                            </div>
                            <input
                              type="text"
                              className="admin-form-input"
                              value={pill}
                              onChange={(e) => handleUpdateContactPill(idx, e.target.value)}
                              placeholder={`Badge ${idx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setProductFormData({
                          ...productFormData,
                          cat_name: newCat,
                          sub_cat_name: ''
                        });
                      }}
                    >
                      {localCategories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {(() => {
                    const selCat = localCategories.find((c) => c.name.toLowerCase() === (productFormData.cat_name || '').toLowerCase());
                    let subList = [];
                    if (selCat) {
                      if (Array.isArray(selCat.subcategories)) {
                        subList = selCat.subcategories;
                      } else if (typeof selCat.subcategories === 'string' && selCat.subcategories.trim()) {
                        subList = selCat.subcategories.split(',').map((s) => s.trim()).filter(Boolean);
                      }
                    }
                    if ((productFormData.cat_name || '').toLowerCase() === 'infants' && subList.length === 0) {
                      subList = ['Boys', 'Girls'];
                    }

                    if (subList.length > 0) {
                      return (
                        <div className="admin-form-group">
                          <label>Subcategory <span style={{ color: '#c40b90', fontWeight: 'bold' }}>*</span></label>
                          <select
                            className="admin-form-select"
                            value={productFormData.sub_cat_name || ''}
                            onChange={(e) => setProductFormData({ ...productFormData, sub_cat_name: e.target.value })}
                            style={{ borderColor: '#c40b90' }}
                          >
                            <option value="">-- Select Subcategory --</option>
                            {subList.map((sub) => (
                              <option key={sub} value={sub}>{sub}</option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    return null;
                  })()}

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
                              border: '1.5px dashed #c40b90',
                              borderRadius: '10px',
                              background: '#fdf2f8',
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '20px', color: '#c40b90', marginBottom: '6px' }}></i>
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
                <i className="fa-solid fa-receipt" style={{ color: '#f9b228' }}></i> Order Work Slip #{inspectedOrder.id}
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
                  <strong style={{ color: '#c40b90' }}>₹{(inspectedOrder.total || 0).toLocaleString()}</strong>
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
                      <div style={{ marginTop: '6px', background: '#fefce8', border: '1px dashed #f9b228', padding: '8px 12px', borderRadius: '8px', color: '#b45309', fontSize: '12.5px', fontWeight: 600 }}>
                        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#c40b90' }}></i> <strong>Laser Engraving Text:</strong> "{it.customNote}"
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
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="admin-modal-header">
              <h3>Create Store Promotional Voucher</h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setIsCouponModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveCoupon}>
              <div className="admin-modal-body">
                <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                  {/* Target Audience / Customer Assignment */}
                  <div className="admin-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                    <label>Target Audience / Customer Assignment *</label>
                    <select
                      className="admin-select"
                      value={couponFormData.targetCustomerId}
                      onChange={(e) => {
                        const targetId = e.target.value;
                        const cust = customers.find((c) => c.id === targetId);
                        setCouponFormData({
                          ...couponFormData,
                          targetCustomerId: targetId,
                          title: cust ? `Exclusive VIP Voucher for ${cust.name}` : couponFormData.title
                        });
                      }}
                    >
                      <option value="all">🌐 All Store Customers (Public Promo Code)</option>
                      <optgroup label="Assign to Registered Customer:">
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            👤 {c.name} ({c.email || 'No email'}) {c.role === 'vip' ? '— [VIP Gold]' : ''}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    {couponFormData.targetCustomerId !== 'all' && (
                      <small style={{ color: '#c40b90', fontSize: '11.5px', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                        <i className="fa-solid fa-lock"></i> Restricted: Only this customer can redeem this code during checkout.
                      </small>
                    )}
                  </div>

                  <div className="admin-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                    <label>Voucher Code *</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="admin-input"
                        required
                        placeholder="e.g. DIWALI25, FESTIVE500, PRIYA20"
                        value={couponFormData.code}
                        onChange={(e) =>
                          setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })
                        }
                        style={{ fontFamily: 'monospace', fontWeight: 800, letterSpacing: '1px' }}
                      />
                      {couponFormData.targetCustomerId !== 'all' && (
                        <button
                          type="button"
                          className="admin-btn-secondary"
                          style={{ whiteSpace: 'nowrap', fontSize: '11.5px' }}
                          onClick={() => {
                            const c = customers.find((x) => x.id === couponFormData.targetCustomerId);
                            if (c) {
                              const prefix = (c.name.split(' ')[0] || 'VIP').toUpperCase().replace(/[^A-Z]/g, '');
                              setCouponFormData((prev) => ({
                                ...prev,
                                code: `${prefix}${prev.value || 20}`
                              }));
                            }
                          }}
                        >
                          <i className="fa-solid fa-wand-magic-sparkles"></i> Suggest
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="admin-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                    <label>Voucher Title / Occasion</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. VIP Gold Appreciation, Festive 2026 Celebration"
                      value={couponFormData.title}
                      onChange={(e) => setCouponFormData({ ...couponFormData, title: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Discount Type</label>
                    <select
                      className="admin-select"
                      value={couponFormData.type}
                      onChange={(e) => setCouponFormData({ ...couponFormData, type: e.target.value })}
                    >
                      <option value="percentage">Percentage (% OFF)</option>
                      <option value="flat">Flat Amount (₹ OFF)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Discount Value * ({couponFormData.type === 'percentage' ? '%' : '₹'})</label>
                    <input
                      type="number"
                      className="admin-input"
                      required
                      min={1}
                      value={couponFormData.value}
                      onChange={(e) => setCouponFormData({ ...couponFormData, value: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                    <label>Minimum Order Threshold (₹)</label>
                    <input
                      type="number"
                      className="admin-input"
                      min={0}
                      value={couponFormData.minOrder}
                      onChange={(e) => setCouponFormData({ ...couponFormData, minOrder: e.target.value })}
                    />
                    <small style={{ color: '#64748b', fontSize: '11px', marginTop: '3px', display: 'block' }}>
                      Leave 0 for no minimum cart subtotal requirement.
                    </small>
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

      {/* ── MODAL: MANAGE CUSTOMER-SPECIFIC PROMO CODES ───────── */}
      {isCustomerPromoModalOpen && selectedCustomerForPromo && (
        <div className="admin-modal-backdrop" onClick={() => setIsCustomerPromoModalOpen(false)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c40b90, #e7137a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '15px'
                  }}
                >
                  <i className="fa-solid fa-ticket"></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px' }}>Customer Promo Codes</h3>
                  <small style={{ color: '#64748b' }}>
                    Personalized discounts for {selectedCustomerForPromo.name}
                  </small>
                </div>
              </div>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setIsCustomerPromoModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="admin-modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
              {/* Customer Profile Mini Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #fdf2f8 0%, #fff7ed 100%)',
                  border: '1px solid #fbcfe8',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: selectedCustomerForPromo.role === 'vip' ? 'linear-gradient(135deg, #c40b90, #e7137a)' : '#e2e8f0',
                      color: selectedCustomerForPromo.role === 'vip' ? '#ffffff' : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '15px',
                      overflow: 'hidden'
                    }}
                  >
                    {selectedCustomerForPromo.avatar ? (
                      <img src={selectedCustomerForPromo.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      (selectedCustomerForPromo.name || 'C').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>{selectedCustomerForPromo.name}</strong>
                      {selectedCustomerForPromo.role === 'vip' && (
                        <span className="admin-badge" style={{ background: '#fdf2f8', color: '#c40b90', border: '1px solid #fbcfe8', fontSize: '10.5px' }}>
                          <i className="fa-solid fa-gem"></i> VIP Gold
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      <i className="fa-regular fa-envelope"></i> {selectedCustomerForPromo.email}
                      {selectedCustomerForPromo.phone && <span style={{ marginLeft: '10px' }}><i className="fa-solid fa-phone"></i> {selectedCustomerForPromo.phone}</span>}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>WALLET BALANCE</span>
                  <strong style={{ fontSize: '16px', color: '#c40b90' }}>₹{(selectedCustomerForPromo.walletBalance ?? 100).toLocaleString()}</strong>
                </div>
              </div>

              {/* SECTION 1: Active Assigned Promo Codes */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <i className="fa-solid fa-tags" style={{ color: '#c40b90', marginRight: '6px' }}></i>
                    Assigned Promo Codes ({
                      coupons.filter(
                        (c) =>
                          (c.customerId && c.customerId === selectedCustomerForPromo.id) ||
                          (c.customerEmail && c.customerEmail.toLowerCase() === selectedCustomerForPromo.email?.toLowerCase())
                      ).length
                    })
                  </h4>
                </div>

                {(() => {
                  const assignedCodes = coupons.filter(
                    (c) =>
                      (c.customerId && c.customerId === selectedCustomerForPromo.id) ||
                      (c.customerEmail && c.customerEmail.toLowerCase() === selectedCustomerForPromo.email?.toLowerCase())
                  );

                  if (assignedCodes.length === 0) {
                    return (
                      <div
                        style={{
                          padding: '24px',
                          background: '#f8fafc',
                          border: '1px dashed #cbd5e1',
                          borderRadius: '12px',
                          textAlign: 'center',
                          color: '#64748b'
                        }}
                      >
                        <i className="fa-solid fa-ticket" style={{ fontSize: '28px', color: '#cbd5e1', marginBottom: '8px', display: 'block' }}></i>
                        <strong style={{ color: '#334155', display: 'block', marginBottom: '4px' }}>No Promo Codes Assigned Yet</strong>
                        <p style={{ margin: 0, fontSize: '12.5px' }}>
                          Use the form below to create and issue a personalized discount code specifically for {selectedCustomerForPromo.name}.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {assignedCodes.map((cp) => (
                        <div
                          key={cp.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: cp.active ? '#ffffff' : '#f8fafc',
                            border: `1px solid ${cp.active ? '#fbcfe8' : '#e2e8f0'}`,
                            borderRadius: '12px',
                            boxShadow: cp.active ? '0 2px 8px rgba(196, 11, 144, 0.05)' : 'none',
                            opacity: cp.active ? 1 : 0.75
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <strong
                              style={{
                                fontFamily: 'monospace',
                                letterSpacing: '1px',
                                fontSize: '14px',
                                color: '#c40b90',
                                background: 'rgba(196, 11, 144, 0.08)',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                border: '1px solid #fbcfe8'
                              }}
                            >
                              {cp.code}
                            </strong>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <strong style={{ color: '#0f172a', fontSize: '13px' }}>
                                  {cp.type === 'percentage' ? `${cp.value}% OFF` : `₹${cp.value} FLAT OFF`}
                                </strong>
                                <span className={`admin-badge ${cp.active ? 'active' : 'draft'}`} style={{ fontSize: '10.5px' }}>
                                  {cp.active ? 'Active' : 'Disabled'}
                                </span>
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                                <span>{cp.title || 'Personalized Voucher'}</span>
                                {cp.minOrder > 0 && <span> · Min order: ₹{cp.minOrder}</span>}
                                <span> · {cp.uses || 0} used</span>
                              </div>
                            </div>
                          </div>

                          <div className="admin-action-btn-group">
                            <button
                              type="button"
                              className={`admin-icon-btn ${cp.active ? 'danger' : 'success'}`}
                              onClick={() => handleToggleCoupon(cp.id)}
                              title={cp.active ? 'Disable this code' : 'Reactivate this code'}
                            >
                              <i className={cp.active ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off'}></i>
                            </button>
                            <button
                              type="button"
                              className="admin-icon-btn danger"
                              onClick={() => handleDeleteCustomerPromo(cp.id, cp.code)}
                              title="Delete this promo code"
                            >
                              <i className="fa-regular fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* SECTION 2: Issue New Personalized Promo Code */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '18px 20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#d97706', marginRight: '6px' }}></i>
                    Issue New Promo Code to {selectedCustomerForPromo.name}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleGenerateCustomerCode(selectedCustomerForPromo)}
                    className="admin-btn-secondary"
                    style={{ fontSize: '11.5px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    title="Generate another custom promo code"
                  >
                    <i className="fa-solid fa-dice"></i> Suggest Code
                  </button>
                </div>

                <form onSubmit={handleSaveCustomerPromo}>
                  <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                    <div className="admin-form-group">
                      <label>Promo Code *</label>
                      <input
                        type="text"
                        className="admin-input"
                        required
                        value={customerPromoFormData.code}
                        onChange={(e) =>
                          setCustomerPromoFormData({ ...customerPromoFormData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })
                        }
                        placeholder="e.g. PRIYA20"
                        style={{ fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.8px', color: '#c40b90' }}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Voucher Occasion / Title</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={customerPromoFormData.title}
                        onChange={(e) => setCustomerPromoFormData({ ...customerPromoFormData, title: e.target.value })}
                        placeholder="e.g. Birthday Privilege, VIP Appreciation"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Discount Type</label>
                      <select
                        className="admin-select"
                        value={customerPromoFormData.type}
                        onChange={(e) => setCustomerPromoFormData({ ...customerPromoFormData, type: e.target.value })}
                      >
                        <option value="percentage">Percentage (% OFF)</option>
                        <option value="flat">Flat Amount (₹ OFF)</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label>Discount Value * ({customerPromoFormData.type === 'percentage' ? '%' : '₹'})</label>
                      <input
                        type="number"
                        className="admin-input"
                        required
                        min="1"
                        value={customerPromoFormData.value}
                        onChange={(e) => setCustomerPromoFormData({ ...customerPromoFormData, value: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-group full-width" style={{ gridColumn: '1 / -1' }}>
                      <label>Minimum Order Threshold (₹)</label>
                      <input
                        type="number"
                        className="admin-input"
                        min="0"
                        value={customerPromoFormData.minOrder}
                        onChange={(e) => setCustomerPromoFormData({ ...customerPromoFormData, minOrder: e.target.value })}
                        placeholder="499"
                      />
                      <small style={{ color: '#64748b', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                        Customer can only redeem this promo when their checkout cart subtotal reaches this amount.
                      </small>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      className="admin-btn-primary"
                      style={{
                        background: 'linear-gradient(135deg, #c40b90 0%, #e7137a 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <i className="fa-solid fa-gift"></i>
                      <span>Issue Code to {selectedCustomerForPromo.name}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setIsCustomerPromoModalOpen(false)}
              >
                Close
              </button>
            </div>
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

      {/* ── MODAL: ADD / EDIT CATEGORY ─────────────────────────── */}
      {isCategoryModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <h3>{editingCategory ? 'Edit Store Category' : 'Create New Gift Category'}</h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setIsCategoryModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="admin-modal-body">
                <div className="admin-form-group" style={{ marginBottom: '16px' }}>
                  <label>Category Title *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    placeholder="e.g. Wooden Engravings, Keychains, Hampers"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: '16px' }}>
                  <label>Subcategories (Optional, comma-separated)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Boys, Girls (Leave empty if no subcategories)"
                    value={categoryFormData.subcategories || ''}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, subcategories: e.target.value })}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Separate multiple subcategories with commas (e.g. <code>Boys, Girls</code> for Infants). Leave blank if not required.
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: '16px' }}>
                  <label>FontAwesome Icon Class</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c40b90', fontSize: '18px', flexShrink: 0 }}>
                      <i className={categoryFormData.icon || 'fa-solid fa-gift'}></i>
                    </div>
                    <input
                      type="text"
                      className="admin-form-input"
                      style={{ flex: 1 }}
                      placeholder="e.g. fa-solid fa-shirt, fa-solid fa-mug-hot"
                      value={categoryFormData.icon}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                    />
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '6px' }}>
                    Quick presets:
                    <button type="button" onClick={() => setCategoryFormData({ ...categoryFormData, icon: 'fa-solid fa-gift' })} style={{ background: 'none', border: 'none', color: '#c40b90', cursor: 'pointer', marginLeft: '6px', fontSize: '11.5px' }}>Gift</button> ·
                    <button type="button" onClick={() => setCategoryFormData({ ...categoryFormData, icon: 'fa-solid fa-mug-hot' })} style={{ background: 'none', border: 'none', color: '#c40b90', cursor: 'pointer', marginLeft: '4px', fontSize: '11.5px' }}>Mug</button> ·
                    <button type="button" onClick={() => setCategoryFormData({ ...categoryFormData, icon: 'fa-solid fa-shirt' })} style={{ background: 'none', border: 'none', color: '#c40b90', cursor: 'pointer', marginLeft: '4px', fontSize: '11.5px' }}>Shirt</button> ·
                    <button type="button" onClick={() => setCategoryFormData({ ...categoryFormData, icon: 'fa-solid fa-gem' })} style={{ background: 'none', border: 'none', color: '#c40b90', cursor: 'pointer', marginLeft: '4px', fontSize: '11.5px' }}>Acrylic</button> ·
                    <button type="button" onClick={() => setCategoryFormData({ ...categoryFormData, icon: 'fa-solid fa-tree' })} style={{ background: 'none', border: 'none', color: '#c40b90', cursor: 'pointer', marginLeft: '4px', fontSize: '11.5px' }}>Wood</button> ·
                    <button type="button" onClick={() => setCategoryFormData({ ...categoryFormData, icon: 'fa-solid fa-key' })} style={{ background: 'none', border: 'none', color: '#c40b90', cursor: 'pointer', marginLeft: '4px', fontSize: '11.5px' }}>Keychain</button>
                  </div>
                </div>

                {/* Category Cover Image (Featured on Home Page) */}
                <div className="admin-form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Category Cover Image (Featured on Home Page) *</span>
                    {categoryFormData.image_url && (
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                        <i className="fa-solid fa-circle-check"></i> Image selected
                      </span>
                    )}
                  </label>

                  {/* Current Image Preview */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px', padding: '10px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#ffffff', flexShrink: 0 }}>
                      <img
                        src={categoryFormData.image_url || '/assets/images/cups-product.avif'}
                        alt="Category Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.src = '/assets/images/cups-product.avif'; }}
                      />
                    </div>
                    <div style={{ flex: 1, fontSize: '12px', color: '#475569' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                        {categoryFormData.name ? `${categoryFormData.name} Cover` : 'Category Cover Image'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        This photo is featured directly on the Home Page "Featured Categories" carousel card.
                      </div>
                    </div>
                  </div>

                  {/* Tabs: Media Library vs Upload vs URL */}
                  <div className="admin-media-picker-tabs" style={{ marginBottom: '10px' }}>
                    <button
                      type="button"
                      className={`admin-media-tab-btn ${categoryImageTab === 'library' ? 'active' : ''}`}
                      onClick={() => setCategoryImageTab('library')}
                    >
                      <i className="fa-solid fa-photo-film"></i> Media Library
                    </button>
                    <button
                      type="button"
                      className={`admin-media-tab-btn ${categoryImageTab === 'upload' ? 'active' : ''}`}
                      onClick={() => setCategoryImageTab('upload')}
                    >
                      <i className="fa-solid fa-cloud-arrow-up"></i> Upload New
                    </button>
                    <button
                      type="button"
                      className={`admin-media-tab-btn ${categoryImageTab === 'url' ? 'active' : ''}`}
                      onClick={() => setCategoryImageTab('url')}
                    >
                      <i className="fa-solid fa-link"></i> Direct URL
                    </button>
                  </div>

                  {categoryImageTab === 'library' && (
                    <div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '6px' }}>
                        Select any image from your studio library ({mediaAssets.length} assets):
                      </div>
                      <div className="admin-media-picker-grid" style={{ maxHeight: '140px', overflowY: 'auto' }}>
                        {mediaAssets.map((asset) => (
                          <button
                            key={asset.id}
                            type="button"
                            className={`admin-media-picker-item ${categoryFormData.image_url === asset.url ? 'selected' : ''}`}
                            onClick={() => setCategoryFormData({ ...categoryFormData, image_url: asset.url })}
                            title={asset.name}
                          >
                            <img src={asset.url} alt={asset.alt || asset.name} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {categoryImageTab === 'upload' && (
                    <div>
                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px',
                          border: '1.5px dashed #c40b90',
                          borderRadius: '10px',
                          background: '#fdf2f8',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '20px', color: '#c40b90', marginBottom: '6px' }}></i>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                          Choose a photo for this category
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          PNG, JPG, WebP, AVIF up to 10MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="admin-file-hidden-input"
                          onChange={handleCategoryModalUpload}
                        />
                      </label>
                    </div>
                  )}

                  {categoryImageTab === 'url' && (
                    <div>
                      <input
                        type="text"
                        className="admin-form-input"
                        placeholder="https://... or /assets/images/cups-product.avif"
                        value={categoryFormData.image_url || ''}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, image_url: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsCategoryModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <i className="fa-solid fa-floppy-disk"></i> {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD / EDIT CUSTOMER ─────────────────────────── */}
      {isCustomerModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsCustomerModalOpen(false)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="admin-modal-header">
              <h3>
                {editingCustomer
                  ? `Edit Profile: ${editingCustomer.name}`
                  : customerFormData.role === 'admin'
                  ? 'Create New Store Administrator Account'
                  : 'Create New Customer / Staff Account'}
              </h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setIsCustomerModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveCustomer}>
              <div className="admin-modal-body">
                {customerFormData.role === 'admin' && (
                  <div className="admin-role-privilege-banner">
                    <div className="privilege-banner-icon">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                      <strong className="privilege-banner-title">
                        Store Administrator Privileges
                      </strong>
                      <span className="privilege-banner-desc">
                        This user will have full administrative access to manage orders, catalog, CRM data, and unlock the Admin Command Center at <code>/admin</code>.
                      </span>
                    </div>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="admin-form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Priya Nair"
                      value={customerFormData.name}
                      onChange={(e) => setCustomerFormData({ ...customerFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      className="admin-input"
                      placeholder="e.g. customer@example.com"
                      value={customerFormData.email}
                      onChange={(e) => setCustomerFormData({ ...customerFormData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="admin-form-group">
                    <label>Mobile Number</label>
                    <input
                      type="tel"
                      className="admin-input"
                      placeholder="e.g. +91 98765 43210"
                      value={customerFormData.phone}
                      onChange={(e) => setCustomerFormData({ ...customerFormData, phone: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>City / Location</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. Mangalore, Karnataka"
                      value={customerFormData.city}
                      onChange={(e) => setCustomerFormData({ ...customerFormData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="admin-form-group">
                    <label>Account Role</label>
                    <select
                      className="admin-select"
                      value={customerFormData.role}
                      onChange={(e) => setCustomerFormData({ ...customerFormData, role: e.target.value })}
                    >
                      <option value="customer">Customer (Standard)</option>
                      <option value="vip">VIP Gold (Artisan Rewards)</option>
                      <option value="staff">Co-worker / Staff Associate</option>
                      <option value="admin">Store Administrator</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Account Status</label>
                    <select
                      className="admin-select"
                      value={customerFormData.status}
                      onChange={(e) => setCustomerFormData({ ...customerFormData, status: e.target.value })}
                    >
                      <option value="active">Active (Normal)</option>
                      <option value="suspended">Suspended / Blocked</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div className="admin-form-group">
                    <label>Wallet Credit Balance (₹)</label>
                    <input
                      type="number"
                      min="0"
                      className="admin-input"
                      placeholder="100"
                      value={customerFormData.walletBalance}
                      onChange={(e) => setCustomerFormData({ ...customerFormData, walletBalance: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>
                      {editingCustomer
                        ? 'Change Password (Optional)'
                        : customerFormData.role === 'admin'
                        ? 'Admin Master Password *'
                        : 'Initial Password'}
                    </label>
                    <input
                      type="password"
                      className="admin-input"
                      placeholder={
                        editingCustomer
                          ? 'Leave blank to preserve'
                          : customerFormData.role === 'admin'
                          ? 'Set login password for this admin'
                          : 'e.g. welcome123'
                      }
                      value={customerFormData.newPassword}
                      onChange={(e) => setCustomerFormData({ ...customerFormData, newPassword: e.target.value })}
                      required={customerFormData.role === 'admin' && !editingCustomer}
                    />
                    {customerFormData.role === 'admin' && !editingCustomer && (
                      <small style={{ color: '#64748b', fontSize: '11px', marginTop: '3px', display: 'block' }}>
                        Used to sign in and unlock the Admin Command Center at <code>/admin</code>.
                      </small>
                    )}
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Internal Staff Notes</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    placeholder="e.g. Corporate client, preferred delivery address, engraving preferences..."
                    value={customerFormData.notes}
                    onChange={(e) => setCustomerFormData({ ...customerFormData, notes: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsCustomerModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <i className="fa-solid fa-floppy-disk"></i> {editingCustomer ? 'Save Customer Changes' : 'Create Customer Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: INSPECT CUSTOMER & ORDER HISTORY ────────────── */}
      {inspectedCustomer && (
        <div className="admin-modal-backdrop" onClick={() => setInspectedCustomer(null)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="admin-modal-header">
              <h3>Customer Profile &amp; Order History</h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setInspectedCustomer(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Profile Overview Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: inspectedCustomer.role === 'admin' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : inspectedCustomer.role === 'vip' ? 'linear-gradient(135deg, #c40b90, #e7137a)' : '#cbd5e1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 800,
                    overflow: 'hidden',
                    flexShrink: 0
                  }}
                >
                  {inspectedCustomer.avatar ? (
                    <img src={inspectedCustomer.avatar} alt={inspectedCustomer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (inspectedCustomer.name || 'C').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{inspectedCustomer.name}</h3>
                    {inspectedCustomer.role === 'admin' ? (
                      <span className="admin-badge" style={{ background: '#fef3c7', color: '#b45309', fontSize: '11px' }}>Admin</span>
                    ) : inspectedCustomer.role === 'staff' || inspectedCustomer.role === 'coworker' ? (
                      <span className="admin-badge" style={{ background: '#eff6ff', color: '#2563eb', fontSize: '11px' }}><i className="fa-solid fa-user-tie"></i> Co-worker / Staff</span>
                    ) : inspectedCustomer.role === 'vip' ? (
                      <span className="admin-badge" style={{ background: '#fdf2f8', color: '#c40b90', fontSize: '11px' }}><i className="fa-solid fa-gem"></i> VIP Gold</span>
                    ) : (
                      <span className="admin-badge active" style={{ fontSize: '11px' }}>Customer</span>
                    )}
                    <span className="admin-badge" style={{ background: inspectedCustomer.status === 'suspended' ? '#fef2f2' : '#ecfdf5', color: inspectedCustomer.status === 'suspended' ? '#dc2626' : '#059669', fontSize: '11px' }}>
                      {inspectedCustomer.status === 'suspended' ? 'Suspended' : 'Active'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                    <i className="fa-regular fa-envelope" style={{ marginRight: '4px' }}></i> {inspectedCustomer.email}
                    {inspectedCustomer.phone && (
                      <span style={{ marginLeft: '12px' }}>
                        <i className="fa-solid fa-phone" style={{ marginRight: '4px' }}></i> {inspectedCustomer.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '18px' }}>
                <div style={{ padding: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 700 }}>ORDERS</span>
                  <strong style={{ fontSize: '18px', color: '#0f172a' }}>{inspectedCustomer.ordersCount || customerOrders.length || 0}</strong>
                </div>
                <div style={{ padding: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 700 }}>SPEND</span>
                  <strong style={{ fontSize: '18px', color: '#16a34a' }}>₹{(inspectedCustomer.lifetimeSpend || 0).toLocaleString()}</strong>
                </div>
                <div style={{ padding: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 700 }}>WALLET</span>
                  <strong style={{ fontSize: '18px', color: '#c40b90' }}>₹{(inspectedCustomer.walletBalance ?? 100).toLocaleString()}</strong>
                </div>
                <div style={{ padding: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 700 }}>AUTH</span>
                  <strong style={{ fontSize: '13px', color: '#334155' }}>
                    {inspectedCustomer.provider === 'google' || inspectedCustomer.email?.includes('gmail') ? 'Gmail' : 'Email'}
                  </strong>
                </div>
              </div>

              {/* Quick Contact & Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {inspectedCustomer.phone && (
                  <a
                    href={`https://wa.me/${inspectedCustomer.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                  >
                    <i className="fa-brands fa-whatsapp" style={{ color: '#16a34a' }}></i> WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${inspectedCustomer.email}`}
                  className="admin-btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <i className="fa-regular fa-envelope"></i> Send Email
                </a>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => {
                    handleOpenEditCustomer(inspectedCustomer);
                  }}
                  style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="fa-solid fa-pen-to-square"></i> Edit Details
                </button>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => handleToggleCustomerStatus(inspectedCustomer)}
                  style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className={`fa-solid ${inspectedCustomer.status === 'suspended' ? 'fa-check' : 'fa-ban'}`}></i>
                  {inspectedCustomer.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
                </button>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => {
                    const cust = inspectedCustomer;
                    setInspectedCustomer(null);
                    handleOpenCustomerPromo(cust);
                  }}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fdf2f8',
                    color: '#c40b90',
                    borderColor: '#fbcfe8',
                    fontWeight: 700
                  }}
                >
                  <i className="fa-solid fa-ticket"></i> Manage Promo Codes
                </button>
              </div>

              {/* Personalized Promo Codes Section */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    <i className="fa-solid fa-ticket" style={{ color: '#c40b90', marginRight: '6px' }}></i>
                    Personalized Promo Codes
                  </h4>
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => {
                      const cust = inspectedCustomer;
                      setInspectedCustomer(null);
                      handleOpenCustomerPromo(cust);
                    }}
                    style={{ fontSize: '11px', padding: '3px 9px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <i className="fa-solid fa-plus"></i> Issue New Code
                  </button>
                </div>

                {(() => {
                  const custCoupons = coupons.filter(
                    (c) =>
                      (c.customerId && c.customerId === inspectedCustomer.id) ||
                      (c.customerEmail && c.customerEmail.toLowerCase() === inspectedCustomer.email?.toLowerCase())
                  );

                  if (custCoupons.length === 0) {
                    return (
                      <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '12.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>No personalized promo codes assigned yet.</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cust = inspectedCustomer;
                            setInspectedCustomer(null);
                            handleOpenCustomerPromo(cust);
                          }}
                          style={{ background: 'none', border: 'none', color: '#c40b90', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}
                        >
                          + Give Promo Code
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {custCoupons.map((cp) => (
                        <div
                          key={cp.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            background: '#ffffff',
                            border: '1px solid #fbcfe8',
                            borderRadius: '8px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ fontFamily: 'monospace', color: '#c40b90', background: '#fdf2f8', padding: '3px 8px', borderRadius: '6px', fontSize: '12.5px' }}>
                              {cp.code}
                            </strong>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                              {cp.type === 'percentage' ? `${cp.value}% OFF` : `₹${cp.value} FLAT`}
                            </span>
                            {cp.minOrder > 0 && (
                              <span style={{ fontSize: '11px', color: '#64748b' }}>Min ₹{cp.minOrder}</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={`admin-badge ${cp.active ? 'active' : 'draft'}`} style={{ fontSize: '10.5px' }}>
                              {cp.active ? 'Active' : 'Disabled'}
                            </span>
                            <button
                              type="button"
                              className={`admin-icon-btn ${cp.active ? 'danger' : 'success'}`}
                              onClick={() => handleToggleCoupon(cp.id)}
                              title={cp.active ? 'Deactivate' : 'Activate'}
                              style={{ width: '26px', height: '26px', fontSize: '12px' }}
                            >
                              <i className={cp.active ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off'}></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Order History Table */}
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  <i className="fa-solid fa-box-open" style={{ color: '#c40b90', marginRight: '6px' }}></i> Store Orders Placed ({customerOrders.length})
                </h4>
                {customerOrders.length === 0 ? (
                  <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '10px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                    No orders recorded under this customer account yet.
                  </div>
                ) : (
                  <div className="admin-table-responsive" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <table className="admin-table" style={{ fontSize: '12.5px' }}>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerOrders.map((ord) => (
                          <tr key={ord.id}>
                            <td><strong>{ord.id}</strong></td>
                            <td>{ord.date || 'Recent'}</td>
                            <td>₹{ord.total}</td>
                            <td><span className="admin-badge active">{ord.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button type="button" className="admin-btn-secondary" onClick={() => setInspectedCustomer(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: DELETE CUSTOMER CONFIRMATION ────────────────── */}
      {isDeleteCustomerModalOpen && customerToDelete && (
        <div className="admin-modal-backdrop" onClick={() => setIsDeleteCustomerModalOpen(false)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="admin-modal-header" style={{ borderBottomColor: '#fee2e2' }}>
              <h3 style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-triangle-exclamation"></i> Delete Customer Account
              </h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setIsDeleteCustomerModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="admin-modal-body" style={{ textAlign: 'center', padding: '24px 20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto', fontSize: '20px' }}>
                <i className="fa-solid fa-trash-can"></i>
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0f172a' }}>
                Are you sure you want to delete {customerToDelete.name}?
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                This will permanently remove the account for <strong>{customerToDelete.email}</strong> from the customer directory and authentication database.
              </p>
            </div>

            <div className="admin-modal-footer" style={{ justifyContent: 'center', gap: '10px' }}>
              <button type="button" className="admin-btn-secondary" onClick={() => setIsDeleteCustomerModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="admin-btn-danger" onClick={handleConfirmDeleteCustomer}>
                <i className="fa-solid fa-trash-can"></i> Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
