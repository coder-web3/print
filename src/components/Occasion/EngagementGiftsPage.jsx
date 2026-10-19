import React, { useState } from 'react';
import './EngagementGiftsPage.css';
import heroVisualImg from '../../assets/images/engagement-gifts-banner.png';
import framesImg from '../../assets/images/frames.avif';
import lampsImg from '../../assets/images/lamps.avif';
import cupsImg from '../../assets/images/cups-product.avif';
import packagingImg from '../../assets/images/packaging.avif';
import giftsImg from '../../assets/images/gifts.avif';
import walletsImg from '../../assets/images/wallets.avif';
import tshirtImg from '../../assets/images/t-shirt.avif';
import corporateImg from '../../assets/images/corporate-gifts.avif';

// Quick Category Filters
const QUICK_FILTERS = [
  { id: 'all', label: 'All Engagement Gifts', icon: 'fa-solid fa-shapes' },
  { id: 'photo', label: 'Photo Gifts', icon: 'fa-solid fa-image' },
  { id: 'couple', label: 'Couple Gifts', icon: 'fa-solid fa-heart' },
  { id: 'decor', label: 'Home Decor', icon: 'fa-solid fa-house-chimney-window' },
  { id: 'hampers', label: 'Custom Hampers', icon: 'fa-solid fa-basket-shopping' },
  { id: 'led', label: 'LED Gifts', icon: 'fa-solid fa-lightbulb' },
  { id: 'jewelry', label: 'Jewelry Boxes', icon: 'fa-solid fa-ring' },
  { id: 'mugs', label: 'Mugs & Drinkware', icon: 'fa-solid fa-mug-hot' },
  { id: 'apparel', label: 'Apparel', icon: 'fa-solid fa-shirt' }
];

// Popular Engagement Gifts Data
const POPULAR_GIFTS = [
  {
    id: 'eng_pop_1',
    name: 'Personalised Couple Photoframe',
    price: 999,
    originalPrice: 1299,
    rating: 4.9,
    reviews: 120,
    image: framesImg,
    category: 'photo'
  },
  {
    id: 'eng_pop_2',
    name: 'Engraved LED Lamp',
    price: 699,
    originalPrice: 900,
    rating: 4.8,
    reviews: 95,
    image: lampsImg,
    category: 'led'
  },
  {
    id: 'eng_pop_3',
    name: 'Crafted Couple Mugs',
    price: 459,
    originalPrice: 599,
    rating: 4.7,
    reviews: 86,
    image: cupsImg,
    category: 'mugs'
  },
  {
    id: 'eng_pop_4',
    name: 'Personalised Gift Hamper',
    price: 1499,
    originalPrice: 1899,
    rating: 4.9,
    reviews: 110,
    image: packagingImg,
    category: 'hampers'
  },
  {
    id: 'eng_pop_5',
    name: 'Engagement Memory Book',
    price: 899,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 74,
    image: giftsImg,
    category: 'photo'
  }
];

// Gifts for Him Data
const GIFTS_FOR_HIM = [
  {
    id: 'eng_him_1',
    name: 'Personalised Wallet',
    price: 799,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 64,
    image: walletsImg,
    category: 'couple'
  },
  {
    id: 'eng_him_2',
    name: 'Custom T-Shirt',
    price: 599,
    originalPrice: 799,
    rating: 4.7,
    reviews: 52,
    image: tshirtImg,
    category: 'apparel'
  },
  {
    id: 'eng_him_3',
    name: 'Engraved Keychain',
    price: 399,
    originalPrice: 520,
    rating: 4.8,
    reviews: 91,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80',
    category: 'couple'
  },
  {
    id: 'eng_him_4',
    name: 'Groom To Be Mug',
    price: 499,
    originalPrice: 650,
    rating: 4.6,
    reviews: 40,
    image: cupsImg,
    category: 'mugs'
  },
  {
    id: 'eng_him_5',
    name: 'Personalised Perfume Box',
    price: 1299,
    originalPrice: 1599,
    rating: 4.7,
    reviews: 38,
    image: corporateImg,
    category: 'hampers'
  }
];

