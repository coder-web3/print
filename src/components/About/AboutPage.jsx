import React from 'react';
import './AboutPage.css';
import aboutHeroImg from '../../assets/about/hero.avif';
import packagingImg from '../../assets/images/packaging.avif';
import artDesignImg from '../../assets/images/art-design.avif';
import cupsProductImg from '../../assets/images/cups-product.avif';

export default function AboutPage({
  onNavigate = () => {},
  onSearch = () => {}
}) {
  const scrollToStory = (e) => {
    e.preventDefault();
    const storyEl = document.getElementById('about-our-story');
    if (storyEl) {
      storyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="about-page-wrapper">
      {/* ─────────────────────────────────────────────────────────────
          1. BREADCRUMB STRIP
          ───────────────────────────────────────────────────────────── */}
      <nav className="about-breadcrumb-strip" aria-label="Breadcrumb">
        <div className="container about-breadcrumb-inner">
          <a
            href="#home"
            className="about-breadcrumb-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
          >
            <i className="fa-solid fa-house"></i> Home
          </a>
          <span className="about-breadcrumb-sep">/</span>
          <span className="about-breadcrumb-current">About Us</span>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION — WITH HERO.AVIF BACKGROUND
          ───────────────────────────────────────────────────────────── */}
      <section className="about-hero-section" aria-label="About Fine Gift Studio Hero">
        <div className="about-hero-container">
          <div className="about-hero-card">
            {/* Background Image Layer from public/about/hero.avif */}
            <div className="about-hero-bg-layer">
              <img
                src={aboutHeroImg || '/about/hero.avif'}
                alt="Fine Gift Studio - Luxury Wrapped Gifts and Ribbons"
                className="about-hero-bg-img"
                loading="eager"
              />
              <div className="about-hero-overlay-tint"></div>
            </div>

            {/* Overlaid Live Typography & CTA Content */}
            <div className="about-hero-content-layer">
              <div className="about-hero-text-block">
                <div className="about-hero-eyebrow">
                  <span>The Art of Gifting</span>
                </div>

                <h1 className="about-hero-title">
                  Every Gift Tells <span className="about-hero-title-highlight">Your Story.</span>
                </h1>

                <p className="about-hero-subtitle">
                  At Fine Gift Studio, we craft thoughtful, personalized gifts that turn everyday
                  moments into meaningful memories.
                </p>

                <div className="about-hero-cta-row">
                  <button
                    type="button"
                    className="about-hero-cta-btn"
                    onClick={scrollToStory}
                    aria-label="Discover Our Story"
                  >
                    <span>Discover Our Story</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>

                <div className="about-hero-tagline">
                  Made Personal, Made Memorable
                </div>
              </div>
            </div>
          </div>

          {/* Value Props & Highlight Strip */}
          <div className="about-highlights-strip">
            <div className="about-highlight-card">
              <div className="about-highlight-icon-wrap">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div className="about-highlight-text">
                <h4>Custom Personalization</h4>
                <p>Tailored names, photos & unique memories</p>
              </div>
            </div>

            <div className="about-highlight-card">
              <div className="about-highlight-icon-wrap">
                <i className="fa-solid fa-gift"></i>
              </div>
              <div className="about-highlight-text">
                <h4>Luxury Gift Packaging</h4>
                <p>Curated boxes with satin ribbons & cards</p>
              </div>
            </div>

            <div className="about-highlight-card">
              <div className="about-highlight-icon-wrap">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <div className="about-highlight-text">
                <h4>Reliable Pan-India Delivery</h4>
                <p>Safe shipping for birthdays & celebrations</p>
              </div>
            </div>

            <div className="about-highlight-card">
              <div className="about-highlight-icon-wrap">
                <i className="fa-solid fa-heart"></i>
              </div>
              <div className="about-highlight-text">
                <h4>Handcrafted with Love</h4>
                <p>Quality checked in Mangalore, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. OUR STORY SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="about-our-story" className="about-story-section">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-content">
              <span className="about-section-badge">
                <i className="fa-solid fa-sparkles"></i> Our Journey
              </span>
              <h2>
                Crafting Memories That <span>Last a Lifetime</span>
              </h2>
              <p className="about-story-p">
                Fine Gift Studio was founded with a singular conviction: gifting is never just
                about handing over an object. It is a tangible expression of love, respect, gratitude,
                and celebration.
              </p>
              <p className="about-story-p">
                Starting from our artisan studio in <strong>Mangalore, Karnataka</strong>, we set
                out to replace impersonal store-bought items with customized keepsakes — from
                engraved drinkware and customized wooden frames to tailor-made leather accessories
                and curated corporate gift boxes.
              </p>

              <blockquote className="about-story-quote">
                "Every ribbon tied and every message engraved represents someone’s precious bond.
                We treat every order as if it were for our own family."
                <span className="about-story-quote-author">— The Fine Gift Studio Family</span>
              </blockquote>

              <p className="about-story-p">
                Today, our studio blends traditional artisanal finishing with state-of-the-art
                printing and laser engraving technology, ensuring that every gift looks breathtaking
                and endures through the years.
              </p>
            </div>

            <div className="about-story-visual">
              <div className="about-visual-collage">
                <div className="about-collage-card about-collage-primary">
                  <img
                    src={packagingImg}
                    alt="Fine Gift Studio Luxury Packaging"
                    loading="lazy"
                  />
                </div>
                <div className="about-collage-secondary">
                  <div className="about-collage-subcard">
                    <img
                      src={artDesignImg}
                      alt="Artisanal Design Studio"
                      loading="lazy"
                    />
                  </div>
                  <div className="about-collage-subcard">
                    <img
                      src={cupsProductImg}
                      alt="Handcrafted Personalized Mugs"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="about-story-floating-badge">
                <div className="about-badge-icon">
                  <i className="fa-solid fa-award"></i>
                </div>
                <div className="about-badge-text">
                  <strong>Mangalore Roots</strong>
                  <span>Delivering Smiles Pan-India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. STATS BANNER
          ───────────────────────────────────────────────────────────── */}
      <section className="about-stats-section" aria-label="Fine Gift Studio Numbers">
        <div className="container">
          <div className="about-stats-banner">
            <div className="about-stat-item">
              <div className="about-stat-number">50<span>K+</span></div>
              <div className="about-stat-label">Gifts Delivered</div>
              <div className="about-stat-desc">Spreading happiness nationwide</div>
            </div>

            <div className="about-stat-item">
              <div className="about-stat-number">15<span>K+</span></div>
              <div className="about-stat-label">Custom Designs</div>
              <div className="about-stat-desc">Unique photo & name templates</div>
            </div>

            <div className="about-stat-item">
              <div className="about-stat-number">99.4<span>%</span></div>
              <div className="about-stat-label">On-Time Delivery</div>
              <div className="about-stat-desc">Before birthdays & milestones</div>
            </div>

            <div className="about-stat-item">
              <div className="about-stat-number">4.9<span>★</span></div>
              <div className="about-stat-label">Customer Rating</div>
              <div className="about-stat-desc">Over 12,000+ 5-star reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. HOW IT WORKS (The Crafting Experience)
          ───────────────────────────────────────────────────────────── */}
      <section className="about-process-section">
        <div className="container">
          <div className="about-section-header">
            <span className="about-section-badge">
              <i className="fa-solid fa-list-check"></i> Simple Process
            </span>
            <h2>
              How We Turn Ideas into <span>Heirlooms</span>
            </h2>
            <p>
              Creating a one-of-a-kind personalized gift should be exciting and effortless.
              Here is how we bring your imagination to life:
            </p>
          </div>

          <div className="about-steps-grid">
            <div className="about-step-card">
              <span className="about-step-num">01</span>
              <div className="about-step-icon">
                <i className="fa-solid fa-hand-pointer"></i>
              </div>
              <h3>Choose Your Item</h3>
              <p>
                Browse hundreds of mugs, wood photo frames, metal pens, leather goods, and
                luxury gift sets.
              </p>
            </div>

            <div className="about-step-card">
              <span className="about-step-num">02</span>
              <div className="about-step-icon">
                <i className="fa-solid fa-pen-nib"></i>
              </div>
              <h3>Personalize It</h3>
              <p>
                Upload your favourite photos, enter recipient names, or request a customized
                monogram and message.
              </p>
            </div>

            <div className="about-step-card">
              <span className="about-step-num">03</span>
              <div className="about-step-icon">
                <i className="fa-solid fa-compass-drafting"></i>
              </div>
              <h3>Artisan Precision</h3>
              <p>
                Our Mangalore studio prints, engraves, checks quality, and hand-wraps your
                gift with satin ribbon.
              </p>
            </div>

            <div className="about-step-card">
              <span className="about-step-num">04</span>
              <div className="about-step-icon">
                <i className="fa-solid fa-box-open"></i>
              </div>
              <h3>Delivered with Joy</h3>
              <p>
                Securely packaged and dispatched with real-time tracking straight to your loved
                one's doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CORE VALUES
          ───────────────────────────────────────────────────────────── */}
      <section className="about-values-section">
        <div className="container">
          <div className="about-section-header">
            <span className="about-section-badge">
              <i className="fa-solid fa-shield-heart"></i> Our Pillars
            </span>
            <h2>
              The Values That <span>Guide Us</span>
            </h2>
            <p>
              We pride ourselves on honesty, artistry, and an obsession with customer delight.
            </p>
          </div>

          <div className="about-values-grid">
            <div className="about-value-card">
              <div className="about-value-icon">
                <i className="fa-solid fa-gem"></i>
              </div>
              <h3>Uncompromised Quality</h3>
              <p>
                We only source heavy-gauge ceramics, real polished wood, and durable metals.
                No flimsy materials or low-resolution prints.
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon">
                <i className="fa-solid fa-leaf"></i>
              </div>
              <h3>Thoughtful Packaging</h3>
              <p>
                We use protective, eco-friendly cushioning and reusable gift presentation boxes
                designed to impress the moment they are unboxed.
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon">
                <i className="fa-solid fa-comments"></i>
              </div>
              <h3>Customer First, Always</h3>
              <p>
                Need preview assistance or last-minute customization? Our Mangalore team is
                always available via WhatsApp and direct call.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. BOTTOM CALL TO ACTION
          ───────────────────────────────────────────────────────────── */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-box">
            <h2>
              Ready to Turn Moments into <span>Memories?</span>
            </h2>
            <p>
              Explore our best-selling personalized gifts or talk with our team to create a
              bespoke order for weddings, birthdays, or corporate celebrations.
            </p>
            <div className="about-cta-actions">
              <button
                type="button"
                className="about-cta-primary-btn"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onNavigate('/shop');
                }}
              >
                <i className="fa-solid fa-bag-shopping"></i>
                <span>Explore Gift Collections</span>
              </button>

              <button
                type="button"
                className="about-cta-secondary-btn"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onNavigate('/contact');
                }}
              >
                <i className="fa-solid fa-phone"></i>
                <span>Contact Our Studio</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
