import React, { useState } from 'react';
import Header from './components/Header/Header';
import HomePage from './components/Home/HomePage';
import Footer from './components/Footer/Footer';
import Toast from './components/UI/Toast';
import BackToTop from './components/UI/BackToTop';
import Preloader from './components/UI/Preloader';
import { categoriesData, productsData } from './data/mockData';

export default function App() {
  const [categories, setCategories] = useState(categoriesData);
  const [products, setProducts] = useState(productsData);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState({ id: 1, name: 'Guest User', role: 'customer' });
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'info' });

  const showNotification = (type, title, message) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification('success', 'Cart Updated', `"${product.name}" added to cart!`);
  };

  const handleAddToWishlist = (product) => {
    if (wishlist.some((item) => item.id === product.id)) {
      showNotification('info', 'Wishlist Notice', `"${product.name}" is already in your wishlist.`);
      return;
    }
    setWishlist((prev) => [...prev, product]);
    showNotification('success', 'Wishlist Updated', `"${product.name}" saved to wishlist!`);
  };

  const handleSearch = ({ query, categoryId }) => {
    showNotification('info', 'Searching', `Searching for "${query || 'all'}" in category #${categoryId}`);
  };

  const handleNavigate = (path) => {
    console.log('Navigating to:', path);
  };

  const handleSubscribe = (email) => {
    showNotification('success', 'Subscribed', `Thank you for subscribing with ${email}!`);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      {/* 1. Header (Sticky navigation, mega menus, search, cart counter) */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        user={user}
        categories={categories}
        onSearch={handleSearch}
        onNavigate={handleNavigate}
        onLogout={() => setUser(null)}
      />

      {/* 2. Homepage (Hero accordion, featured categories, deals, popular sliders, lists, testimonials) */}
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

      {/* 3. Footer (Features strip, footer links, newsletter form, store badges) */}
      <Footer
        onSubscribe={handleSubscribe}
        onNavigate={handleNavigate}
      />

      {/* 4. Global UI Components & Preloader */}
      <Preloader />
      <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
      <BackToTop />
    </div>
  );
}
