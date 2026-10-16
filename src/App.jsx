import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import HomePage from './components/Home/HomePage';
import AboutPage from './components/About/AboutPage';
import ContactPage from './components/Contact/ContactPage';
import ShopPage from './components/Shop/ShopPage';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import LegalPage from './components/Legal/LegalPage';
import CartDrawer from './components/Cart/CartDrawer';
import WishlistModal from './components/Wishlist/WishlistModal';
import AccountModal from './components/Account/AccountModal';
import AuthModal from './components/Auth/AuthModal';
import Footer from './components/Footer/Footer';
import Toast from './components/UI/Toast';
import BackToTop from './components/UI/BackToTop';
import Preloader from './components/UI/Preloader';
import { categoriesData, productsData } from './data/mockData';
import { DEFAULT_HOME_CONTENT } from './data/homeContentData';
import { DEFAULT_ABOUT_CONTENT } from './data/aboutContentData';
import { DEFAULT_CONTACT_CONTENT } from './data/contactContentData';

export default function App() {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_admin_categories');
      return saved ? JSON.parse(saved) : categoriesData;
    } catch {
      return categoriesData;
    }
  });
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_admin_products');
      return saved ? JSON.parse(saved) : productsData;
    } catch {
      return productsData;
    }
  });

  const handleUpdateProducts = (newProducts) => {
    setProducts(newProducts);
    try {
      localStorage.setItem('finegift_admin_products', JSON.stringify(newProducts));
    } catch {}
  };

  // Persistent Home Page Content state for CMS
  const [homeContent, setHomeContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_home_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_HOME_CONTENT,
          ...parsed,
          visibility: { ...DEFAULT_HOME_CONTENT.visibility, ...(parsed.visibility || {}) },
          hero: { ...DEFAULT_HOME_CONTENT.hero, ...(parsed.hero || {}) },
          categoryStrip: { ...DEFAULT_HOME_CONTENT.categoryStrip, ...(parsed.categoryStrip || {}) },
          featuredCategories: { ...DEFAULT_HOME_CONTENT.featuredCategories, ...(parsed.featuredCategories || {}) },
          promoBanners: { ...DEFAULT_HOME_CONTENT.promoBanners, ...(parsed.promoBanners || {}) },
          dealsOfDay: { ...DEFAULT_HOME_CONTENT.dealsOfDay, ...(parsed.dealsOfDay || {}) },
          discountBanner: { ...DEFAULT_HOME_CONTENT.discountBanner, ...(parsed.discountBanner || {}) },
          whyChoose: { ...DEFAULT_HOME_CONTENT.whyChoose, ...(parsed.whyChoose || {}) },
          productLists: { ...DEFAULT_HOME_CONTENT.productLists, ...(parsed.productLists || {}) },
          testimonials: { ...DEFAULT_HOME_CONTENT.testimonials, ...(parsed.testimonials || {}) },
        };
      }
      return DEFAULT_HOME_CONTENT;
    } catch {
      return DEFAULT_HOME_CONTENT;
    }
  });

  const handleUpdateHomeContent = (newContent) => {
    setHomeContent(newContent);
    try {
      localStorage.setItem('finegift_home_content', JSON.stringify(newContent));
    } catch (e) {
      console.error('Error saving home content:', e);
    }
  };

  // Persistent About Us Page Content state for CMS
  const [aboutContent, setAboutContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_about_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_ABOUT_CONTENT,
          ...parsed,
          visibility: { ...DEFAULT_ABOUT_CONTENT.visibility, ...(parsed.visibility || {}) },
          hero: { ...DEFAULT_ABOUT_CONTENT.hero, ...(parsed.hero || {}) },
          highlights: parsed.highlights || DEFAULT_ABOUT_CONTENT.highlights,
          story: { ...DEFAULT_ABOUT_CONTENT.story, ...(parsed.story || {}) },
          stats: parsed.stats || DEFAULT_ABOUT_CONTENT.stats,
          process: {
            ...DEFAULT_ABOUT_CONTENT.process,
            ...(parsed.process || {}),
            steps: parsed.process?.steps || DEFAULT_ABOUT_CONTENT.process.steps,
          },
          values: {
            ...DEFAULT_ABOUT_CONTENT.values,
            ...(parsed.values || {}),
            pillars: parsed.values?.pillars || DEFAULT_ABOUT_CONTENT.values.pillars,
          },
          cta: { ...DEFAULT_ABOUT_CONTENT.cta, ...(parsed.cta || {}) },
        };
      }
      return DEFAULT_ABOUT_CONTENT;
    } catch {
      return DEFAULT_ABOUT_CONTENT;
    }
  });

  const handleUpdateAboutContent = (newContent) => {
    setAboutContent(newContent);
    try {
      localStorage.setItem('finegift_about_content', JSON.stringify(newContent));
    } catch (e) {
      console.error('Error saving about content:', e);
    }
  };

  // Persistent Contact Page Content state for CMS
  const [contactContent, setContactContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_contact_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONTACT_CONTENT,
          ...parsed,
          visibility: { ...DEFAULT_CONTACT_CONTENT.visibility, ...(parsed.visibility || {}) },
          hero: { ...DEFAULT_CONTACT_CONTENT.hero, ...(parsed.hero || {}) },
          channels: { ...DEFAULT_CONTACT_CONTENT.channels, ...(parsed.channels || {}) },
          form: {
            ...DEFAULT_CONTACT_CONTENT.form,
            ...(parsed.form || {}),
            prompts: parsed.form?.prompts || DEFAULT_CONTACT_CONTENT.form.prompts,
          },
          sidebar: {
            ...DEFAULT_CONTACT_CONTENT.sidebar,
            ...(parsed.sidebar || {}),
            whatsapp: { ...DEFAULT_CONTACT_CONTENT.sidebar.whatsapp, ...(parsed.sidebar?.whatsapp || {}) },
            call: { ...DEFAULT_CONTACT_CONTENT.sidebar.call, ...(parsed.sidebar?.call || {}) },
            studio: { ...DEFAULT_CONTACT_CONTENT.sidebar.studio, ...(parsed.sidebar?.studio || {}) },
            corporate: { ...DEFAULT_CONTACT_CONTENT.sidebar.corporate, ...(parsed.sidebar?.corporate || {}) },
          },
          workshop: {
            ...DEFAULT_CONTACT_CONTENT.workshop,
            ...(parsed.workshop || {}),
            perks: parsed.workshop?.perks || DEFAULT_CONTACT_CONTENT.workshop.perks,
            pills: parsed.workshop?.pills || DEFAULT_CONTACT_CONTENT.workshop.pills,
          },
        };
      }
      return DEFAULT_CONTACT_CONTENT;
    } catch {
      return DEFAULT_CONTACT_CONTENT;
    }
  });

  const handleUpdateContactContent = (newContent) => {
    setContactContent(newContent);
    try {
      localStorage.setItem('finegift_contact_content', JSON.stringify(newContent));
    } catch (e) {
      console.error('Error saving contact content:', e);
    }
  };

  // Persistent Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent User state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Drawer / Modal visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'

  // Legal policy tab state: 'terms' | 'privacy' | 'shipping' | 'returns'
  const [legalTab, setLegalTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const url = (window.location.pathname + window.location.hash).toLowerCase();
      if (url.includes('privacy')) return 'privacy';
      if (url.includes('shipping')) return 'shipping';
      if (url.includes('return') || url.includes('refund')) return 'returns';
    }
    return 'terms';
  });

  // Shop filter state for cross-component navigation
  const [shopCategory, setShopCategory] = useState('all');
  const [shopSearchQuery, setShopSearchQuery] = useState('');

  const handleOpenAuth = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'info' });

  // Routing state ('home' | 'about' | 'contact' | 'dashboard' | 'legal')
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const fullUrl = path + hash;

      if (fullUrl.includes('terms') || fullUrl.includes('privacy') || fullUrl.includes('shipping') || fullUrl.includes('return') || fullUrl.includes('refund')) return 'legal';
      if (fullUrl.includes('dashboard') || fullUrl.includes('account')) return 'dashboard';
      if (fullUrl.includes('admin')) return 'admin';
      if (fullUrl.includes('shop') || fullUrl.includes('custom-design') || fullUrl.includes('category')) return 'shop';
      if (fullUrl.includes('about')) return 'about';
      if (fullUrl.includes('contact')) return 'contact';
    }
    return 'home';
  });

  // LocalStorage synchronizers
  useEffect(() => {
    try {
      localStorage.setItem('finegift_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('finegift_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('finegift_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('finegift_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('finegift_user');
      }
    } catch {}
  }, [user]);

  // Synchronize URL change (both popstate for back/forward and hashchange for legacy links)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      const full = path + hash;

      if (full.includes('cart')) {
        setIsCartOpen(true);
      } else if (full.includes('wishlist')) {
        setIsWishlistOpen(true);
      } else if (full.includes('login')) {
        handleOpenAuth('login');
      } else if (full.includes('signup') || full.includes('register')) {
        handleOpenAuth('signup');
      } else if (full.includes('terms')) {
        setLegalTab('terms');
        setCurrentPage('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('privacy')) {
        setLegalTab('privacy');
        setCurrentPage('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('shipping')) {
        setLegalTab('shipping');
        setCurrentPage('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('return') || full.includes('refund')) {
        setLegalTab('returns');
        setCurrentPage('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('account') || full.includes('dashboard')) {
        setCurrentPage('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('admin')) {
        setCurrentPage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('shop') || full.includes('custom-design') || full.includes('category')) {
        setCurrentPage('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('about')) {
        setCurrentPage('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('contact')) {
        setCurrentPage('contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [user]);

  const showNotification = (type, title, message) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification('success', 'Added to Bag', `"${product.name}" added to your bag!`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showNotification('info', 'Bag Updated', 'Item removed from your bag.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleAddToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showNotification('info', 'Wishlist Notice', `"${product.name}" is already in your wishlist.`);
        return prev;
      }
      showNotification('success', 'Saved to Wishlist', `"${product.name}" saved to wishlist!`);
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    showNotification('info', 'Wishlist Notice', 'Item removed from wishlist.');
  };

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    showNotification('success', 'Moved to Bag', `"${product.name}" moved to your bag!`);
  };

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    setCart((prev) => {
      const updated = [...prev];
      wishlist.forEach((item) => {
        const found = updated.find((u) => u.id === item.id);
        if (found) {
          found.quantity = (found.quantity || 1) + 1;
        } else {
          updated.push({ ...item, quantity: 1 });
        }
      });
      return updated;
    });
    setWishlist([]);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    showNotification('success', 'All Items Moved', 'All wishlist items moved to your bag!');
  };

  const handleOrderPlaced = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    showNotification('success', 'Order Placed!', `Your order #${newOrder.id} has been placed.`);
  };

  const handleSearch = ({ query, categoryId }) => {
    let catName = 'all';
    if (categoryId && categoryId !== 'all') {
      const match = categories.find((c) => String(c.id) === String(categoryId));
      if (match) catName = match.name;
    }
    setShopCategory(catName);
    setShopSearchQuery(query || '');
    setCurrentPage('shop');
    try {
      window.history.pushState({}, '', '/shop');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (query) {
      showNotification('info', 'Searching Shop', `Filtering catalog for "${query}"`);
    }
  };

  const handleNavigate = (path) => {
    if (path === '/cart' || path === '#cart') {
      setIsCartOpen(true);
      return;
    }
    if (path === '/wishlist' || path === '#wishlist') {
      setIsWishlistOpen(true);
      return;
    }
    if (
      path === '/login-register' ||
      path === '/login' ||
      path === '#login'
    ) {
      handleOpenAuth('login');
      return;
    }
    if (path === '/signup' || path === '#signup') {
      handleOpenAuth('signup');
      return;
    }

    if (path === '/admin' || path === '#admin' || path.startsWith('/admin')) {
      setCurrentPage('admin');
      try { window.history.pushState({}, '', '/admin'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path === '/my-account' ||
      path === '/dashboard' ||
      path === '#account' ||
      path === '#dashboard'
    ) {
      setCurrentPage('dashboard');
      try { window.history.pushState({}, '', '/dashboard'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path === '/terms' ||
      path === '#terms' ||
      path === '/terms-and-conditions'
    ) {
      setLegalTab('terms');
      setCurrentPage('legal');
      try { window.history.pushState({}, '', '/terms'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path === '/privacy-policy' ||
      path === '/privacy' ||
      path === '#privacy'
    ) {
      setLegalTab('privacy');
      setCurrentPage('legal');
      try { window.history.pushState({}, '', '/privacy-policy'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path === '/shipping' ||
      path === '#shipping' ||
      path === '/shipping-policy'
    ) {
      setLegalTab('shipping');
      setCurrentPage('legal');
      try { window.history.pushState({}, '', '/shipping'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path === '/returns' ||
      path === '#returns' ||
      path === '/return-and-refund' ||
      path === '/refund'
    ) {
      setLegalTab('returns');
      setCurrentPage('legal');
      try { window.history.pushState({}, '', '/returns'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path.startsWith('/shop') ||
      path === '#shop' ||
      path === '/custom-design' ||
      path === '#custom-design' ||
      path.startsWith('/category/')
    ) {
      if (path.startsWith('/category/')) {
        const catPart = decodeURIComponent(path.replace('/category/', ''));
        setShopCategory(catPart);
      }
      setCurrentPage('shop');
      try { window.history.pushState({}, '', '/shop'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path.startsWith('/contact') || path === '#contact' || path === '#contact-page') {
      setCurrentPage('contact');
      try { window.history.pushState({}, '', '/contact'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '/about-us' || path === '/about' || path === '#about') {
      setCurrentPage('about');
      try { window.history.pushState({}, '', '/about'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '/' || path === '#home' || path === '/home') {
      setCurrentPage('home');
      try { window.history.pushState({}, '', '/'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showNotification('info', 'Page Notice', `Navigating to ${path}`);
    }
  };

  const handleSubscribe = (email) => {
    showNotification('success', 'Subscribed', `Thank you for subscribing with ${email}!`);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const activePath =
    currentPage === 'admin'
      ? '/admin'
      : currentPage === 'shop'
      ? '/shop'
      : currentPage === 'about'
      ? '/about-us'
      : currentPage === 'contact'
      ? '/contact'
      : currentPage === 'dashboard'
      ? '/my-account'
      : currentPage === 'legal'
      ? legalTab === 'privacy'
        ? '/privacy-policy'
        : '/terms'
      : '/';

  if (currentPage === 'admin') {
    return (
      <>
        <AdminDashboard
          user={user}
          orders={orders}
          products={products}
          categories={categories}
          homeContent={homeContent}
          aboutContent={aboutContent}
          contactContent={contactContent}
          onUpdateProducts={handleUpdateProducts}
          onUpdateOrders={(newOrds) => setOrders(newOrds)}
          onUpdateCategories={(newCats) => {
            setCategories(newCats);
            try {
              localStorage.setItem('finegift_admin_categories', JSON.stringify(newCats));
            } catch {}
          }}
          onUpdateHomeContent={handleUpdateHomeContent}
          onUpdateAboutContent={handleUpdateAboutContent}
          onUpdateContactContent={handleUpdateContactContent}
          onNavigate={handleNavigate}
          showNotification={showNotification}
        />
        <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* 1. Header (Sticky navigation, mega menus, search, cart counter, modals trigger) */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        user={user}
        categories={categories}
        activePath={activePath}
        onSearch={handleSearch}
        onNavigate={handleNavigate}
        onLogout={() => {
          setUser(null);
          showNotification('info', 'Signed Out', 'You have been signed out.');
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => handleNavigate('/my-account')}
        onOpenAuth={handleOpenAuth}
      />

      {/* 2. Page Content: Contact vs About Us vs User Dashboard vs Legal Page vs Home Page */}
      {currentPage === 'contact' ? (
        <ContactPage
          contactContent={contactContent}
          onNavigate={handleNavigate}
          showNotification={showNotification}
        />
      ) : currentPage === 'about' ? (
        <AboutPage
          aboutContent={aboutContent}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
        />
      ) : currentPage === 'shop' ? (
        <ShopPage
          categories={categories}
          products={products}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          wishlist={wishlist}
          onNavigate={handleNavigate}
          showNotification={showNotification}
          initialCategory={shopCategory}
        />
      ) : currentPage === 'dashboard' ? (
        <UserDashboard
          user={user}
          orders={orders}
          wishlist={wishlist}
          cart={cart}
          onNavigate={handleNavigate}
          onOpenAuth={handleOpenAuth}
          onLogout={() => {
            setUser(null);
            showNotification('info', 'Signed Out', 'You have been safely signed out.');
          }}
          onUpdateUser={(updated) => {
            setUser(updated);
            showNotification('success', 'Profile Saved', 'Profile changes updated.');
          }}
          onAddToCart={handleAddToCart}
          onRemoveWishlist={handleRemoveFromWishlist}
          showNotification={showNotification}
        />
      ) : currentPage === 'legal' ? (
        <LegalPage
          initialTab={legalTab}
          onNavigate={handleNavigate}
        />
      ) : (
        <HomePage
          homeContent={homeContent}
          categories={categories}
          products={products}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onProductClick={(p) => {
            setCurrentPage('shop');
            try { window.history.pushState({}, '', '/shop'); } catch {}
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onCategoryClick={(c) => {
            setShopCategory(c.name);
            setCurrentPage('shop');
            try { window.history.pushState({}, '', `/category/${encodeURIComponent(c.name)}`); } catch {}
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
        />
      )}

      {/* 3. Footer (Features strip, footer links, newsletter form, store badges) */}
      <Footer
        onSubscribe={handleSubscribe}
        onNavigate={handleNavigate}
      />

      {/* 4. Functional Overlays: Cart Drawer, Wishlist Modal, Account Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onNavigate={handleNavigate}
        user={user}
        onOrderPlaced={handleOrderPlaced}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
        onMoveAllToCart={handleMoveAllToCart}
        onNavigate={handleNavigate}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        onUpdateUser={(updated) => {
          setUser(updated);
          showNotification('success', 'Profile Saved', 'Profile changes updated.');
        }}
        onLogout={() => {
          setUser(null);
          showNotification('info', 'Signed Out', 'You have signed out.');
        }}
        onLogin={(loggedUser) => {
          setUser(loggedUser);
          showNotification('success', 'Welcome Back', `Logged in as ${loggedUser.name}!`);
        }}
        onOpenAuth={handleOpenAuth}
        orders={orders}
        onOpenWishlist={() => {
          setIsAccountOpen(false);
          setIsWishlistOpen(true);
        }}
        onOpenCart={() => {
          setIsAccountOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* 5. Authentication Modal (Sign In, Sign Up & Forgot Password) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
        }}
        showToast={showNotification}
        onNavigate={handleNavigate}
      />

      {/* 5. Global UI Components & Preloader */}
      <Preloader />
      <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
      <BackToTop />
    </div>
  );
}
