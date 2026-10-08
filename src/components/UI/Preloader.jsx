import React, { useState, useEffect } from 'react';
import './Preloader.css';
import faviconImg from '../../assets/favicon-gift.png';

export default function Preloader({ onComplete = () => {} }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'flying' | 'done'
  const [flightStyle, setFlightStyle] = useState({});

  useEffect(() => {
    // Progress increment timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = Math.floor(Math.random() * 20) + 14;
        const next = prev + step;
        return next > 100 ? 100 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100 && phase === 'loading') {
      const flyTimer = setTimeout(() => {
        const centerIcon = document.getElementById('preloaderCenterIcon');
        const headerLogo = document.getElementById('headerMainLogo');

        if (centerIcon && headerLogo) {
          const startRect = centerIcon.getBoundingClientRect();
          const targetRect = headerLogo.getBoundingClientRect();

          const targetHeight = Math.min(targetRect.height || 48, 52);
          const targetWidth = targetHeight;
          const targetTop = targetRect.top + (targetRect.height - targetHeight) / 2;
          const targetLeft = targetRect.left;

          // Set starting position at exact center icon bounds
          setFlightStyle({
            top: `${startRect.top}px`,
            left: `${startRect.left}px`,
            width: `${startRect.width}px`,
            height: `${startRect.height}px`,
            transform: 'none',
            opacity: 1,
            transition: 'none'
          });
          setPhase('flying');

          // Trigger smooth flight in the next frame
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setFlightStyle({
                top: `${targetTop}px`,
                left: `${targetLeft}px`,
                width: `${targetWidth}px`,
                height: `${targetHeight}px`,
                transform: 'none',
                opacity: 1,
                transition: 'all 0.85s cubic-bezier(0.22, 1, 0.36, 1)'
              });
            });
          });
        } else {
          setPhase('flying');
        }

        // Complete transition after flight animation lands
        const doneTimer = setTimeout(() => {
          setPhase('done');
          if (headerLogo) {
            headerLogo.classList.add('header-logo-revealed');
          }
          if (onComplete) onComplete();
        }, 850);

        return () => clearTimeout(doneTimer);
      }, 350);

      return () => clearTimeout(flyTimer);
    }
  }, [progress, phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <>
      {/* 1. Main Preloader Overlay and 3D Orbital Stage */}
      <div className={`preloader-overlay ${phase === 'flying' ? 'fade-out' : ''}`}>
        <div className="preloader-ambient-glow"></div>

        <div className={`preloader-stage-container ${phase === 'flying' ? 'stage-dissolve' : ''}`}>
          {/* Outermost Diffuse Glass Halo */}
          <div className="preloader-outer-diffuse-ring"></div>

          {/* Concentric 3D Neumorphic Glass Disc */}
          <div className="preloader-glass-disc">
            {/* Dotted Orbital Track */}
            <div className="preloader-dotted-orbit-ring"></div>

            {/* Glowing Neon Arc Ring */}
            <div className="preloader-neon-arcs">
              <svg viewBox="0 0 340 340" className="arcs-svg-canvas">
                <defs>
                  <linearGradient id="neonArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="40%" stopColor="#be187d" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <filter id="neonArcGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>
                </defs>

                <path
                  d="M 175,22 A 148,148 0 0,1 315,190"
                  fill="none"
                  stroke="url(#neonArcGradient)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  filter="url(#neonArcGlow)"
                  className="arc-path-primary"
                />

                <path
                  d="M 185,318 A 148,148 0 0,1 25,165"
                  fill="none"
                  stroke="rgba(244, 114, 182, 0.45)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="arc-path-secondary"
                />
              </svg>
            </div>

            {/* 3D Pearl Orb Spheres */}
            <div className="orb-sphere orb-top-left"></div>
            <div className="orb-sphere orb-far-left"></div>
            <div className="orb-sphere orb-bottom-left"></div>
            <div className="orb-sphere orb-right-neon">
              <div className="orb-flare-sparkle"></div>
            </div>

            {/* Central 3D Favicon Emblem Showcase (Geometrically Centered) */}
            <div className="preloader-center-emblem-wrap">
              <div className="emblem-halo-shadow"></div>
              <img
                id="preloaderCenterIcon"
                src={faviconImg}
                alt="Fine Gift Studio Icon"
                className="emblem-3d-icon"
                style={{ opacity: phase === 'flying' ? 0 : 1 }}
              />
            </div>

            {/* Sleek Horizontal Capsule Progress Bar directly beneath */}
            <div className="preloader-capsule-progress-track">
              <div
                className="preloader-capsule-progress-fill"
                style={{ width: `${progress}%` }}
              >
                <div className="progress-shimmer-sweep"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Flying Morphing 3D Favicon Emblem Proxy */}
      {phase === 'flying' && (
        <div className="preloader-flying-emblem" style={flightStyle}>
          <img
            src={faviconImg}
            alt="Fine Gift Studio Icon"
            className="flying-favicon-img"
          />
          <div className="emblem-shimmer-flare"></div>
        </div>
      )}
    </>
  );
}

