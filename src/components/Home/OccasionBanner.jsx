import React from 'react';
import defaultArtworkImg from '../../assets/images/engagement-gifts-artwork.png';
import defaultBannerImg from '../../assets/images/engagement-gifts-banner.png';

export default function OccasionBanner({ content = null, onNavigate = () => {} }) {
  const layout = content?.layout || 'split';
  const isSplit = layout === 'split';

  const rawImage = content?.image;
  // If in split mode and image still references the legacy full banner with baked-in text, use the clean artwork image
  const isLegacyBakedBanner =
    !rawImage ||
    (typeof rawImage === 'string' &&
      (rawImage.includes('engagement-gifts-banner.png') || rawImage.endsWith('engagement-gifts-banner')));

  const bannerImage = isSplit && isLegacyBakedBanner
    ? defaultArtworkImg
    : (rawImage || (isSplit ? defaultArtworkImg : defaultBannerImg));

  const tag = content?.tag || 'GIFTS BY OCCASION';
  const titleMain = content?.titleMain || 'Engagement';
  const titleHighlight = content?.titleHighlight || 'Gifts';
  const desc =
    content?.desc ||
    'Celebrate their new beginning with thoughtful, personalised gifts that make their engagement journey even more special.';
  const btnText = content?.btnText || 'View Details';
  const btnLink = content?.btnLink || '/engagement-gifts';
  const altText =
    content?.alt ||
    `${titleMain} ${titleHighlight}`.trim() ||
    'Occasion Feature Banner';

  const handleClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(btnLink);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(btnLink);
      }
    }
  };

  return (
    <section className="occasion-banner-section" aria-label={tag || 'Gifts By Occasion'}>
      <div className="container">
        <div
          className={`occasion-banner-card ${isSplit ? 'occasion-banner-split-mode' : 'occasion-banner-full-mode'}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          title={`${titleMain} ${titleHighlight} - Click to explore`}
        >
          {isSplit ? (
            <div className="occasion-banner-grid">
              {/* Left Column: Real Editable Typography */}
              <div className="occasion-banner-content">
                {tag && (
                  <div className="occasion-banner-tag-wrapper">
                    <span className="occasion-banner-tag">{tag}</span>
                    <span className="occasion-banner-tag-line" aria-hidden="true" />
                  </div>
                )}

                <h2 className="occasion-banner-heading">
                  <span className="occasion-heading-main">{titleMain}</span>
                  {titleHighlight && (
                    <span className="occasion-heading-highlight">{titleHighlight}</span>
                  )}
                </h2>

                {desc && <p className="occasion-banner-desc">{desc}</p>}

                {btnText && (
                  <div className="occasion-banner-action">
                    <span className="occasion-banner-btn">
                      <span>{btnText}</span>
                      <span className="occasion-btn-icon" aria-hidden="true">
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: High Clarity Visual / Artwork */}
              <div className="occasion-banner-visual">
                <div className="occasion-banner-visual-inner">
                  <img
                    src={bannerImage}
                    alt={altText}
                    className="occasion-banner-artwork-img"
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src !== defaultArtworkImg) {
                        e.currentTarget.src = defaultArtworkImg;
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="occasion-banner-full-wrapper">
              <img
                src={bannerImage}
                alt={altText}
                className="occasion-banner-img"
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src !== defaultBannerImg) {
                    e.currentTarget.src = defaultBannerImg;
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
