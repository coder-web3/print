import React, { useState, useEffect, useMemo } from 'react';
import './AdminDashboard.css';
import { categoriesData, productsData } from '../../data/mockData';
import { DEFAULT_HOME_CONTENT } from '../../data/homeContentData';

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
  homeContent = null,
  onUpdateProducts = () => {},
  onUpdateOrders = () => {},
  onUpdateCategories = () => {},
  onUpdateHomeContent = () => {},
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

  // ── 3B. STATE FOR CATEGORIES (CRUD) ───────────────────────────────────
  const [localCategories, setLocalCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_admin_categories');
      return saved ? JSON.parse(saved) : (categories.length > 0 ? categories : categoriesData);
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
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    icon: 'fa-solid fa-gift'
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

  // ── 9B. CATEGORY CRUD ACTIONS ─────────────────────────────────────────
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      icon: 'fa-solid fa-gift'
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name || '',
      icon: cat.icon || 'fa-solid fa-gift'
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      showNotification('error', 'Validation Error', 'Category title cannot be empty.');
      return;
    }

    let updatedList;
    if (editingCategory) {
      updatedList = localCategories.map((c) =>
        c.id === editingCategory.id ? { ...c, ...categoryFormData, name: categoryFormData.name.trim() } : c
      );
      addAuditLog('Category Updated', `Updated category "${categoryFormData.name}"`);
      showNotification('success', 'Category Updated', `Saved changes to "${categoryFormData.name}".`);
    } else {
      const newCat = {
        id: Date.now(),
        name: categoryFormData.name.trim(),
        icon: categoryFormData.icon.trim() || 'fa-solid fa-gift'
      };
      updatedList = [...localCategories, newCat];
      addAuditLog('Category Created', `Added new category "${newCat.name}"`);
      showNotification('success', 'Category Created', `"${newCat.name}" added to catalog.`);
    }

    setLocalCategories(updatedList);
    try {
      localStorage.setItem('finegift_admin_categories', JSON.stringify(updatedList));
    } catch {}
    if (onUpdateCategories) onUpdateCategories(updatedList);
    setIsCategoryModalOpen(false);
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
    if (onUpdateCategories) onUpdateCategories(filtered);
    addAuditLog('Category Removed', `Deleted category "${catName}"`);
    showNotification('info', 'Category Removed', `"${catName}" has been deleted.`);
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
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #c40b90, #e7137a)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '28px', color: '#ffffff', boxShadow: '0 8px 24px rgba(184,0,91,0.25)' }}>
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
                defaultValue="admin123"
                required
                className="admin-form-input"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Demo: <strong>admin@finegiftstudio.com</strong> / <strong>admin123</strong></span>
              <button
                type="button"
                onClick={handleAdminLogin}
                style={{ background: '#7d2091', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
              >
                1-Click Unlock
              </button>
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
                    <i className="fa-solid fa-chart-pie" style={{ color: '#c40b90' }}></i> Executive Overview
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
                        <th>Category Name</th>
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
                        return (
                          <tr key={cat.id}>
                            <td>
                              <strong>{cat.name}</strong>
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
                            <strong style={{ fontFamily: 'monospace', letterSpacing: '1px', color: '#f9b228', background: 'rgba(212,175,55,0.1)', padding: '4px 8px', borderRadius: '6px' }}>
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
                    <i className="fa-solid fa-users" style={{ color: '#c40b90' }}></i> Registered Customer Directory
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
    </div>
  );
}
