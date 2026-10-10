import React, { useState, useMemo, useEffect } from 'react';
import './ShopPage.css';
import { categoriesData, productsData as initialProducts } from '../../data/mockData';

// Extended catalog with rich attributes for realistic filtering and quick view
const EXTENDED_CATALOG = [
  {
    id: 101,
    name: "Premium Real Black Leather Wallet",
    cat_name: "Custom Wallets",
    category_id: 4,
    price: 699,
    old_price: 1199,
    image_url: "/assets/images/wallets.avif",
    rating: 4.8,
    reviews_count: 124,
    material: "Leather",
    occasions: ["Birthday", "Anniversary", "Corporate"],
    is_customizable: true,
    is_bestseller: true,
    is_new: false,
    in_stock: true,
    fast_delivery: true,
    description: "Handcrafted from genuine full-grain leather with precision laser-engraved name and charm. Includes RFID protection and velvet gift box."
  },
  {
    id: 102,
    name: "Custom Printed Magic Mug",
    cat_name: "Cups & Mugs",
    category_id: 1,
    price: 349,
    old_price: 549,
    image_url: "/assets/images/cups-product.avif",
    rating: 4.7,
    reviews_count: 98,
    material: "Ceramic",
    occasions: ["Birthday", "Valentine", "Friendship"],
    is_customizable: true,
    is_bestseller: true,
    is_new: false,
    in_stock: true,
    fast_delivery: true,
    description: "Heat-sensitive ceramic mug that reveals your high-definition photo and custom quote when hot liquid is poured in. Dishwasher safe."
  },
  {
    id: 103,
    name: "Premium Couple Acrylic Photo Frame",
    cat_name: "Photo Frames",
    category_id: 2,
    price: 899,
    old_price: 1749,
    image_url: "/assets/images/frames.avif",
    rating: 4.9,
    reviews_count: 210,
    material: "Acrylic",
    occasions: ["Anniversary", "Wedding", "Valentine"],
    is_customizable: true,
    is_bestseller: true,
    is_new: true,
    in_stock: true,
    fast_delivery: true,
    description: "Crystal-clear 5mm imported cast acrylic with museum-grade UV printing and warm wooden LED backlight base."
  },
  {
    id: 104,
    name: "Customized Graphic Cotton T-Shirt",
    cat_name: "T-Shirts & Apparel",
    category_id: 7,
    price: 499,
    old_price: 899,
    image_url: "/assets/images/t-shirt.avif",
    rating: 4.7,
    reviews_count: 156,
    material: "Cotton",
    occasions: ["Birthday", "Friendship", "Corporate"],
    is_customizable: true,
    is_bestseller: false,
    is_new: true,
    in_stock: true,
    fast_delivery: true,
    description: "100% bio-washed 220 GSM combed cotton. Vibrant DTF print that withstands 50+ washes without cracking or fading."
  },
  {
    id: 105,
    name: "Executive Engraved Metal Ballpoint Pen",
    cat_name: "Personalized Pens",
    category_id: 3,
    price: 249,
    old_price: 399,
    image_url: "/assets/images/pens.avif",
    rating: 4.8,
    reviews_count: 85,
    material: "Metal",
    occasions: ["Corporate", "Birthday", "Congratulatory"],
    is_customizable: true,
    is_bestseller: true,
    is_new: false,
    in_stock: true,
    fast_delivery: true,
    description: "Sleek matte metal rollerball with gold trims and crisp German ink refill. Features deep-etched laser engraving."
  },
  {
    id: 106,
    name: "Custom Wooden Name Plate Lamp",
    cat_name: "Home Decor & Lamps",
    category_id: 5,
    price: 1299,
    old_price: 1999,
    image_url: "/assets/images/lamps.avif",
    rating: 5.0,
    reviews_count: 64,
    material: "Wood",
    occasions: ["Housewarming", "Anniversary", "Wedding"],
    is_customizable: true,
    is_bestseller: true,
    is_new: true,
    in_stock: true,
    fast_delivery: false,
    description: "Laser-cut natural beech wood engraved with your family surname or couple names, illuminated by warm energy-efficient LEDs."
  },
  {
    id: 107,
    name: "Luxury Corporate Diary & Pen Hamper",
    cat_name: "Corporate Gifts",
    category_id: 6,
    price: 999,
    old_price: 1599,
    image_url: "/assets/images/corporate-gifts.avif",
    rating: 4.9,
    reviews_count: 142,
    material: "Leather",
    occasions: ["Corporate", "Congratulatory"],
    is_customizable: true,
    is_bestseller: true,
    is_new: false,
    in_stock: true,
    fast_delivery: true,
    description: "Vegan leather hardbound planner, matte metal pen, and matching metallic keychain in an executive embossed gift packaging."
  },
  {
    id: 108,
    name: "Curated Celebration Gift Hamper",
    cat_name: "Gift Hampers & Sets",
    category_id: 8,
    price: 1899,
    old_price: 2699,
    image_url: "/assets/images/gifts.avif",
    rating: 4.9,
    reviews_count: 188,
    material: "Multi",
    occasions: ["Birthday", "Anniversary", "Festive", "Wedding"],
    is_customizable: true,
    is_bestseller: true,
    is_new: true,
    in_stock: true,
    fast_delivery: true,
    description: "The ultimate gifting luxury: personalized stainless steel tumbler, scented soy candle, gourmet chocolates, and engraved keepsake card."
  },
  {
    id: 109,
    name: "Matte Ceramic Couple Coffee Mugs (Set of 2)",
    cat_name: "Cups & Mugs",
    category_id: 1,
    price: 649,
    old_price: 999,
    image_url: "/assets/images/cups.avif",
    rating: 4.8,
    reviews_count: 73,
    material: "Ceramic",
    occasions: ["Anniversary", "Wedding", "Valentine"],
    is_customizable: true,
    is_bestseller: false,
    is_new: false,
    in_stock: true,
    fast_delivery: true,
    description: "Mr. & Mrs. minimalist matte ceramic mugs with custom printed anniversary date and elegant gold foil heart accents."
  },
  {
    id: 110,
    name: "Collage Wooden Wall Photo Frame 12x18",
    cat_name: "Photo Frames",
    category_id: 2,
    price: 1199,
    old_price: 1999,
    image_url: "/assets/images/frames.avif",
    rating: 4.7,
    reviews_count: 115,
    material: "Wood",
    occasions: ["Birthday", "Anniversary", "Housewarming"],
    is_customizable: true,
    is_bestseller: false,
    is_new: false,
    in_stock: true,
    fast_delivery: false,
    description: "MDF wood frame with premium textured finish, crystal clear plexiglass, and high-resolution photo collage grid."
  },
  {
    id: 111,
    name: "Laser Engraved Parker Style Roller Pen",
    cat_name: "Personalized Pens",
    category_id: 3,
    price: 399,
    old_price: 649,
    image_url: "/assets/images/pens.avif",
    rating: 4.9,
    reviews_count: 92,
    material: "Metal",
    occasions: ["Corporate", "Birthday"],
    is_customizable: true,
    is_bestseller: false,
    is_new: true,
    in_stock: true,
    fast_delivery: true,
    description: "Heavyweight chrome and brass barrel with mirror-finish engraving. Glides effortlessly on all paper surfaces."
  },
  {
    id: 112,
    name: "Custom Engraved Men's Bifold Slim Wallet",
    cat_name: "Custom Wallets",
    category_id: 4,
    price: 549,
    old_price: 899,
    image_url: "/assets/images/wallets.avif",
    rating: 4.6,
    reviews_count: 58,
    material: "Leather",
    occasions: ["Birthday", "Anniversary"],
    is_customizable: true,
    is_bestseller: false,
    is_new: false,
    in_stock: true,
    fast_delivery: true,
    description: "Ultra-slim front-pocket design crafted with oil-pull leather. Custom initials debossed with golden heat foil."
  },
  {
    id: 113,
    name: "3D Moon Lamp with Custom Photo & Touch Sensor",
    cat_name: "Home Decor & Lamps",
    category_id: 5,
    price: 1499,
    old_price: 2499,
    image_url: "/assets/images/lamps.avif",
    rating: 4.9,
    reviews_count: 312,
    material: "Acrylic",
    occasions: ["Birthday", "Valentine", "Anniversary"],
    is_customizable: true,
    is_bestseller: true,
    is_new: true,
    in_stock: true,
    fast_delivery: true,
    description: "True-to-life lunar surface created with 3D additive printing. Touch sensor to switch between 16 warm ambient color glows."
  },
  {
    id: 114,
    name: "Customized Corporate Vacuum Insulated Flask 500ml",
    cat_name: "Corporate Gifts",
    category_id: 6,
    price: 699,
    old_price: 1099,
    image_url: "/assets/images/corporate-gifts.avif",
    rating: 4.8,
    reviews_count: 88,
    material: "Metal",
    occasions: ["Corporate", "Festive"],
    is_customizable: true,
    is_bestseller: false,
    is_new: true,
    in_stock: true,
    fast_delivery: true,
    description: "Double-walled 304 food-grade stainless steel with digital LED temperature display lid. Keeps beverages hot or cold for 24 hours."
  },
  {
    id: 115,
    name: "Couple Matching Oversized Hoodies",
    cat_name: "T-Shirts & Apparel",
    category_id: 7,
    price: 1599,
    old_price: 2799,
    image_url: "/assets/images/t-shirt.avif",
    rating: 4.8,
    reviews_count: 77,
    material: "Cotton",
    occasions: ["Valentine", "Anniversary"],
    is_customizable: true,
    is_bestseller: false,
    is_new: true,
    in_stock: true,
    fast_delivery: false,
    description: "Premium 360 GSM fleece cotton hoodies with embroidered roman numeral anniversary dates on the sleeve."
  },
  {
    id: 116,
    name: "Artisanal Festive Dry Fruits & Keepsake Box",
    cat_name: "Gift Hampers & Sets",
    category_id: 8,
    price: 2199,
    old_price: 3299,
    image_url: "/assets/images/gifts.avif",
    rating: 5.0,
    reviews_count: 67,
    material: "Wood",
    occasions: ["Festive", "Wedding", "Corporate"],
    is_customizable: true,
    is_bestseller: false,
    is_new: true,
    in_stock: true,
    fast_delivery: true,
    description: "Handcrafted pine wood box with brass clasp, containing premium California almonds, cashews, and engraved greetings card."
  }
];

