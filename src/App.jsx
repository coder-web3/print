import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import HomePage from './components/Home/HomePage';
import AboutPage from './components/About/AboutPage';
import ContactPage from './components/Contact/ContactPage';
import UserDashboard from './components/Dashboard/UserDashboard';
import CartDrawer from './components/Cart/CartDrawer';
import WishlistModal from './components/Wishlist/WishlistModal';
import AccountModal from './components/Account/AccountModal';
import AuthModal from './components/Auth/AuthModal';
import Footer from './components/Footer/Footer';
import Toast from './components/UI/Toast';
import BackToTop from './components/UI/BackToTop';
import Preloader from './components/UI/Preloader';
import { categoriesData, productsData } from './data/mockData';

export default function App() {
  const [categories, setCategories] = useState(categoriesData);
  const [products, setProducts] = useState(productsData);

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

  const handleOpenAuth = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'info' });

  // Routing state ('home' | 'about' | 'contact' | 'dashboard')
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('dashboard') || hash.includes('account')) return 'dashboard';
      if (hash.includes('about')) return 'about';
      if (hash.includes('contact')) return 'contact';
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

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('cart')) {
        setIsCartOpen(true);
      } else if (hash.includes('wishlist')) {
        setIsWishlistOpen(true);
      } else if (hash.includes('login')) {
        handleOpenAuth('login');
      } else if (hash.includes('signup') || hash.includes('register')) {
        handleOpenAuth('signup');
      } else if (hash.includes('account') || hash.includes('dashboard')) {
        setCurrentPage('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.includes('about')) {
        setCurrentPage('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.includes('contact')) {
        setCurrentPage('contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#home' || hash === '' || hash === '#/') {
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
    showNotification('info', 'Searching', `Searching for "${query || 'all'}" in category #${categoryId}`);
  };

  const handleNavigate = (path) => {
    if (path === '/cart' || path === '#cart') {
      setIsCartOpen(true);
    } else if (path === '/wishlist' || path === '#wishlist') {
      setIsWishlistOpen(true);
    } else if (
      path === '/login-register' ||
      path === '/login' ||
      path === '#login'
    ) {
      handleOpenAuth('login');
    } else if (path === '/signup' || path === '#signup') {
      handleOpenAuth('signup');
    } else if (
      path === '/my-account' ||
      path === '/dashboard' ||
      path === '/admin' ||
      path === '#account' ||
      path === '#dashboard'
    ) {
      setCurrentPage('dashboard');
      window.location.hash = 'dashboard';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path.startsWith('/contact') || path === '#contact' || path === '#contact-page') {
      setCurrentPage('contact');
      window.location.hash = 'contact';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '/about-us' || path === '/about' || path === '#about') {
      setCurrentPage('about');
      window.location.hash = 'about';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '/' || path === '#home' || path === '/home') {
      setCurrentPage('home');
      window.location.hash = 'home';
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
    currentPage === 'about'
      ? '/about-us'
      : currentPage === 'contact'
      ? '/contact'
      : currentPage === 'dashboard'
      ? '/my-account'
      : '/';

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

      {/* 2. Page Content: Contact vs About Us vs User Dashboard vs Home Page */}
      {currentPage === 'contact' ? (
        <ContactPage
          onNavigate={handleNavigate}
          showNotification={showNotification}
        />
      ) : currentPage === 'about' ? (
        <AboutPage
          onNavigate={handleNavigate}
          onSearch={handleSearch}
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
      ) : (
        <HomePage
          categories={categories}
          products={products}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onProductClick={(p) => showNotification('info', 'Product Details', `Viewing: ${p.name}`)}
          onCategoryClick={(c) => showNotification('info', 'Category', `Selected: ${c.name}`)}
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
      />

      {/* 5. Global UI Components & Preloader */}
      <Preloader />
      <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
      <BackToTop />
    </div>
  );
}
