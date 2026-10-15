import React from 'react';
import './AboutPage.css';
import aboutHeroImg from '../../assets/about/hero.avif';
import packagingImg from '../../assets/images/packaging.avif';
import artDesignImg from '../../assets/images/art-design.avif';
import cupsProductImg from '../../assets/images/cups-product.avif';
import { DEFAULT_ABOUT_CONTENT } from '../../data/aboutContentData';

export default function AboutPage({
  aboutContent = DEFAULT_ABOUT_CONTENT,
  onNavigate = () => {},
  onSearch = () => {}
}) {
  const content = aboutContent || DEFAULT_ABOUT_CONTENT;
  const visibility = content?.visibility || DEFAULT_ABOUT_CONTENT.visibility;
  const hero = content?.hero || DEFAULT_ABOUT_CONTENT.hero;
  const highlights = content?.highlights || DEFAULT_ABOUT_CONTENT.highlights;
  const story = content?.story || DEFAULT_ABOUT_CONTENT.story;
  const stats = content?.stats || DEFAULT_ABOUT_CONTENT.stats;
  const process = content?.process || DEFAULT_ABOUT_CONTENT.process;
  const values = content?.values || DEFAULT_ABOUT_CONTENT.values;
  const cta = content?.cta || DEFAULT_ABOUT_CONTENT.cta;

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
      {visibility.hero !== false && (
        <section className="about-hero-section" aria-label="About Fine Gift Studio Hero">
          <div className="about-hero-container">
            <div className="about-hero-card">
              {/* Background Image Layer from public/about/hero.avif or custom CMS URL */}
              <div className="about-hero-bg-layer">
                <img
                  src={hero.heroImage || aboutHeroImg || '/about/hero.avif'}
                  alt="Fine Gift Studio - Luxury Wrapped Gifts and Ribbons"
                  className="about-hero-bg-img"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = aboutHeroImg || '/about/hero.avif';
                  }}
                />
                <div className="about-hero-overlay-tint"></div>
              </div>

              {/* Overlaid Live Typography & CTA Content */}
              <div className="about-hero-content-layer">
                <div className="about-hero-text-block">
                  <div className="about-hero-eyebrow">
                    <span>{hero.eyebrow || 'The Art of Gifting'}</span>
                  </div>

                  <h1 className="about-hero-title">
                    {hero.title}{' '}
                    <span className="about-hero-title-highlight">{hero.highlightTitle}</span>
                  </h1>

                  <p className="about-hero-subtitle">{hero.subtitle}</p>

                  <div className="about-hero-cta-row">
                    <button
                      type="button"
                      className="about-hero-cta-btn"
                      onClick={scrollToStory}
                      aria-label={hero.ctaText || 'Discover Our Story'}
                    >
                      <span>{hero.ctaText || 'Discover Our Story'}</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>

                  <div className="about-hero-tagline">{hero.tagline}</div>
                </div>
              </div>
            </div>

            {/* Value Props & Highlight Strip */}
            {visibility.highlights !== false && (
              <div className="about-highlights-strip">
                {highlights.map((hl, idx) => (
                  <div key={hl.id || idx} className="about-highlight-card">
                    <div className="about-highlight-icon-wrap">
                      <i className={hl.icon || 'fa-solid fa-gift'}></i>
                    </div>
                    <div className="about-highlight-text">
                      <h4>{hl.title}</h4>
                      <p>{hl.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. OUR STORY SECTION
          ───────────────────────────────────────────────────────────── */}
      {visibility.story !== false && (
        <section id="about-our-story" className="about-story-section">
          <div className="container">
            <div className="about-story-grid">
              <div className="about-story-content">
                <span className="about-section-badge">
                  <i className="fa-solid fa-sparkles"></i> {story.badge || 'Our Journey'}
                </span>
                <h2>
                  {story.title} <span>{story.highlightTitle}</span>
                </h2>
                <p className="about-story-p">{story.p1}</p>
                <p className="about-story-p">{story.p2}</p>

                {story.quote && (
                  <blockquote className="about-story-quote">
                    {story.quote}
                    {story.quoteAuthor && (
                      <span className="about-story-quote-author">{story.quoteAuthor}</span>
                    )}
                  </blockquote>
                )}

                <p className="about-story-p">{story.p3}</p>
              </div>

              <div className="about-story-visual">
                <div className="about-visual-collage">
                  <div className="about-collage-card about-collage-primary">
                    <img
                      src={story.img1 || packagingImg}
                      alt="Fine Gift Studio Luxury Packaging"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = packagingImg;
                      }}
                    />
                  </div>
                  <div className="about-collage-secondary">
                    <div className="about-collage-subcard">
                      <img
                        src={story.img2 || artDesignImg}
                        alt="Artisanal Design Studio"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = artDesignImg;
                        }}
                      />
                    </div>
                    <div className="about-collage-subcard">
                      <img
                        src={story.img3 || cupsProductImg}
                        alt="Handcrafted Personalized Mugs"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = cupsProductImg;
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="about-story-floating-badge">
                  <div className="about-badge-icon">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div className="about-badge-text">
                    <strong>{story.floatingBadgeTitle || 'Mangalore Roots'}</strong>
                    <span>{story.floatingBadgeSubtitle || 'Delivering Smiles Pan-India'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. STATS BANNER
          ───────────────────────────────────────────────────────────── */}
      {visibility.stats !== false && (
        <section className="about-stats-section" aria-label="Fine Gift Studio Numbers">
          <div className="container">
            <div className="about-stats-banner">
              {stats.map((st, idx) => (
                <div key={st.id || idx} className="about-stat-item">
                  <div className="about-stat-number">
                    {st.number}
                    <span>{st.suffix}</span>
                  </div>
                  <div className="about-stat-label">{st.label}</div>
                  <div className="about-stat-desc">{st.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. HOW IT WORKS (The Crafting Experience)
          ───────────────────────────────────────────────────────────── */}
      {visibility.process !== false && (
        <section className="about-process-section">
          <div className="container">
            <div className="about-section-header">
              <span className="about-section-badge">
                <i className="fa-solid fa-list-check"></i> {process.badge || 'Simple Process'}
              </span>
              <h2>
                {process.title} <span>{process.highlightTitle}</span>
              </h2>
              <p>{process.description}</p>
            </div>

            <div className="about-steps-grid">
              {(process.steps || []).map((step, idx) => (
                <div key={idx} className="about-step-card">
                  <span className="about-step-num">{step.num || `0${idx + 1}`}</span>
                  <div className="about-step-icon">
                    <i className={step.icon || 'fa-solid fa-gift'}></i>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. CORE VALUES
          ───────────────────────────────────────────────────────────── */}
      {visibility.values !== false && (
        <section className="about-values-section">
          <div className="container">
            <div className="about-section-header">
              <span className="about-section-badge">
                <i className="fa-solid fa-shield-heart"></i> {values.badge || 'Our Pillars'}
              </span>
              <h2>
                {values.title} <span>{values.highlightTitle}</span>
              </h2>
              <p>{values.description}</p>
            </div>

            <div className="about-values-grid">
              {(values.pillars || []).map((pil, idx) => (
                <div key={idx} className="about-value-card">
                  <div className="about-value-icon">
                    <i className={pil.icon || 'fa-solid fa-gem'}></i>
                  </div>
                  <h3>{pil.title}</h3>
                  <p>{pil.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. BOTTOM CALL TO ACTION
          ───────────────────────────────────────────────────────────── */}
      {visibility.cta !== false && (
        <section className="about-cta-section">
          <div className="container">
            <div className="about-cta-box">
              <h2>
                {cta.title} <span>{cta.highlightTitle}</span>
              </h2>
              <p>{cta.description}</p>
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
                  <span>{cta.primaryBtnText || 'Explore Gift Collections'}</span>
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
                  <span>{cta.secondaryBtnText || 'Contact Our Studio'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