const OCCASIONS_LIST = ["Birthday", "Anniversary", "Valentine", "Wedding", "Corporate", "Festive", "Friendship", "Housewarming"];
const MATERIALS_LIST = ["All", "Leather", "Ceramic", "Acrylic", "Wood", "Metal", "Cotton"];

export default function ShopPage({
  categories = categoriesData,
  products = EXTENDED_CATALOG,
  onAddToCart,
  onAddToWishlist,
  wishlist = [],
  onNavigate,
  showNotification,
  initialCategory = 'all'
}) {
  // ── 1. FILTER & SEARCH STATES ──────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [priceBracket, setPriceBracket] = useState('all'); // 'all' | 'under-500' | '500-1000' | '1000-2000' | 'above-2000'
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyFastDelivery, setOnlyFastDelivery] = useState(false);
  const [sortBy, setSortBy] = useState('bestseller'); // 'bestseller' | 'price-low' | 'price-high' | 'rating' | 'newest'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // ── 2. QUICK VIEW MODAL STATE ──────────────────────────────────────────
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [customEngravingText, setCustomEngravingText] = useState('');
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Synchronize category if prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Occasion toggle
  const handleToggleOccasion = (occ) => {
    setSelectedOccasions((prev) =>
      prev.includes(occ) ? prev.filter((o) => o !== occ) : [...prev, occ]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceBracket('all');
    setSelectedOccasions([]);
    setSelectedMaterial('All');
    setOnlyCustomizable(false);
    setOnlyInStock(false);
    setOnlyFastDelivery(false);
    setSortBy('bestseller');
  };

  // ── 3. FILTERING & SORTING LOGIC ───────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const list = products.length > 0 ? products : EXTENDED_CATALOG;

    return list.filter((item) => {
      // Search query (name, category, material, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCat = (item.cat_name || '').toLowerCase().includes(q);
        const matchesMat = (item.material || '').toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesMat && !matchesDesc) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const itemCat = (item.cat_name || '').toLowerCase();
        const targetCat = selectedCategory.toLowerCase();
        if (!itemCat.includes(targetCat) && item.category_id !== Number(selectedCategory)) {
          return false;
        }
      }

      // Price bracket filter
      if (priceBracket === 'under-500' && item.price >= 500) return false;
      if (priceBracket === '500-1000' && (item.price < 500 || item.price > 1000)) return false;
      if (priceBracket === '1000-2000' && (item.price < 1000 || item.price > 2000)) return false;
      if (priceBracket === 'above-2000' && item.price <= 2000) return false;

      // Material filter
      if (selectedMaterial !== 'All' && item.material !== selectedMaterial) {
        return false;
      }

      // Occasion filter (must match at least one selected occasion if any selected)
      if (selectedOccasions.length > 0) {
        const hasOccasion = item.occasions && item.occasions.some((occ) => selectedOccasions.includes(occ));
        if (!hasOccasion) return false;
      }

      // Feature switches
      if (onlyCustomizable && !item.is_customizable) return false;
      if (onlyInStock && !item.in_stock) return false;
      if (onlyFastDelivery && !item.fast_delivery) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0);
      // default: bestseller
      return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0);
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    priceBracket,
    selectedOccasions,
    selectedMaterial,
    onlyCustomizable,
    onlyInStock,
    onlyFastDelivery,
    sortBy
  ]);

  // Category item counts
  const categoryCountMap = useMemo(() => {
    const map = {};
    const list = products.length > 0 ? products : EXTENDED_CATALOG;
    list.forEach((item) => {
      const cat = item.cat_name || 'Other';
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, [products]);

  // Wishlist check helper
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Open Quick View
  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
    setCustomEngravingText('');
    setQuickViewQty(1);
  };

  // Add to Bag with custom text
  const handleAddToCartWithCustom = (product, qty = 1, customNote = '') => {
    const customizedItem = {
      ...product,
      quantity: qty,
      customNote: customNote || undefined
    };
    if (onAddToCart) {
      onAddToCart(customizedItem);
    }
  };

  return (
    <div className="shop-page-wrapper">
      <div className="container">

        {/* ── BREADCRUMB ─────────────────────────────────────────── */}
        <div className="shop-breadcrumb" aria-label="breadcrumb">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('/');
            }}
          >
            <i className="fa-solid fa-house" style={{ marginRight: '4px' }}></i> Home
          </a>
          <span>/</span>
          <span className="current">
            Shop Catalog {selectedCategory !== 'all' ? `· ${selectedCategory}` : ''}
          </span>
        </div>

        {/* ── 1. LUXURY SHOP HERO BANNER ────────────────────────── */}
        <div className="shop-hero-banner">
          <div className="shop-hero-content">
            <span className="shop-hero-badge">
              <i className="fa-solid fa-wand-magic-sparkles"></i> Fine Gift Studio Catalog
            </span>
            <h1>Curated Personalized & Bespoke Gifts</h1>
            <p>
              Handcrafted and laser-engraved with precision. Discover one-of-a-kind keepsakes, customized
              accessories, and emotional gifts engineered to create timeless memories.
            </p>
            <div className="shop-hero-perks">
              <span className="shop-hero-perk-item">
                <i className="fa-solid fa-certificate"></i> Free Custom Engraving
              </span>
              <span className="shop-hero-perk-item">
                <i className="fa-solid fa-truck-fast"></i> Express Pan-India Dispatch
              </span>
              <span className="shop-hero-perk-item">
                <i className="fa-solid fa-shield-halved"></i> Shatterproof Packing
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. CATEGORY PILL FILTER STRIP ─────────────────────── */}
        <div className="shop-category-strip" role="region" aria-label="Category Selection">
          <button
            type="button"
            className={`shop-cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <i className="fa-solid fa-border-all"></i>
            <span>All Categories</span>
            <span className="shop-cat-pill-count">{EXTENDED_CATALOG.length}</span>
          </button>

          {categories.map((cat) => {
            const count = categoryCountMap[cat.name] || 0;
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                className={`shop-cat-pill ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <i className={cat.icon || 'fa-solid fa-gift'}></i>
                <span>{cat.name}</span>
                <span className="shop-cat-pill-count">{count || cat.count || 0}</span>
              </button>
            );
          })}
        </div>

        {/* ── 3. TOOLBAR: SEARCH, SORT & VIEW TOGGLES ───────────── */}
        <div className="shop-toolbar-bar">
          <div className="shop-toolbar-left">
            <div className="shop-search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                className="shop-search-input"
                placeholder="Search mugs, wallets, frames, lamps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="shop-results-count">
              Showing <strong>{filteredProducts.length}</strong> of {EXTENDED_CATALOG.length} items
            </span>
          </div>

          <div className="shop-toolbar-right">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              className="shop-mobile-filter-trigger"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <i className="fa-solid fa-sliders"></i>
              <span>Filters ({selectedOccasions.length + (priceBracket !== 'all' ? 1 : 0)})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="shop-sort-wrap">
              <span>Sort:</span>
              <select
                className="shop-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                <option value="bestseller">Bestsellers First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* View Mode (Grid vs List) */}
            <div className="shop-view-toggles" role="group" aria-label="Product layout mode">
              <button
                type="button"
                className={`shop-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
                aria-label="Grid View"
              >
                <i className="fa-solid fa-table-cells-large"></i>
              </button>
              <button
                type="button"
                className={`shop-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
                aria-label="List View"
              >
                <i className="fa-solid fa-list-ul"></i>
              </button>
            </div>
          </div>
        </div>

        {/* ── 4. MAIN LAYOUT: SIDEBAR + PRODUCT GRID ─────────────── */}
        <div className="shop-layout-grid">

          {/* ── 5. MULTI-FACETED FILTER SIDEBAR ─────────────────── */}
          <aside
            className={`shop-filter-sidebar ${isMobileFiltersOpen ? 'mobile-drawer-open' : ''}`}
            aria-label="Product Filters"
          >
            <div className="shop-filter-header">
              <h3>
                <i className="fa-solid fa-filter" style={{ color: '#b8005b' }}></i> Refine Gifts
              </h3>
              <button
                type="button"
                className="shop-filter-reset-btn"
                onClick={handleResetFilters}
              >
                Reset All
              </button>
            </div>

            {/* Price Range Filter */}
            <div className="shop-filter-group">
              <div className="shop-filter-title">
                <span>Price Bracket</span>
                <i className="fa-solid fa-indian-rupee-sign" style={{ color: '#94a3b8', fontSize: '11px' }}></i>
              </div>
              <div className="shop-price-chips">
                <button
                  type="button"
                  className={`shop-price-chip-btn ${priceBracket === 'all' ? 'active' : ''}`}
                  onClick={() => setPriceBracket('all')}
                >
                  All Prices
                </button>
                <button
                  type="button"
                  className={`shop-price-chip-btn ${priceBracket === 'under-500' ? 'active' : ''}`}
                  onClick={() => setPriceBracket('under-500')}
                >
                  Under ₹500
                </button>
                <button
                  type="button"
                  className={`shop-price-chip-btn ${priceBracket === '500-1000' ? 'active' : ''}`}
                  onClick={() => setPriceBracket('500-1000')}
                >
                  ₹500 – ₹1,000
                </button>
                <button
                  type="button"
                  className={`shop-price-chip-btn ${priceBracket === '1000-2000' ? 'active' : ''}`}
                  onClick={() => setPriceBracket('1000-2000')}
                >
                  ₹1,000 – ₹2,000
                </button>
                <button
                  type="button"
                  className={`shop-price-chip-btn ${priceBracket === 'above-2000' ? 'active' : ''}`}
                  onClick={() => setPriceBracket('above-2000')}
                >
                  Above ₹2,000
                </button>
              </div>
            </div>

            {/* Special Perks & Badges */}
            <div className="shop-filter-group">
              <div className="shop-filter-title">
                <span>Studio Highlights</span>
              </div>
              <label className="shop-switch-item">
                <span><i className="fa-solid fa-wand-magic-sparkles"></i> Custom Engraving</span>
                <input
                  type="checkbox"
                  checked={onlyCustomizable}
                  onChange={(e) => setOnlyCustomizable(e.target.checked)}
                />
              </label>
              <label className="shop-switch-item" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
                <span><i className="fa-solid fa-bolt" style={{ color: '#16a34a' }}></i> Express 48h Dispatch</span>
                <input
                  type="checkbox"
                  checked={onlyFastDelivery}
                  onChange={(e) => setOnlyFastDelivery(e.target.checked)}
                />
              </label>
              <label className="shop-switch-item" style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#334155' }}>
                <span><i className="fa-solid fa-boxes-stacked" style={{ color: '#64748b' }}></i> In-Stock Ready</span>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                />
              </label>
            </div>

            {/* Occasion Filter */}
            <div className="shop-filter-group">
              <div className="shop-filter-title">
                <span>Occasion</span>
                <span className="shop-filter-count">{selectedOccasions.length} selected</span>
              </div>
              <div className="shop-checkbox-list">
                {OCCASIONS_LIST.map((occ) => {
                  const isChecked = selectedOccasions.includes(occ);
                  return (
                    <label key={occ} className="shop-checkbox-item">
                      <span className="shop-checkbox-label">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleOccasion(occ)}
                        />
                        <span>{occ}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Material & Craft Filter */}
            <div className="shop-filter-group">
              <div className="shop-filter-title">
                <span>Craft & Material</span>
              </div>
              <div className="shop-checkbox-list">
                {MATERIALS_LIST.map((mat) => {
                  const isChecked = selectedMaterial === mat;
                  return (
                    <label key={mat} className="shop-checkbox-item">
                      <span className="shop-checkbox-label">
                        <input
                          type="radio"
                          name="material-filter"
                          checked={isChecked}
                          onChange={() => setSelectedMaterial(mat)}
                        />
                        <span>{mat === 'All' ? 'All Materials' : mat}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ── 6. PRODUCT GRID & CARDS ─────────────────────────── */}
          <main className="shop-products-container">
            {filteredProducts.length === 0 ? (
              <div className="shop-empty-state">
                <div className="shop-empty-icon">
                  <i className="fa-solid fa-gift"></i>
                </div>
                <h3>No Matching Gifts Found</h3>
                <p>
                  We couldn't find any items matching your selected criteria. Try adjusting your
                  search or clearing active filters to see all personalized gifts.
                </p>
                <button
                  type="button"
                  className="shop-card-add-btn"
                  style={{ maxWidth: '220px', margin: '0 auto' }}
                  onClick={handleResetFilters}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`shop-products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {filteredProducts.map((item) => {
                  const discountPct = Math.round(((item.old_price - item.price) / item.old_price) * 100);
                  const isWish = isInWishlist(item.id);

                  return (
                    <article key={item.id} className="shop-product-card">
                      {/* Media Area */}
                      <div className="shop-card-media">
                        {/* Floating Badges */}
                        <div className="shop-card-badges">
                          {discountPct > 0 && (
                            <span className="shop-badge-discount">-{discountPct}% OFF</span>
                          )}
                          {item.is_customizable && (
                            <span className="shop-badge-custom">
                              <i className="fa-solid fa-wand-magic-sparkles"></i> Personalized
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          type="button"
                          className={`shop-card-wish-btn ${isWish ? 'active' : ''}`}
                          onClick={() => onAddToWishlist && onAddToWishlist(item)}
                          title={isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          aria-label={`Save ${item.name} to wishlist`}
                        >
                          <i className={isWish ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                        </button>

                        {/* Product Image */}
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="shop-card-img"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80";
                          }}
                        />

                        {/* Hover Quick View Trigger */}
                        <div className="shop-card-hover-actions">
                          <button
                            type="button"
                            className="shop-quickview-btn"
                            onClick={() => handleOpenQuickView(item)}
                          >
                            <i className="fa-regular fa-eye"></i> Quick View & Preview
                          </button>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="shop-card-body">
                        <div>
                          <div className="shop-card-meta-top">
                            <span className="shop-card-category">{item.cat_name}</span>
                            <span className="shop-card-rating">
                              <i className="fa-solid fa-star"></i> {item.rating || 4.8}
                              <span style={{ color: '#92400e', fontWeight: 500, fontSize: '11px' }}>
                                ({item.reviews_count || 50})
                              </span>
                            </span>
                          </div>

                          <h3 className="shop-card-title" title={item.name}>
                            {item.name}
                          </h3>

                          {viewMode === 'list' && (
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div>
                          <div className="shop-card-pricing-row">
                            <span className="shop-card-current-price">₹{item.price.toLocaleString()}</span>
                            {item.old_price && (
                              <span className="shop-card-old-price">₹{item.old_price.toLocaleString()}</span>
                            )}
                            {discountPct > 0 && (
                              <span className="shop-card-savings">Save {discountPct}%</span>
                            )}
                          </div>

                          <button
                            type="button"
                            className="shop-card-add-btn"
                            onClick={() => handleAddToCartWithCustom(item, 1)}
                          >
                            <i className="fa-solid fa-cart-shopping"></i> Add to Bag
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>

      </div>

      {/* ── 7. QUICK VIEW MODAL & MOCK PERSONALIZATION PREVIEW ────── */}
      {quickViewProduct && (
        <div
          className="shop-quickview-backdrop"
          onClick={() => setQuickViewProduct(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="shop-quickview-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="shop-quickview-close"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close Preview"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Media Column with Live Engraving Overlay */}
            <div className="shop-quickview-media-col">
              <img
                src={quickViewProduct.image_url}
                alt={quickViewProduct.name}
                className="shop-quickview-img"
              />
              {customEngravingText && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(15, 23, 42, 0.85)',
                    color: '#d4af37',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontFamily: 'serif',
                    fontSize: '14px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    backdropFilter: 'blur(6px)',
                    whiteSpace: 'nowrap',
                    maxWidth: '85%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  ✨ Engraved: "{customEngravingText}"
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="shop-quickview-details-col">
              <div className="shop-card-meta-top">
                <span className="shop-card-category">{quickViewProduct.cat_name}</span>
                <span className="shop-card-rating">
                  <i className="fa-solid fa-star"></i> {quickViewProduct.rating || 4.8}
                  <span style={{ color: '#92400e', fontWeight: 500, fontSize: '11px' }}>
                    ({quickViewProduct.reviews_count || 50} verified reviews)
                  </span>
                </span>
              </div>

              <h2 className="shop-quickview-title">{quickViewProduct.name}</h2>

              <div className="shop-quickview-prices">
                <span className="shop-quickview-now">₹{quickViewProduct.price.toLocaleString()}</span>
                {quickViewProduct.old_price && (
                  <span className="shop-quickview-old">₹{quickViewProduct.old_price.toLocaleString()}</span>
                )}
                <span className="shop-card-savings">
                  Save {Math.round(((quickViewProduct.old_price - quickViewProduct.price) / quickViewProduct.old_price) * 100)}%
                </span>
              </div>

              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                {quickViewProduct.description}
              </p>

              {/* Live Mock Engraving Input */}
              {quickViewProduct.is_customizable && (
                <div className="shop-custom-preview-box">
                  <div className="shop-custom-preview-head">
                    <i className="fa-solid fa-wand-magic-sparkles"></i> Live Engraving / Name Customization
                  </div>
                  <input
                    type="text"
                    className="shop-custom-preview-input"
                    placeholder="Enter name or date to engrave (e.g., 'Ananya & Rohan')"
                    value={customEngravingText}
                    maxLength={32}
                    onChange={(e) => setCustomEngravingText(e.target.value)}
                  />
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                    * Free precision laser engraving included. Sample rendered in live preview.
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="shop-qty-row">
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>Quantity:</span>
                <div className="shop-qty-control">
                  <button
                    type="button"
                    className="shop-qty-btn"
                    onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className="shop-qty-value">{quickViewQty}</span>
                  <button
                    type="button"
                    className="shop-qty-btn"
                    onClick={() => setQuickViewQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="shop-card-add-btn"
                  style={{ flex: 1 }}
                  onClick={() => {
                    handleAddToCartWithCustom(quickViewProduct, quickViewQty, customEngravingText);
                    setQuickViewProduct(null);
                  }}
                >
                  <i className="fa-solid fa-cart-shopping"></i> Add to Bag (₹{(quickViewProduct.price * quickViewQty).toLocaleString()})
                </button>
                <button
                  type="button"
                  className={`shop-card-wish-btn ${isInWishlist(quickViewProduct.id) ? 'active' : ''}`}
                  style={{ position: 'static', width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0 }}
                  onClick={() => onAddToWishlist && onAddToWishlist(quickViewProduct)}
                  title="Save to Wishlist"
                  aria-label="Save to Wishlist"
                >
                  <i className={isInWishlist(quickViewProduct.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                </button>
              </div>

              {/* Assurance list */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-solid fa-shield-heart" style={{ color: '#b8005b' }}></i> Shatterproof Packing
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-solid fa-truck" style={{ color: '#16a34a' }}></i> Fast Dispatch
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