// Gifts for Her Data
const GIFTS_FOR_HER = [
  {
    id: 'eng_her_1',
    name: 'Custom Jewellery Box',
    price: 1099,
    originalPrice: 1399,
    rating: 4.9,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    category: 'jewelry'
  },
  {
    id: 'eng_her_2',
    name: 'Personalised Photo Lamp',
    price: 799,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 76,
    image: lampsImg,
    category: 'led'
  },
  {
    id: 'eng_her_3',
    name: 'Custom Name Necklace',
    price: 1499,
    originalPrice: 1899,
    rating: 4.9,
    reviews: 68,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    category: 'jewelry'
  },
  {
    id: 'eng_her_4',
    name: 'Floral Gift Box',
    price: 999,
    originalPrice: 1199,
    rating: 4.9,
    reviews: 54,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    category: 'hampers'
  },
  {
    id: 'eng_her_5',
    name: 'Spa Gift Hamper',
    price: 1299,
    originalPrice: 1599,
    rating: 4.7,
    reviews: 46,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    category: 'hampers'
  }
];

// Testimonials Data
const REVIEWS = [
  {
    id: 'rev_1',
    name: 'Priya & Rahul',
    city: 'Bangalore, India',
    title: 'Absolutely Beautiful!',
    comment: 'The customised photo frame we ordered for our engagement was perfect. Amazing quality and fast delivery.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5
  },
  {
    id: 'rev_2',
    name: 'Ayesha Khan',
    city: 'Mangalore, India',
    title: 'Perfect Engagement Gift!',
    comment: 'The gift hamper was beautifully packed and looked premium. Highly recommend Fine Gift Studio.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    rating: 5
  },
  {
    id: 'rev_3',
    name: 'Sneha & Arjun',
    city: 'Delhi, India',
    title: 'Excellent Quality',
    comment: 'Loved the personalised LED lamp. It made our special day even more memorable.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5
  }
];

