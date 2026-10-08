import React from 'react';
import './CategoryStrip.css';

export default function CategoryStrip({ onCategoryClick = () => {}, onNavigate = () => {} }) {
  const items = [
    {
      id: 'photo-gifts',
      name: 'Photo Gifts',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=300&q=80',
      fallbackText: 'Best Mom Ever ❤️',
      catId: 1,
      popular: false,
    },
    {
      id: 't-shirts',
      name: 'Personalised\nT-Shirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80',
      isTshirtIcon: true,
      catId: 7,
      popular: false,
    },
    {
      id: 'acrylic-gifts',
      name: 'Acrylic Gifts',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80',
      isHeartAcrylic: true,
      catId: 2,
      popular: false,
    },
    {
      id: 'wooden-gifts',
      name: 'Wooden Gifts',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=300&q=80',
      isWoodenFrame: true,
      catId: 2,
      popular: false,
    },
    {
      id: 'mugs-bottles',
      name: 'Mugs & Bottles',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=300&q=80',
      isMugAndBottle: true,
      catId: 1,
      popular: true,
    },
    {
      id: 'keychains',
      name: 'Keychains',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=300&q=80',
      isKeychain: true,
      catId: 3,
      popular: false,
    },
    {
      id: 'corporate-gifts',
      name: 'Corporate Gifts',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80',
      isCorporateBox: true,
      catId: 6,
      popular: false,
    },
    {
      id: 'all-categories',
      name: 'All Categories',
      isAppGrid: true,
      url: '/shop',
      popular: false,
    },
  ];

  const handleClick = (item) => {
    if (item.url) {
      onNavigate(item.url);
    } else {
      onCategoryClick({ id: item.catId, name: item.name });
    }
  };

  return (
    <section className="category-strip-section">
      <div className="container">
        <div className="category-strip-card">
          {items.map((item) => (
            <div
              key={item.id}
              className={`category-strip-item ${item.popular ? 'is-popular-card' : ''}`}
              onClick={() => handleClick(item)}
            >
              {/* Popular Badge */}
              {item.popular && (
                <div className="strip-popular-badge">
                  <i className="fa-solid fa-fire"></i>
                  <span>Popular</span>
                </div>
              )}

              {/* Circle Bubble Image / Visual */}
              <div className="strip-circle-wrapper">
                {item.isAppGrid ? (
                  <div className="strip-app-grid-icon">
                    <span className="app-tile tile-purple"></span>
                    <span className="app-tile tile-pink"></span>
                    <span className="app-tile tile-blue"></span>
                    <span className="app-tile tile-magenta"></span>
                  </div>
                ) : item.isTshirtIcon ? (
                  <div className="strip-tshirt-visual">
                    <div className="tshirt-body">
                      <i className="fa-solid fa-gift tshirt-logo-icon"></i>
                    </div>
                  </div>
                ) : item.isHeartAcrylic ? (
                  <div className="strip-acrylic-visual">
                    <div className="acrylic-heart-glass">
                      <img
                        src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=200&q=80"
                        alt="Couple"
                      />
                    </div>
                    <div className="acrylic-wood-base"></div>
                  </div>
                ) : item.isWoodenFrame ? (
                  <div className="strip-wooden-visual">
                    <div className="wooden-frame-outer">
                      <div className="wooden-frame-paper">
                        <small>Forever<br />Moments</small>
                      </div>
                    </div>
                  </div>
                ) : item.isMugAndBottle ? (
                  <div className="strip-mugs-bottles-visual">
                    <div className="strip-mini-mug">
                      <span>Good Vibes Only ❤️</span>
                    </div>
                    <div className="strip-pink-bottle">
                      <span className="bottle-silver-cap"></span>
                    </div>
                  </div>
                ) : item.isKeychain ? (
                  <div className="strip-keychain-visual">
                    <div className="strip-key-ring"></div>
                    <div className="strip-key-leather">
                      <i className="fa-solid fa-heart"></i>
                    </div>
                  </div>
                ) : item.isCorporateBox ? (
                  <div className="strip-corp-box-visual">
                    <div className="corp-box-body">
                      <div className="corp-gold-ribbon-v"></div>
                      <div className="corp-gold-ribbon-h"></div>
                      <div className="corp-gold-bow"></div>
                    </div>
                  </div>
                ) : (
                  <div className="strip-photo-mug-visual">
                    <div className="photo-mug-body">
                      <span className="mug-text-tag">Best Mom Ever ❤️</span>
                      <div className="photo-mug-handle"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <h4 className="strip-item-title">
                {item.name.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== item.name.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h4>

              {/* Arrow Button */}
              <button
                type="button"
                className={`strip-arrow-action ${item.popular ? 'popular-arrow' : ''}`}
                aria-label={`Browse ${item.name}`}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
