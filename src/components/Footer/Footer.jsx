import React, { useState } from 'react';
import './Footer.css';
import logoImg from '../../assets/Gift-Studio-Logo.webp';
import footerCtaImg from '../../assets/images/footer-cta-img.avif';

export default function Footer({ onSubscribe = () => {}, onNavigate = () => {} }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe(email);
      setEmail('');
    }
  };

  const handleLink = (e, path) => {
    e.preventDefault();
    if (onNavigate) onNavigate(path);
  };

  const instagramPosts = [
    {
      id: 1,
      name: 'LED Heart Photo Lamp',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80',
      link: 'https://instagram.com'
    },
    {
      id: 2,
      name: 'Custom Photo Mug',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=300&q=80',
      link: 'https://instagram.com'
    },
    {
      id: 3,
      name: 'Monogram Leather Keychain',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=300&q=80',
      link: 'https://instagram.com'
    },
    {
      id: 4,
      name: 'Wooden Couple Frame',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=300&q=80',
      link: 'https://instagram.com'
    },
    {
      id: 5,
      name: 'Custom Water Bottle',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=300&q=80',
      link: 'https://instagram.com'
    },
    {
      id: 6,
      name: 'Good Vibes T-Shirt',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80',
      link: 'https://instagram.com'
    }
  ];

  return (
    <footer className="footer-ultra-premium">
      <div className="container">
        {/* ==================================================== */}
        {/* 1. TOP URGENT / EXPRESS DELIVERY STRIP               */}
        {/* ==================================================== */}
        <section className="footer-express-banner">
          <div className="express-banner-left">
            {/* 3D Alarm Clock & Gift Box */}
            <div className="express-3d-visual">
              <div className="express-gift-box">
                <span className="express-ribbon-v"></span>
                <span className="express-ribbon-h"></span>
                <div className="express-bow"></div>
              </div>
              <div className="express-clock-box">
                <div className="clock-bell bell-left"></div>
                <div className="clock-bell bell-right"></div>
                <div className="clock-face">
                  <span className="clock-hand hand-h"></span>
                  <span className="clock-hand hand-m"></span>
                  <span className="clock-dot"></span>
                </div>
              </div>
            </div>

            {/* Banner Text */}
            <div className="express-banner-text">
              <span className="express-tag">NEED IT URGENTLY?</span>
              <h3 className="express-title">
                We Also Offer <span>Express Delivery</span>
              </h3>
              <p className="express-desc">
                For special occasions and last minute gifts.
              </p>
            </div>
          </div>

          {/* Center Trust Badges */}
          <div className="express-trust-features">
            <div className="express-feature-item">
              <div className="express-feat-icon">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <div className="express-feat-info">
                <h4>Fast &amp; Reliable</h4>
                <span>Get it on time</span>
              </div>
            </div>

            <div className="express-feat-divider"></div>

            <div className="express-feature-item">
              <div className="express-feat-icon">
                <i className="fa-solid fa-gift"></i>
              </div>
              <div className="express-feat-info">
                <h4>Perfect for</h4>
                <span>Special Occasions</span>
              </div>
            </div>

            <div className="express-feat-divider"></div>

            <div className="express-feature-item">
              <div className="express-feat-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div className="express-feat-info">
                <h4>Safe &amp; Secure</h4>
                <span>Delivery</span>
              </div>
            </div>
          </div>

          {/* Right CTA Button */}
          <div className="express-banner-action">
            <button
              type="button"
              className="express-contact-btn"
              onClick={(e) => handleLink(e, '/contact')}
            >
              Contact Us Now <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 2. MIDDLE SECTION: INSTAGRAM & STAY UPDATED          */}
        {/* ==================================================== */}
        <section className="footer-middle-row">
          {/* Left: Instagram Grid Card */}
          <div className="footer-insta-card">
            <div className="insta-header-col">
              <span className="insta-top-tag">FOLLOW US ON</span>
              <h3 className="insta-main-title">
                <i className="fa-brands fa-instagram"></i> Instagram
              </h3>
              <p className="insta-sub-desc">
                Get inspired with our latest gifts, custom designs and happy moments.
              </p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="insta-handle-pill"
              >
                @finegiftstudio <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>

            <div className="insta-photos-grid">
              {instagramPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noreferrer"
                  className="insta-photo-item"
                  title={post.name}
                >
                  <img src={post.image} alt={post.name} loading="lazy" />
                  <span className="insta-mini-badge">
                    <i className="fa-brands fa-instagram"></i>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Stay Updated Newsletter Card */}
          <div className="footer-newsletter-box">
            {/* Paper Airplane Decorative Graphic */}
            <div className="newsletter-plane-decor">
              <svg className="plane-dashed-svg" viewBox="0 0 100 40" fill="none">
                <path
                  d="M0,35 Q45,-10 90,15"
                  stroke="#f472b6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
              <div className="plane-icon-box">
                <i className="fa-solid fa-paper-plane"></i>
              </div>
            </div>

            <div className="newsletter-card-header">
              <div className="newsletter-gift-icon">
                <i className="fa-solid fa-gift"></i>
              </div>
              <div className="newsletter-header-text">
                <h3 className="newsletter-card-title">Stay Updated</h3>
                <p className="newsletter-card-sub">
                  Subscribe to get latest offers, new products and gift ideas.
                </p>
              </div>
            </div>

            <form className="newsletter-card-form" onSubmit={handleSubmit}>
              <div className="newsletter-input-wrapper">
                <i className="fa-regular fa-envelope newsletter-mail-icon"></i>
                <input
                  type="email"
                  placeholder="Your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Your email address"
                />
              </div>
              <button type="submit" className="newsletter-submit-btn">
                Subscribe <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 3. MAIN FOOTER LINKS & CONTACT COLUMNS               */}
        {/* ==================================================== */}
        <section className="footer-main-columns">
          {/* Col 1: Brand details */}
          <div className="footer-nav-col brand-info-col">
            <div className="footer-brand-logo-wrap">
              <img
                src={logoImg}
                alt="Fine Gift Studio"
                className="footer-brand-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fb = e.target.parentNode.querySelector('.footer-brand-fallback');
                  if (fb) fb.style.display = 'block';
                }}
              />
              <div className="footer-brand-fallback" style={{ display: 'none' }}>
                <span className="brand-pink">FINE GIFT</span> STUDIO
                <small>PERSONALISED GIFTS FOR EVERY MOMENT</small>
              </div>
            </div>

            <p className="brand-bio-text">
              Your one-stop destination for customised gifts. We turn{' '}
              <span className="pink-text-accent">your</span> ideas into meaningful and
              memorable products.
            </p>

            <div className="footer-social-pill-row">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">
                <i className="fa-brands fa-pinterest-p"></i>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-nav-col">
            <h4 className="footer-col-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#home" onClick={(e) => handleLink(e, '/')}>
                  Home <i className="fa-solid fa-chevron-right"></i>
                </a>
              </li>
              <li>
                <a href="#shop" onClick={(e) => handleLink(e, '/shop')}>
                  Shop <i className="fa-solid fa-chevron-right"></i>
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleLink(e, '/about-us')}>
                  About Us <i className="fa-solid fa-chevron-right"></i>
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleLink(e, '/services')}>
                  Our Services <i className="fa-solid fa-chevron-right"></i>
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleLink(e, '/contact')}>
                  Contact Us <i className="fa-solid fa-chevron-right"></i>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div className="footer-nav-col">
            <h4 className="footer-col-heading">Customer Support</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#track" onClick={(e) => handleLink(e, '/track-order')}>
                  Track Order <i className="fa-solid fa-chevron-right"></i>
                </a>
              </li>
              <li>
                <a href="#shipping" onClick={(e) => handleLink(e, '/shipping')}>
                  Shipping Policy <i className="fa-solid fa-chevron-right"></i>
                </a>
              </li>
              <li>
                <a href="#returns" onClick={(e) => handleLink(e, '/returns')}>
                  Return &amp; Refund <i className="fa-solid fa-chevron-right"></i>
                </a>
              </li>
              <li>
                <a href="#faqs" onClick={(e) => handleLink(e, '/faqs')}>
                  FAQs <i className="fa-solid fa-chevron-right"></i>
                </a>
              </li>
              <li>
                <a href="#help" onClick={(e) => handleLink(e, '/help')}>
                  Help Center <i className="fa-solid fa-chevron-right"></i>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="footer-nav-col contact-info-col">
            <h4 className="footer-col-heading">Contact Information</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="contact-icon-wrap">
                  <i className="fa-solid fa-location-dot footer-contact-ico"></i>
                </span>
                <span className="contact-detail-text">Mangalore, Karnataka, India</span>
              </li>
              <li>
                <span className="contact-icon-wrap">
                  <i className="fa-solid fa-phone footer-contact-ico"></i>
                </span>
                <a href="tel:+919876543210" className="contact-detail-text">+91 98765 43210</a>
              </li>
              <li>
                <span className="contact-icon-wrap">
                  <i className="fa-solid fa-envelope footer-contact-ico"></i>
                </span>
                <a href="mailto:info@finegiftstudio.com" className="contact-detail-text">info@finegiftstudio.com</a>
              </li>
              <li>
                <span className="contact-icon-wrap">
                  <i className="fa-regular fa-clock footer-contact-ico"></i>
                </span>
                <span className="contact-detail-text">Mon - Sat: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Visual Showcase on Far Right */}
          <div className="footer-right-decor">
            <img
              src={footerCtaImg}
              alt="Gifts Make Moments Special"
              className="footer-cta-showcase-img"
              loading="lazy"
            />
          </div>
        </section>

        {/* ==================================================== */}
        {/* 4. BOTTOM COPYRIGHT & LEGAL BAR                      */}
        {/* ==================================================== */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            &copy; 2026 Fine Gift Studio. All rights reserved.
          </p>

          <div className="footer-legal-links">
            <a href="#privacy" onClick={(e) => handleLink(e, '/privacy-policy')}>
              Privacy Policy
            </a>
            <span className="legal-pipe">|</span>
            <a href="#terms" onClick={(e) => handleLink(e, '/terms')}>
              Terms &amp; Conditions
            </a>
            <span className="legal-pipe">|</span>
            <a href="#sitemap" onClick={(e) => handleLink(e, '/sitemap')}>
              Sitemap
            </a>
          </div>

          <div className="footer-made-with-love">
            <span className="heart-circle">💖</span>
            <span>Made with <i className="fa-solid fa-heart footer-heart-icon"></i> for Special Moments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