export default function EngagementGiftsPage({
  wishlist = [],
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onProductClick = () => {},
  onNavigate = () => {}
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Filter helper
  const filterList = (items) => {
    if (activeFilter === 'all') return items;
    return items.filter((item) => item.category === activeFilter);
  };

  const isItemInWishlist = (productId) => {
    return wishlist.some((item) => (item.id || item.product_id) === productId);
  };

  const scrollToCollection = () => {
    const el = document.getElementById('popular-engagement-gifts');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="engagement-page-wrapper">
      {/* ─────────────────────────────────────────────────────────────
          1. BREADCRUMBS
          ───────────────────────────────────────────────────────────── */}
      <div className="container">
        <nav className="engagement-breadcrumbs" aria-label="Breadcrumb">
          <button type="button" className="breadcrumb-link" onClick={() => onNavigate('/')}>
            <i className="fa-solid fa-house"></i> Home
          </button>
          <span className="breadcrumb-separator">/</span>
          <button type="button" className="breadcrumb-link" onClick={() => onNavigate('/shop')}>
            Gifts by Occasion
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Engagement Gifts</span>
        </nav>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (CELEBRATE TOGETHERNESS)
          ───────────────────────────────────────────────────────────── */}
      <section className="engagement-hero-section">
        <div className="container engagement-hero-container">
          <div className="engagement-hero-content">
            <div className="engagement-hero-tag">
              <span className="tag-line"></span>
              <span>CELEBRATE TOGETHERNESS</span>
              <span className="tag-line"></span>
            </div>

            <h1 className="engagement-hero-title">
              Engagement <span className="highlight-pink">Gifts</span>
            </h1>

            <p className="engagement-hero-desc">
              Thoughtful and personalised gifts to celebrate a beautiful new beginning.
            </p>

            <div className="engagement-hero-features">
              <div className="hero-feature-item">
                <span className="feature-icon">🌸</span>
                <span>Personalised Gifts</span>
              </div>
              <div className="hero-feature-item">
                <span className="feature-icon">💎</span>
                <span>Premium Quality</span>
              </div>
              <div className="hero-feature-item">
                <span className="feature-icon">🚀</span>
                <span>Fast Delivery</span>
              </div>
            </div>

            <button type="button" className="engagement-cta-btn" onClick={scrollToCollection}>
              <span>Explore Collection</span>
              <span className="btn-arrow-circle">
                <i className="fa-solid fa-arrow-right"></i>
              </span>
            </button>
          </div>

          <div className="engagement-hero-visual">
            <div className="hero-visual-card">
              <img
                src={heroVisualImg}
                alt="Two Hearts One Beautiful Journey - Engagement Gifts"
                className="hero-main-banner-img"
              />
              <div className="hero-floating-quote">
                <span className="cursive-script">Two Hearts One Beautiful Journey</span>
                <i className="fa-solid fa-heart floating-heart-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. QUICK SUB-THEME FILTER PILLS
          ───────────────────────────────────────────────────────────── */}
      <section className="engagement-filters-section">
        <div className="container">
          <div className="engagement-filters-scroll">
            {QUICK_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`filter-pill-btn ${activeFilter === f.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.id)}
              >
                <div className="filter-pill-icon-wrap">
                  <i className={f.icon}></i>
                </div>
                <span className="filter-pill-label">{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. POPULAR ENGAGEMENT GIFTS
          ───────────────────────────────────────────────────────────── */}
      <section id="popular-engagement-gifts" className="engagement-products-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-sub-tag">TRENDING NOW —</div>
              <h2 className="section-main-heading">Popular Engagement Gifts</h2>
              <p className="section-subtitle">
                Make their special moment even more memorable with our handpicked gifts.
              </p>
            </div>
            <div className="section-actions-row">
              <button
                type="button"
                className="section-view-all-btn"
                onClick={() => onNavigate('/shop?cat=gifts')}
              >
                View All
              </button>
              <div className="slider-arrow-btns">
                <button type="button" className="slider-btn prev" aria-label="Previous">
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button type="button" className="slider-btn next" aria-label="Next">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="engagement-product-grid">
            {filterList(POPULAR_GIFTS).map((prod) => (
              <div key={prod.id} className="engagement-prod-card">
                <button
                  type="button"
                  className={`card-wishlist-btn ${isItemInWishlist(prod.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToWishlist(prod);
                  }}
                  aria-label="Add to Wishlist"
                >
                  <i className={isItemInWishlist(prod.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                </button>

                <div
                  className="card-img-wrap"
                  onClick={() => onProductClick(prod)}
                  role="button"
                  tabIndex={0}
                >
                  <img src={prod.image} alt={prod.name} loading="lazy" />
                </div>

                <div className="card-info-wrap">
                  <h3
                    className="card-prod-title"
                    onClick={() => onProductClick(prod)}
                    title={prod.name}
                  >
                    {prod.name}
                  </h3>

                  <div className="card-price-row">
                    <span className="card-price">₹{prod.price}</span>
                    {prod.originalPrice && (
                      <span className="card-old-price">₹{prod.originalPrice}</span>
                    )}
                    <div className="card-rating-badge">
                      <i className="fa-solid fa-star"></i>
                      <span>{prod.rating}</span>
                      <span className="review-count">({prod.reviews})</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="card-add-cart-btn"
                    onClick={() => onAddToCart(prod)}
                  >
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. MID FEATURE BANNER: PERSONALISED ENGAGEMENT HAMPERS
          ───────────────────────────────────────────────────────────── */}
      <section className="engagement-hamper-banner-section">
        <div className="container">
          <div className="hamper-banner-card">
            <div className="hamper-banner-left">
              <span className="hamper-tag">MAKE IT EXTRA SPECIAL</span>
              <h2 className="hamper-title">
                Personalised <br />
                <span className="highlight-pink">Engagement Hampers</span>
              </h2>
              <p className="hamper-desc">
                Curated with love, made for their new beginning.
              </p>
              <button
                type="button"
                className="hamper-cta-btn"
                onClick={() => onNavigate('/shop?cat=packaging')}
              >
                <span>Shop Hampers</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            <div className="hamper-banner-center">
              <div className="hamper-img-wrapper">
                <img
                  src={packagingImg}
                  alt="Personalised Engagement Hampers"
                  className="hamper-center-img"
                />
                <div className="hamper-float-badge">
                  <span>Happy Engagement ❤️</span>
                </div>
              </div>
            </div>

            <div className="hamper-banner-right">
              <div className="hamper-feature-pill">
                <span className="pill-icon">🎁</span>
                <span>Customised Gifts</span>
              </div>
              <div className="hamper-feature-pill">
                <span className="pill-icon">📦</span>
                <span>Premium Packaging</span>
              </div>
              <div className="hamper-feature-pill">
                <span className="pill-icon">🎀</span>
                <span>Wide Range of Options</span>
              </div>
              <div className="hamper-feature-pill">
                <span className="pill-icon">⚡</span>
                <span>Fast &amp; Reliable Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. GIFTS FOR HIM
          ───────────────────────────────────────────────────────────── */}
      <section className="engagement-products-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-main-heading">Gifts for Him</h2>
              <p className="section-subtitle">Thoughtful gifts he'll always cherish.</p>
            </div>
            <button
              type="button"
              className="section-view-all-btn"
              onClick={() => onNavigate('/shop?search=him')}
            >
              View All
            </button>
          </div>

          <div className="engagement-product-grid">
            {filterList(GIFTS_FOR_HIM).map((prod) => (
              <div key={prod.id} className="engagement-prod-card">
                <button
                  type="button"
                  className={`card-wishlist-btn ${isItemInWishlist(prod.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToWishlist(prod);
                  }}
                  aria-label="Add to Wishlist"
                >
                  <i className={isItemInWishlist(prod.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                </button>

                <div
                  className="card-img-wrap"
                  onClick={() => onProductClick(prod)}
                  role="button"
                  tabIndex={0}
                >
                  <img src={prod.image} alt={prod.name} loading="lazy" />
                </div>

                <div className="card-info-wrap">
                  <h3
                    className="card-prod-title"
                    onClick={() => onProductClick(prod)}
                    title={prod.name}
                  >
                    {prod.name}
                  </h3>

                  <div className="card-price-row">
                    <span className="card-price">₹{prod.price}</span>
                    {prod.originalPrice && (
                      <span className="card-old-price">₹{prod.originalPrice}</span>
                    )}
                    <div className="card-rating-badge">
                      <i className="fa-solid fa-star"></i>
                      <span>{prod.rating}</span>
                      <span className="review-count">({prod.reviews})</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="card-add-cart-btn"
                    onClick={() => onAddToCart(prod)}
                  >
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. GIFTS FOR HER
          ───────────────────────────────────────────────────────────── */}
      <section className="engagement-products-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-main-heading">Gifts for Her</h2>
              <p className="section-subtitle">Beautiful gifts for her special journey.</p>
            </div>
            <button
              type="button"
              className="section-view-all-btn"
              onClick={() => onNavigate('/shop?search=her')}
            >
              View All
            </button>
          </div>

          <div className="engagement-product-grid">
            {filterList(GIFTS_FOR_HER).map((prod) => (
              <div key={prod.id} className="engagement-prod-card">
                <button
                  type="button"
                  className={`card-wishlist-btn ${isItemInWishlist(prod.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToWishlist(prod);
                  }}
                  aria-label="Add to Wishlist"
                >
                  <i className={isItemInWishlist(prod.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                </button>

                <div
                  className="card-img-wrap"
                  onClick={() => onProductClick(prod)}
                  role="button"
                  tabIndex={0}
                >
                  <img src={prod.image} alt={prod.name} loading="lazy" />
                </div>

                <div className="card-info-wrap">
                  <h3
                    className="card-prod-title"
                    onClick={() => onProductClick(prod)}
                    title={prod.name}
                  >
                    {prod.name}
                  </h3>

                  <div className="card-price-row">
                    <span className="card-price">₹{prod.price}</span>
                    {prod.originalPrice && (
                      <span className="card-old-price">₹{prod.originalPrice}</span>
                    )}
                    <div className="card-rating-badge">
                      <i className="fa-solid fa-star"></i>
                      <span>{prod.rating}</span>
                      <span className="review-count">({prod.reviews})</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="card-add-cart-btn"
                    onClick={() => onAddToCart(prod)}
                  >
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. WHY CHOOSE US — MAKE THEIR MOMENT MORE SPECIAL
          ───────────────────────────────────────────────────────────── */}
      <section className="engagement-why-choose-section">
        <div className="container">
          <div className="why-choose-header text-center">
            <span className="section-sub-tag">— WHY CHOOSE US —</span>
            <h2 className="section-main-heading">Make Their Moment More Special</h2>
            <p className="section-subtitle">
              We create personalised gifts that add meaning to life's most beautiful moments.
            </p>
          </div>

          <div className="why-choose-grid">
            <div className="why-card">
              <div className="why-card-icon-wrap pink">
                <i className="fa-solid fa-pen-ruler"></i>
              </div>
              <h3 className="why-card-title">Unique &amp; Custom Designs</h3>
              <p className="why-card-desc">Made just for them</p>
            </div>

            <div className="why-card">
              <div className="why-card-icon-wrap purple">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="why-card-title">High Quality Materials</h3>
              <p className="why-card-desc">Long lasting &amp; premium</p>
            </div>

            <div className="why-card">
              <div className="why-card-icon-wrap rose">
                <i className="fa-solid fa-gift"></i>
              </div>
              <h3 className="why-card-title">Wide Range of Gifts</h3>
              <p className="why-card-desc">Gifts for every style</p>
            </div>

            <div className="why-card">
              <div className="why-card-icon-wrap fuchsia">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <h3 className="why-card-title">Fast &amp; Reliable Delivery</h3>
              <p className="why-card-desc">On time every time</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. HAPPY CUSTOMERS — WHAT COUPLES SAY ABOUT US
          ───────────────────────────────────────────────────────────── */}
      <section className="engagement-reviews-section">
        <div className="container">
          <div className="reviews-header text-center">
            <span className="section-sub-tag">— HAPPY CUSTOMERS —</span>
            <h2 className="section-main-heading">
              What Couples Say <span className="highlight-pink">About Us</span>
            </h2>
            <p className="section-subtitle">
              Real stories from customers who made their engagement special with Fine Gift Studio.
            </p>
          </div>

          <div className="reviews-carousel-wrap">
            <button
              type="button"
              className="review-arrow-btn prev"
              onClick={() => setActiveReviewIdx((prev) => (prev > 0 ? prev - 1 : REVIEWS.length - 1))}
              aria-label="Previous review"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="reviews-cards-row">
              {REVIEWS.map((rev, idx) => (
                <div
                  key={rev.id}
                  className={`review-card ${idx === activeReviewIdx ? 'highlighted' : ''}`}
                >
                  <div className="review-top-row">
                    <div className="review-stars">
                      {[...Array(rev.rating)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </div>
                    <i className="fa-regular fa-heart review-like-icon"></i>
                  </div>

                  <h3 className="review-title">{rev.title}</h3>
                  <p className="review-comment">"{rev.comment}"</p>

                  <div className="reviewer-profile">
                    <img src={rev.avatar} alt={rev.name} className="reviewer-avatar" />
                    <div>
                      <div className="reviewer-name">{rev.name}</div>
                      <div className="reviewer-city">{rev.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="review-arrow-btn next"
              onClick={() => setActiveReviewIdx((prev) => (prev < REVIEWS.length - 1 ? prev + 1 : 0))}
              aria-label="Next review"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div className="review-dots-row">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`review-dot ${i === activeReviewIdx ? 'active' : ''}`}
                onClick={() => setActiveReviewIdx(i)}
                aria-label={`Slide ${i + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. NEWSLETTER CALLOUT BOX
          ───────────────────────────────────────────────────────────── */}
      <section className="engagement-newsletter-strip">
        <div className="container">
          <div className="newsletter-banner-box">
            <div className="newsletter-box-left">
              <div className="newsletter-gift-icon-wrap">
                <i className="fa-solid fa-gift"></i>
              </div>
              <div>
                <span className="newsletter-tagline">AS PART OF SPECIAL MOMENTS</span>
                <h3 className="newsletter-headline">
                  Get Exclusive Offers <span className="highlight-dark">&amp; Gift Ideas</span>
                </h3>
                <p className="newsletter-subline">Subscribe to get latest collections, offers and inspirations.</p>
              </div>
            </div>

            <div className="newsletter-box-right">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to Engagement Gift updates!');
                }}
                className="newsletter-signup-form"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-submit-btn">
                  <span>Subscribe</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
