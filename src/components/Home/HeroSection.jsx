import React, { useState } from 'react';
import logoImg from '../../assets/Gift-Studio-Logo.webp';
import tshirtMockImg from '../../assets/images/tshirt-mock.avif';
import packagingMockImg from '../../assets/images/packaging.avif';
import cupsMockImg from '../../assets/images/cups.avif';

export default function HeroSection({ onNavigate = () => {} }) {
  const [activePanel, setActivePanel] = useState(0);

  const heroSlides = [
    {
      id: 'hero1',
      subtitle: 'PERSONALISED GIFTS',
      titleMain: 'Make Every',
      titleHighlight: 'Moment Special',
      description: 'Custom gifts for your loved ones – made with creativity, care and a personal touch.',
      ctaText: 'Shop Custom Gifts',
      ctaLink: '/shop?cat=tshirts',
      badgeTag: 'T-SHIRTS DESIGN',
      badgeIcon: 'fa-solid fa-shirt',
      count: '12K+',
      countLabel: 'TEMPLATE',
      image: '/assets/images/hero1.avif',
      tagClass: 'tag-dark',
    },
    {
      id: 'hero2',
      subtitle: 'CUSTOM PACKAGING & GIFT BOXES',
      titleMain: 'Luxury Custom',
      titleHighlight: 'Packaging Boxes',
      description: 'Premium branded boxes, rigid gift packaging and bespoke presentation crafted for every special delivery.',
      ctaText: 'Explore Packaging',
      ctaLink: '/shop?cat=packaging',
      badgeTag: 'PACKAGING BOX',
      badgeIcon: 'fa-solid fa-box-open',
      count: '18K+',
      countLabel: 'TEMPLATE',
      image: '/assets/images/hero2.avif',
      tagClass: 'tag-gray',
    },
    {
      id: 'hero3',
      subtitle: 'PHOTO MUGS & DRINKWARE',
      titleMain: 'Personalised',
      titleHighlight: 'Cups & Mug Designs',
      description: 'Ceramic photo mugs, insulated tumblers and magic drinkware to bring everyday warmth with every sip.',
      ctaText: 'Shop Mugs & Bottles',
      ctaLink: '/shop?cat=mugs',
      badgeTag: 'CUPS & MUG DESIGN',
      badgeIcon: 'fa-solid fa-mug-hot',
      count: '10K+',
      countLabel: 'TEMPLATE',
      image: '/assets/images/hero3.avif',
      tagClass: 'tag-magenta',
    },
  ];

  const currentSlide = heroSlides[activePanel] || heroSlides[0];

  const handlePanelClick = (index, e) => {
    e.stopPropagation();
    if (activePanel === index) {
      // If already active, clicking navigates to the shop category
      onNavigate(heroSlides[index].ctaLink);
    } else {
      // If not active, clicking switches to this panel
      setActivePanel(index);
    }
  };

  return (
    <section className="hero-section">
      {/* Ambient background decoration shapes */}
      <div className="hero-ambient-glow"></div>
      <div className="hero-ribbon-curve hero-ribbon-1"></div>
      <div className="hero-ribbon-curve hero-ribbon-2"></div>

      <div className="container hero-container">
        {/* Left Column: Brand, Dynamic Typography, Dynamic CTA, Badges */}
        <div className="hero-content">
          <div className="hero-brand-header">
            <img
              src={logoImg}
              alt="Fine Gift Studio Logo"
              className="hero-brand-logo"
            />
          </div>

          <div key={activePanel} className="hero-content-inner">
            <span className="hero-subtitle">{currentSlide.subtitle}</span>

            <h1 className="hero-main-title">
              {currentSlide.titleMain} <br />
              <span className="highlight-text">{currentSlide.titleHighlight}</span>
            </h1>

            <p className="hero-description">{currentSlide.description}</p>

            <div className="hero-cta-wrapper">
              <a
                href="#shop"
                className="hero-pill-btn"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(currentSlide.ctaLink);
                }}
              >
                {currentSlide.ctaText} <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div className="hero-trust-badges">
            <div className="trust-badge-item">
              <i className="fa-solid fa-pen-nib"></i>
              <span>Custom Design</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-badge-item">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Premium Quality</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-badge-item">
              <i className="fa-solid fa-truck-fast"></i>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Showcase & Interactive Accordion */}
        <div className="hero-showcase-wrapper">
          <div className="hero-accordion-card">
            {heroSlides.map((slide, idx) => {
              const isActive = activePanel === idx;
              return (
                <div
                  key={slide.id}
                  className={`acc-panel acc-panel-${idx + 1} ${isActive ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                  onMouseEnter={() => setActivePanel(idx)}
                  onClick={(e) => handlePanelClick(idx, e)}
                  title={`View ${slide.badgeTag}`}
                >
                  <div className="panel-overlay"></div>
                  {isActive ? (
                    <>
                      <div className="panel-pill-badge active-tag">
                        <i className={slide.badgeIcon}></i>
                        <span>{slide.badgeTag}</span>
                      </div>
                      <div className="panel-count-badge">
                        <strong>{slide.count}</strong>
                        <span>{slide.countLabel}</span>
                      </div>
                    </>
                  ) : (
                    <div className={`panel-pill-vertical ${slide.tagClass}`}>
                      <span>{slide.badgeTag}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3D Cylindrical Podium Stand */}
          <div className="hero-podium-stand"></div>
        </div>
      </div>
    </section>
  );
}
