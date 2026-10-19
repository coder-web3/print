import React from 'react';
import defaultBannerImg from '../../assets/images/engagement-gifts-banner.png';

export default function OccasionBanner({ content = null, onNavigate = () => {} }) {
  const bannerImage = content?.image || defaultBannerImg;
  const btnLink = content?.btnLink || '/shop?occasion=engagement';
  const altText = content?.alt || content?.titleMain ? `${content?.titleMain || ''} ${content?.titleHighlight || ''}`.trim() : 'Engagement Gifts - Gifts by Occasion';

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
    <section className="occasion-banner-section" aria-label="Gifts By Occasion">
      <div className="container">
        <div
          className="occasion-banner-card"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          title={content?.titleMain ? `${content.titleMain} ${content.titleHighlight || ''} - Click to explore` : 'Engagement Gifts - Click to explore'}
        >
          <img
            src={bannerImage}
            alt={altText}
            className="occasion-banner-img"
            loading="lazy"
            onError={(e) => {
              // Fallback if custom URL fails to load
              if (e.currentTarget.src !== defaultBannerImg) {
                e.currentTarget.src = defaultBannerImg;
              }
            }}
          />
        </div>
      </div>
    </section>
  );
}
