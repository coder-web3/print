import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { megaMenuData, categoriesData } from '../../data/mockData';
import logoImg from '../../assets/Gift-Studio-Logo.webp';

export default function Header({
  cartCount = 0,
  wishlistCount = 0,
  user = null,
  categories = [],
  activePath = '/',
  onSearch = () => {},
  onNavigate = () => {},
  onLogout = () => {}
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileMega, setOpenMobileMega] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({ id: 'all', name: 'All categories' });
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const catDropdownRef = useRef(null);

  const displayCategories = categories && categories.length > 0 ? categories : categoriesData;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setIsCatDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileMegaToggle = (key) => {
    if (window.innerWidth <= 1200) {
      setOpenMobileMega((prev) => (prev === key ? null : key));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query: searchQuery, categoryId: selectedCategory.id });
    }
  };

  const handleNavLinkClick = (url) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) onNavigate(url);
  };

  return (
    <header className="main-header-wrapper">
      {/* ═════════════════════════════════════════════════════════ */}
      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR (Vivid Magenta)       */}
      {/* ═════════════════════════════════════════════════════════ */}
      <div className="top-bar">
        <div className="container top-bar-container">
          {/* Left: USPs */}
          <div className="top-usp-group desktop-only">
            <span className="top-usp-item">
              <i className="fa-solid fa-gift"></i>
              <span>Unique Gifts for Every Occasion</span>
            </span>
            <span className="top-pipe">|</span>
            <span className="top-usp-item">Custom Design</span>
            <span className="top-pipe">|</span>
            <span className="top-usp-item">Premium Quality</span>
            <span className="top-pipe">|</span>
            <span className="top-usp-item">Fast Delivery</span>
          </div>

          {/* Right: Quick Links & Social Icons */}
          <div className="top-right-group">
            <a
              href="#track"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('/track-order');
              }}
              className="top-action-link"
            >
              <i className="fa-solid fa-truck-fast"></i>
              <span>Track Order</span>
            </a>

            <span className="top-pipe">|</span>

            <a
              href="#help"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('/contact');
              }}
              className="top-action-link"
            >
              <i className="fa-regular fa-circle-question"></i>
              <span>Help</span>
            </a>

            <span className="top-pipe desktop-only">|</span>

            <div className="top-social-icons desktop-only">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">
                <i className="fa-brands fa-pinterest-p"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════ */}
      {/* 2. MIDDLE BRAND, SEARCH & USER ACTIONS BAR               */}
      {/* ═════════════════════════════════════════════════════════ */}
      <div className="middle-bar">
        <div className="container middle-bar-inner">
          {/* Brand Logo & Mobile Trigger */}
          <div className="logo-wrapper">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('/');
              }}
              className="logo"
            >
              <img
                id="headerMainLogo"
                src={logoImg}
                alt="Fine Gift Studio"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.parentNode.querySelector('.logo-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="logo-fallback" style={{ display: 'none' }}>
                <div className="logo-box-icon">
                  <i className="fa-solid fa-gift"></i>
                </div>
                <div className="logo-text-stack">
                  <div className="logo-title">+FINE <span>GIFT STUDIO</span></div>
                  <div className="logo-subtitle">— PRINT YOUR IDEAS —</div>
                </div>
              </div>
            </a>

            {/* Mobile Actions */}
            <div className="mobile-actions mobile-only">
              <a
                href="#cart"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick('/cart');
                }}
                className="mobile-cart-btn"
                aria-label="Cart"
              >
                <i className="fa-solid fa-cart-shopping"></i>
                {cartCount > 0 && <span className="cart-badge-pink">{cartCount}</span>}
              </a>
              <button
                type="button"
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle Navigation"
              >
                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>

          {/* Central Pill Search Bar */}
          <form className="pill-search-container desktop-only" onSubmit={handleSearchSubmit}>
            {/* Category Dropdown Selector */}
            <div className="search-category-dropdown" ref={catDropdownRef}>
              <button
                type="button"
                className="category-select-trigger"
                onClick={() => setIsCatDropdownOpen((prev) => !prev)}
              >
                <span>{selectedCategory.name}</span>
                <i className="fa-solid fa-chevron-down"></i>
              </button>

              {isCatDropdownOpen && (
                <div className="category-select-menu">
                  <button
                    type="button"
                    className="cat-menu-item"
                    onClick={() => {
                      setSelectedCategory({ id: 'all', name: 'All categories' });
                      setIsCatDropdownOpen(false);
                    }}
                  >
                    <span>All categories</span>
                  </button>
                  {displayCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className="cat-menu-item"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsCatDropdownOpen(false);
                      }}
                    >
                      <i className={cat.icon || 'fa-solid fa-gift'}></i>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="search-pipe-divider"></div>

            {/* Search Input Box with Leading Glass Icon */}
            <div className="search-input-wrapper">
              <i className="fa-solid fa-magnifying-glass search-leading-icon"></i>
              <input
                type="text"
                className="pill-search-input"
                placeholder="Search for personalised gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Pink Search Submit Pill */}
            <button type="submit" className="search-submit-btn" aria-label="Search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          {/* Right Header Action Items: Account / Wishlist / Cart */}
          <div className="header-actions-group desktop-only">
            {/* Account Link */}
            {user ? (
              <div className="account-dropdown-wrap">
                <a
                  href="#account"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavLinkClick(user.role === 'admin' ? '/admin' : '/my-account');
                  }}
                  className="header-action-item"
                >
                  <div className="action-circle-icon">
                    <i className="fa-regular fa-user"></i>
                  </div>
                  <span className="action-label">{user.role === 'admin' ? 'Admin' : 'My Account'}</span>
                </a>
              </div>
            ) : (
              <a
                href="#account"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick('/login-register');
                }}
                className="header-action-item"
              >
                <div className="action-circle-icon">
                  <i className="fa-regular fa-user"></i>
                </div>
                <span className="action-label">My Account</span>
              </a>
            )}

            {/* Wishlist Link */}
            <a
              href="#wishlist"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('/wishlist');
              }}
              className="header-action-item"
            >
              <div className="action-circle-icon">
                <i className="fa-regular fa-heart"></i>
                {wishlistCount > 0 && <span className="action-badge-num">{wishlistCount}</span>}
              </div>
              <span className="action-label">Wishlist</span>
            </a>

            {/* Cart Button */}
            <a
              href="#cart"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('/cart');
              }}
              className="header-action-item header-cart-item"
            >
              <div className="action-circle-icon cart-icon-circle">
                <i className="fa-solid fa-cart-shopping"></i>
                <span className="cart-badge-pink">{cartCount}</span>
              </div>
              <span className="action-label">Cart</span>
            </a>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════ */}
      {/* 3. BOTTOM NAVIGATION BAR (Exact Tabs with Icons)         */}
      {/* ═════════════════════════════════════════════════════════ */}
      <div className="bottom-bar">
        <div className="container bottom-bar-inner">
          <nav className={`nav-tabs-container ${isMobileMenuOpen ? 'active-mobile' : ''}`} id="mainNavigation">
            {/* Mobile-Only User Details */}
            <div className="mobile-auth-header mobile-only">
              {user ? (
                <div className="mobile-user-row">
                  <div className="mobile-user-info">
                    <strong>{user.name || user.email}</strong>
                    <span>{user.role === 'admin' ? 'Store Administrator' : 'Customer Account'}</span>
                  </div>
                  <button type="button" className="mobile-logout-btn" onClick={onLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                  </button>
                </div>
              ) : (
                <a
                  href="#login"
                  className="mobile-login-link"
                  onClick={() => handleNavLinkClick('/login-register')}
                >
                  <i className="fa-regular fa-user"></i> Login / Register Account
                </a>
              )}
            </div>

            {/* 1. Home (Active pill) */}
            <a
              href="#home"
              className={`nav-tab-item ${activePath === '/' ? 'active-nav-pill' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('/');
              }}
            >
              <i className="fa-solid fa-house"></i>
              <span>Home</span>
            </a>

            {/* 2. Shop */}
            <a
              href="#shop"
              className="nav-tab-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('/shop');
              }}
            >
              <i className="fa-solid fa-bag-shopping"></i>
              <span>Shop</span>
            </a>

            {/* 3. Custom Design */}
            <a
              href="#custom-design"
              className="nav-tab-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('/shop?filter=custom');
              }}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              <span>Custom Design</span>
            </a>

            {/* 4. Gifts by Occasion */}
            <div className={`nav-tab-dropdown-wrap ${openMobileMega === 'occasion' ? 'mobile-open' : ''}`}>
              <button
                type="button"
                className="nav-tab-item nav-dropdown-btn"
                onClick={() => handleMobileMegaToggle('occasion')}
              >
                <i className="fa-solid fa-gift"></i>
                <span>Gifts by Occasion</span>
                <i className="fa-solid fa-chevron-down nav-chevron"></i>
              </button>

              <div className="mega-dropdown-menu occasion-mega-menu">
                {megaMenuData.occasion.sections.map((sec, idx) => (
                  <div key={idx} className="mega-section-col">
                    <h4 className="mega-col-title">{sec.heading}</h4>
                    <ul className="mega-links-list">
                      {sec.links.map((lnk, lIdx) => (
                        <li key={lIdx}>
                          <a
                            href={lnk.url}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavLinkClick(lnk.url);
                            }}
                          >
                            {lnk.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Gifts by Category */}
            <div className={`nav-tab-dropdown-wrap ${openMobileMega === 'category' ? 'mobile-open' : ''}`}>
              <button
                type="button"
                className="nav-tab-item nav-dropdown-btn"
                onClick={() => handleMobileMegaToggle('category')}
              >
                <i className="fa-solid fa-table-cells-large"></i>
                <span>Gifts by Category</span>
                <i className="fa-solid fa-chevron-down nav-chevron"></i>
              </button>

              <div className="mega-dropdown-menu category-mega-menu">
                <div className="mega-grid-categories">
                  {displayCategories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`#cat-${cat.id}`}
                      className="mega-cat-card"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavLinkClick(`/shop?cat=${cat.id}`);
                      }}
                    >
                      <div className="mega-cat-icon">
                        <i className={cat.icon || 'fa-solid fa-gift'}></i>
                      </div>
                      <div className="mega-cat-meta">
                        <span className="mega-cat-name">{cat.name}</span>
                        {cat.count && <small>{cat.count}+ Products</small>}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Bulk / Corporate Gifts */}
            <div className={`nav-tab-dropdown-wrap ${openMobileMega === 'corporate' ? 'mobile-open' : ''}`}>
              <button
                type="button"
                className="nav-tab-item nav-dropdown-btn"
                onClick={() => handleMobileMegaToggle('corporate')}
              >
                <i className="fa-solid fa-briefcase"></i>
                <span>Bulk/Corporate Gifts</span>
                <i className="fa-solid fa-chevron-down nav-chevron"></i>
              </button>

              <div className="mega-dropdown-menu simple-dropdown-menu">
                <div className="dropdown-simple-list">
                  <a href="#corp-bulk" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/shop?cat=6'); }}>
                    <i className="fa-solid fa-box-open"></i> Bulk Order Discounts
                  </a>
                  <a href="#corp-branding" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/contact?type=corporate'); }}>
                    <i className="fa-solid fa-building"></i> Company Logo Branding
                  </a>
                  <a href="#corp-hampers" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/shop?cat=6'); }}>
                    <i className="fa-solid fa-gifts"></i> Executive Gift Hampers
                  </a>
                  <a href="#corp-quote" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/contact?type=corporate'); }}>
                    <i className="fa-solid fa-file-invoice"></i> Request Instant RFQ Quote
                  </a>
                </div>
              </div>
            </div>

            {/* 7. Our Services */}
            <div className={`nav-tab-dropdown-wrap ${openMobileMega === 'services' ? 'mobile-open' : ''}`}>
              <button
                type="button"
                className="nav-tab-item nav-dropdown-btn"
                onClick={() => handleMobileMegaToggle('services')}
              >
                <i className="fa-solid fa-gears"></i>
                <span>Our Services</span>
                <i className="fa-solid fa-chevron-down nav-chevron"></i>
              </button>

              <div className="mega-dropdown-menu simple-dropdown-menu">
                <div className="dropdown-simple-list">
                  <a href="#service-print" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/shop'); }}>
                    <i className="fa-solid fa-print"></i> Custom UV &amp; Sublimation Printing
                  </a>
                  <a href="#service-laser" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/shop'); }}>
                    <i className="fa-solid fa-bolt"></i> Laser Engraving &amp; Cutting
                  </a>
                  <a href="#service-photo" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/shop?cat=2'); }}>
                    <i className="fa-regular fa-image"></i> Acrylic &amp; Wood Framing
                  </a>
                  <a href="#service-packing" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/shop?cat=8'); }}>
                    <i className="fa-solid fa-ribbon"></i> Luxury Gift Packaging &amp; Hampers
                  </a>
                </div>
              </div>
            </div>

            {/* 8. About Us */}
            <a
              href="#about"
              className={`nav-tab-item ${activePath === '/about-us' || activePath === '/about' ? 'active-nav-pill' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('/about-us');
              }}
            >
              <i className="fa-solid fa-users"></i>
              <span>About Us</span>
            </a>

            {/* 9. Contact Us */}
            <div className={`nav-tab-dropdown-wrap ${openMobileMega === 'contact' ? 'mobile-open' : ''}`}>
              <button
                type="button"
                className={`nav-tab-item nav-dropdown-btn ${activePath === '/contact' ? 'active-nav-pill' : ''}`}
                onClick={() => handleMobileMegaToggle('contact')}
              >
                <i className="fa-solid fa-phone"></i>
                <span>Contact Us</span>
                <i className="fa-solid fa-chevron-down nav-chevron"></i>
              </button>

              <div className="mega-dropdown-menu simple-dropdown-menu">
                <div className="dropdown-simple-list">
                  <a href="tel:+910000000000">
                    <i className="fa-solid fa-phone-volume"></i> Direct Call: (+91) 0000 000 000
                  </a>
                  <a href="https://wa.me/910000000000" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-whatsapp"></i> WhatsApp Live Chat
                  </a>
                  <a href="#contact-page" onClick={(e) => { e.preventDefault(); handleNavLinkClick('/contact'); }}>
                    <i className="fa-solid fa-envelope"></i> Send Message / Inquiry
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
