import React, { useRef } from 'react';
import artDesignImg from '../../assets/images/art-design.avif';
import tshirtMockupImg from '../../assets/images/mockup.avif';
import cupsProductImg from '../../assets/images/cups-product.avif';

export default function PromoBanners({ onNavigate = () => {} }) {
  const scrollRef = useRef(null);

  const handleScroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="promo-banners-section">
      <div className="container promo-banners-container">
        {/* Navigation arrows for smooth row scrolling */}
        <div className="promo-scroll-controls">
          <button
            type="button"
            className="promo-nav-btn prev-btn"
            onClick={() => handleScroll(-460)}
            aria-label="Previous promo"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button
            type="button"
            className="promo-nav-btn next-btn"
            onClick={() => handleScroll(460)}
            aria-label="Next promo"
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {/* 1 Row Scrollable Track */}
        <div className="promo-banners-scroll-track" ref={scrollRef}>
          {/* Banner 1: Free Expert Art Design */}
          <div className="promo-premium-card card-pink">
            <div className="promo-card-bg-blob"></div>

            <div className="promo-card-content">
              <div className="promo-badge-tag tag-pink">
                <span className="badge-icon">
                  <i className="fa-solid fa-pen-nib"></i>
                </span>
                <span>FREE DESIGN SERVICE</span>
              </div>

              <h2 className="promo-card-title">
                Free Expert <br />
                <span className="highlight-magenta">Art</span> Design
              </h2>

              <p className="promo-card-desc">
                Our professional designers will create perfect artwork for your personalised gifts – completely free.
              </p>

              <a
                href="#shop"
                className="promo-pill-btn"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/shop?promo=free-design');
                }}
              >
                Shop Now <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>

            <div className="promo-card-mockup-area mockup-pink-area">
              <div className="promo-floating-icon-tag tag-magenta-glow">
                <i className="fa-regular fa-image"></i>
              </div>

              <div className="art-design-mockup">
                <div className="art-design-img-frame">
                  <img
                    src={artDesignImg}
                    alt="Free Expert Art Design"
                    className="art-design-main-img"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banner 2: Create Custom T-Shirts */}
          <div className="promo-premium-card card-blue">
            <div className="promo-card-bg-circle"></div>

            <div className="promo-card-content">
              <div className="promo-badge-tag tag-blue">
                <span className="badge-icon">
                  <i className="fa-solid fa-shirt"></i>
                </span>
                <span>CUSTOM T-SHIRTS</span>
              </div>

              <h2 className="promo-card-title">
                Create Custom <br />
                <span className="highlight-magenta">T-Shirts</span>
              </h2>

              <p className="promo-card-desc">
                Design your own high quality T-shirt in minutes. Perfect for personal use, gifts or business.
              </p>

              <a
                href="#shop"
                className="promo-pill-btn"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/shop?promo=custom-tshirts');
                }}
              >
                Shop Now <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>

            <div className="promo-card-mockup-area mockup-blue-area">
              <div className="promo-floating-icon-tag tag-purple-glow">
                <i className="fa-solid fa-shirt"></i>
              </div>

              <div className="art-design-mockup">
                <div className="art-design-img-frame">
                  <img
                    src={tshirtMockupImg}
                    alt="Create Custom T-Shirts"
                    className="art-design-main-img"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banner 3: Personalised Mugs & Drinkware */}
          <div className="promo-premium-card card-amber">
            <div className="promo-card-bg-blob"></div>

            <div className="promo-card-content">
              <div className="promo-badge-tag tag-amber">
                <span className="badge-icon">
                  <i className="fa-solid fa-mug-hot"></i>
                </span>
                <span>MUGS &amp; DRINKWARE</span>
              </div>

              <h2 className="promo-card-title">
                Personalised <br />
                <span className="highlight-magenta">Mugs</span> &amp; Gifts
              </h2>

              <p className="promo-card-desc">
                High quality custom ceramic mugs, insulated bottles and photo drinkware for everyday joy.
              </p>

              <a
                href="#shop"
                className="promo-pill-btn"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/shop?cat=mugs');
                }}
              >
                Shop Now <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>

            <div className="promo-card-mockup-area mockup-amber-area">
              <div className="promo-floating-icon-tag tag-amber-glow">
                <i className="fa-solid fa-mug-hot"></i>
              </div>

              <div className="art-design-mockup">
                <div className="art-design-img-frame">
                  <img
                    src={cupsProductImg}
                    alt="Personalised Mugs and Drinkware"
                    className="art-design-main-img"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
