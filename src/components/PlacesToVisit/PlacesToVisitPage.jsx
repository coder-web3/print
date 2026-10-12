import React, { useState, useMemo } from 'react';
import './PlacesToVisitPage.css';
import { PLACES_CATEGORIES, PLACES_LIST, MANGALORE_TRAVEL_TIPS } from '../../data/placesData';

export default function PlacesToVisitPage({ onNavigate = () => {} }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaceDetail, setSelectedPlaceDetail] = useState(null);

  // Filtered places dataset
  const filteredPlaces = useMemo(() => {
    return PLACES_LIST.filter((place) => {
      // Category filter
      if (activeCategory !== 'all' && place.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          place.name.toLowerCase().includes(q) ||
          place.subtitle.toLowerCase().includes(q) ||
          place.description.toLowerCase().includes(q) ||
          place.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Smooth scroll to explore grid
  const scrollToExplore = () => {
    const section = document.getElementById('explore-places-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="places-page-wrapper">
      {/* ══════════════════════════════════════════════════════════════════
          1. EXACT HERO SECTION (MATCHING REFERENCE IMAGE)
          ══════════════════════════════════════════════════════════════════ */}
      <section className="places-hero-outer">
        <div className="places-hero-card">
          {/* Background Scenic Landscape (Right base) */}
          <div className="places-hero-bg-scenic"></div>

          {/* Topographic & Dark Navy Left Angled Overlay */}
          <div className="places-hero-navy-overlay">
            <div className="places-hero-topo-texture"></div>
          </div>

          {/* Sharp Angled Orange Accent Divider */}
          <div className="places-hero-orange-slash"></div>

          {/* Content Flex Container */}
          <div className="places-hero-container">
            {/* Left Content Area */}
            <div className="places-hero-left">
              {/* Breadcrumbs */}
              <div className="places-hero-breadcrumb">
                <i className="fa-solid fa-location-dot"></i>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('home');
                  }}
                >
                  Home
                </a>
                <span>&gt;</span>
                <span className="active-crumb">Places to Visit</span>
              </div>

              {/* Tag with Orange Bar */}
              <div className="places-hero-tag">
                <span>DISCOVER THE BEST</span>
                <span className="places-hero-tag-bar"></span>
              </div>

              {/* Main Headline */}
              <h1 className="places-hero-title">
                Tourist Places in
                <span className="title-accent">Mangalore</span>
              </h1>

              {/* Description */}
              <p className="places-hero-desc">
                Explore the best tourist attractions in Mangalore — beaches, temples, rivers, hills,
                heritage sites and more. Discover the beauty, culture and history of this coastal city.
              </p>

              {/* Explore CTA Button */}
              <button
                type="button"
                className="places-hero-cta"
                onClick={scrollToExplore}
              >
                <span>Explore Places</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            {/* Right Visual Area: Calligraphy + Stacked Polaroids */}
            <div className="places-hero-right">
              {/* "Explore Mangalore" Handwritten Calligraphy */}
              <div className="places-callout-script">
                <span className="places-script-text">Explore Mangalore</span>
                <div className="places-script-swoosh"></div>
              </div>

              {/* 3 Overlapping Polaroid Photo Cards */}
              <div className="places-polaroid-stack">
                {/* Polaroid 1: Beach */}
                <div
                  className="polaroid-card card-top"
                  onClick={() => setActiveCategory('beaches')}
                  title="Panambur & Tannirbhavi Beach"
                >
                  <img
                    src="/assets/images/mangalore-beach-polaroid.jpg"
                    alt="Mangalore Golden Beach & Palms"
                  />
                  <span className="polaroid-caption">Panambur Beach</span>
                </div>

                {/* Polaroid 2: Temple */}
                <div
                  className="polaroid-card card-mid"
                  onClick={() => setActiveCategory('temples')}
                  title="Kudroli Gokarnanatheshwara Temple"
                >
                  <img
                    src="/assets/images/mangalore-temple-polaroid.jpg"
                    alt="Ancient Mangalore Temple Gopuram"
                  />
                  <span className="polaroid-caption">Kudroli Temple</span>
                </div>

                {/* Polaroid 3: Backwaters Boat */}
                <div
                  className="polaroid-card card-bot"
                  onClick={() => setActiveCategory('rivers')}
                  title="Gurupura River Cruise"
                >
                  <img
                    src="/assets/images/mangalore-boating-polaroid.jpg"
                    alt="Mangalore Backwaters Boating"
                  />
                  <span className="polaroid-caption">River Cruise</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            2. FLOATING BOTTOM CATEGORY DOCK (OVERLAPPING WHITE BAR)
            ══════════════════════════════════════════════════════════════ */}
        <div className="places-floating-dock-wrap">
          <div className="places-floating-dock">
            {PLACES_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`dock-category-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    scrollToExplore();
                  }}
                >
                  <i className={cat.icon}></i>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. MAIN CONTENT: EXPLORE PLACES CATALOG & FILTER BAR
          ══════════════════════════════════════════════════════════════════ */}
      <section id="explore-places-section" className="places-content-section">
        <div className="places-content-container">
          {/* Filter Bar with Search and Results Count */}
          <div className="places-filter-bar">
            <div className="places-filter-summary">
              <h2>
                {activeCategory === 'all'
                  ? 'All Attractions & Landmarks'
                  : PLACES_CATEGORIES.find((c) => c.id === activeCategory)?.label || 'Places'}
              </h2>
              <p>
                Showing {filteredPlaces.length} curated tourist destinations in &amp; around Mangalore
              </p>
            </div>

            {/* Live Search Box */}
            <div className="places-search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search beach, temple, cruise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tourist Places Cards Grid */}
          {filteredPlaces.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '16px' }}>
              <i className="fa-solid fa-map-location-dot" style={{ fontSize: '42px', color: '#cbd5e1', marginBottom: '14px' }}></i>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>No Tourist Spots Found</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Try searching another keyword or choose another category filter.</p>
              <button
                type="button"
                className="places-gift-btn"
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                style={{ marginTop: '12px' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="places-cards-grid">
              {filteredPlaces.map((place) => (
                <article key={place.id} className="place-card">
                  {/* Image Thumb Wrap */}
                  <div className="place-card-thumb-wrap">
                    <img src={place.image} alt={place.name} className="place-card-img" />
                    <span className="place-badge-category">{place.categoryLabel}</span>
                    <span className="place-badge-rating">
                      <i className="fa-solid fa-star"></i> {place.rating}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="place-card-body">
                    <div className="place-card-distance">
                      <i className="fa-solid fa-location-arrow"></i>
                      <span>{place.distance}</span>
                    </div>

                    <h3 className="place-card-title">{place.name}</h3>
                    <p className="place-card-desc">{place.description}</p>

                    {/* Quick Tags Chips */}
                    <div className="place-card-chips">
                      {place.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="place-chip">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Fine Gift Studio Souvenir Recommendation Banner */}
                    <div className="place-card-souvenir-bar">
                      <i className="fa-solid fa-gift"></i>
                      <span>
                        <strong>Travel Memory Gift:</strong> {place.souvenirTip}
                      </span>
                    </div>

                    {/* Card Footer */}
                    <div className="place-card-footer">
                      <span className="place-card-timing">
                        <i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i>
                        {place.entryFee}
                      </span>

                      <button
                        type="button"
                        className="place-gift-btn"
                        onClick={() => {
                          onNavigate('shop');
                        }}
                      >
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        <span>Order Keepsake</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              4. CUSTOM TRAVEL SOUVENIR PROMOTION STRIP
              ══════════════════════════════════════════════════════════════ */}
          <div className="places-souvenir-strip">
            <div className="places-souvenir-text">
              <h3>
                Captured Memorable Photos in <span>Mangalore</span>?
              </h3>
              <p>
                Turn your family vacation moments at Kaup Lighthouse, Panambur Beach, and historic temples
                into custom laser-engraved wooden frames, acrylic desk blocks, or travel mugs with Fine Gift Studio!
              </p>
            </div>
            <div className="places-souvenir-action">
              <a
                href="#shop"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('shop');
                }}
              >
                <i className="fa-solid fa-camera-retro"></i>
                <span>Personalize Your Travel Gifts</span>
              </a>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              5. MANGALORE TRAVEL TIPS & FAQ ACCORDION
              ══════════════════════════════════════════════════════════════ */}
          <div style={{ marginTop: '70px', background: '#ffffff', borderRadius: '18px', padding: '36px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Frequently Asked Questions About Visiting Mangalore
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              Helpful insider tips for travelers, tourists, and locals exploring coastal Karnataka.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {MANGALORE_TRAVEL_TIPS.map((tip, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                    <i className="fa-solid fa-circle-question" style={{ color: '#ff5212', marginRight: '8px' }}></i>
                    {tip.q}
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    {tip.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
