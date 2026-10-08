import React from 'react';

export default function WhyChooseSection({ onNavigate = () => {} }) {
  const features = [
    {
      id: 1,
      icon: 'fa-solid fa-wand-magic-sparkles',
      title: 'Unique Custom Designs',
      subtitle: 'Made just for you'
    },
    {
      id: 2,
      icon: 'fa-solid fa-shield-halved',
      title: 'High Quality Materials',
      subtitle: 'Long-lasting & premium'
    },
    {
      id: 3,
      icon: 'fa-solid fa-gift',
      title: 'Wide Range of Products',
      subtitle: 'Gifts for every occasion'
    },
    {
      id: 4,
      icon: 'fa-solid fa-truck-fast',
      title: 'Fast & Reliable Delivery',
      subtitle: 'Safe and on time'
    },
    {
      id: 5,
      icon: 'fa-solid fa-user-group',
      title: 'Bulk & Corporate Orders',
      subtitle: 'Special pricing available'
    }
  ];

  return (
    <section className="why-choose-corporate-section">
      {/* Background Ambient Glows */}
      <div className="why-bg-glow glow-left"></div>
      <div className="why-bg-glow glow-right"></div>

      <div className="container">
        {/* ==================================================== */}
        {/* 1. WHY CHOOSE FINE GIFT STUDIO HEADER & 5 CARDS      */}
        {/* ==================================================== */}
        <div className="why-choose-header">
          {/* Floating 3D Gift Box on top left */}
          <div className="why-floating-gift-box">
            <span className="why-gift-ribbon-v"></span>
            <span className="why-gift-ribbon-h"></span>
            <div className="why-gift-bow"></div>
            <div className="why-gift-bauble"></div>
          </div>

          {/* Floating Heart Thread on top right */}
          <div className="why-floating-heart-thread">
            <svg viewBox="0 0 100 80" fill="none" className="heart-thread-svg">
              <path
                d="M10,70 Q40,10 70,40 T90,20"
                stroke="#f472b6"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path
                d="M60,25 C60,20 65,15 72,15 C80,15 85,22 85,30 C85,42 60,55 60,55 C60,55 35,42 35,30 C35,22 40,15 48,15 C55,15 60,20 60,25 Z"
                fill="none"
                stroke="#ec4899"
                strokeWidth="1.5"
                transform="translate(15, -10) scale(0.6)"
              />
            </svg>
          </div>

          <span className="why-pill-tag">WHY CHOOSE</span>
          <h2 className="why-main-heading">
            Fine <span>Gift Studio?</span>
          </h2>
          <p className="why-sub-desc">
            We create personalised gifts that bring smiles, memories and emotions closer to your heart.
          </p>
        </div>

        {/* 5 Feature Cards Grid */}
        <div className="why-features-grid">
          {features.map((feat) => (
            <div key={feat.id} className="why-feature-card">
              <div className="why-icon-badge">
                <i className={feat.icon}></i>
                <span className="badge-sparkle-dot dot-1"></span>
                <span className="badge-sparkle-dot dot-2"></span>
              </div>
              <h3 className="why-card-title">{feat.title}</h3>
              <p className="why-card-sub">{feat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* ==================================================== */}
        {/* 2. CORPORATE & BULK GIFTS PANORAMIC BANNER           */}
        {/* ==================================================== */}
        <div className="corporate-bulk-banner">
          {/* Left Text & Actions */}
          <div className="corporate-content-left">
            <span className="corporate-tag">FOR BUSINESSES &amp; EVENTS</span>
            <h3 className="corporate-main-title">
              Corporate &amp; <span>Bulk Gifts</span>
            </h3>
            <p className="corporate-desc">
              Custom gifts for your business, team and special events.
            </p>

            <button
              type="button"
              className="corporate-quote-btn"
              onClick={() => onNavigate('/contact?type=corporate')}
            >
              Get a Bulk Quote <i className="fa-solid fa-arrow-right"></i>
            </button>

            {/* 4 Micro Feature Badges */}
            <div className="corporate-micro-badges">
              <div className="corp-micro-item">
                <div className="corp-micro-icon">
                  <i className="fa-solid fa-building"></i>
                </div>
                <span>Company Logo<br />Printing</span>
              </div>

              <div className="corp-micro-divider"></div>

              <div className="corp-micro-item">
                <div className="corp-micro-icon">
                  <i className="fa-solid fa-percent"></i>
                </div>
                <span>Bulk<br />Discount</span>
              </div>

              <div className="corp-micro-divider"></div>

              <div className="corp-micro-item">
                <div className="corp-micro-icon">
                  <i className="fa-solid fa-box-open"></i>
                </div>
                <span>Custom<br />Packaging</span>
              </div>

              <div className="corp-micro-divider"></div>

              <div className="corp-micro-item">
                <div className="corp-micro-icon">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <span>Pan India<br />Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Image */}
          <div className="corporate-showcase-right">
            <div className="corporate-image-wrapper">
              <img
                src="assets/images/Corporate.avif"
                alt="Corporate & Bulk Gifts"
                className="corporate-main-img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/images/Corporate.avif";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
