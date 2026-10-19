import React, { useState, useEffect } from 'react';
import { DEFAULT_LEGAL_CONTENT } from '../../data/legalData';
import './LegalPage.css';

// Helper to format inline markdown-like bold (**text**) and email/phone links
function renderInlineText(text) {
  if (!text) return null;
  // Match **bold** tokens
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// Helper to parse multi-line content into paragraphs, bullet lists, and numbered lists
function renderContentBlocks(rawContent) {
  if (!rawContent) return null;

  // Split by double newline or distinct paragraphs
  const chunks = rawContent.split(/\n\s*\n/);

  return chunks.map((chunk, chunkIdx) => {
    const lines = chunk
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return null;

    // Check if every line is a bullet item (•, -, or *)
    const isBulletList = lines.every((l) => /^[•\-*]\s+/.test(l));
    if (isBulletList) {
      return (
        <ul key={chunkIdx} className="legal-doc-list">
          {lines.map((line, lIdx) => (
            <li key={lIdx}>{renderInlineText(line.replace(/^[•\-*]\s+/, ''))}</li>
          ))}
        </ul>
      );
    }

    // Check if every line is a numbered item (1., 2., etc.)
    const isNumberedList = lines.every((l) => /^\d+\.\s+/.test(l));
    if (isNumberedList) {
      return (
        <ol key={chunkIdx} className="legal-doc-list legal-doc-ordered">
          {lines.map((line, lIdx) => (
            <li key={lIdx}>{renderInlineText(line.replace(/^\d+\.\s+/, ''))}</li>
          ))}
        </ol>
      );
    }

    // Otherwise render standard paragraph with line breaks preserved
    return (
      <p key={chunkIdx}>
        {lines.map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {renderInlineText(line)}
            {lIdx < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

export default function LegalPage({
  initialTab = 'terms', // 'terms' | 'privacy' | 'shipping' | 'returns'
  legalContent = null,
  onNavigate = () => {}
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Merge provided legalContent with rock-solid DEFAULT_LEGAL_CONTENT
  const merged = {
    ...DEFAULT_LEGAL_CONTENT,
    ...(legalContent || {}),
    terms: { ...DEFAULT_LEGAL_CONTENT.terms, ...(legalContent?.terms || {}) },
    privacy: { ...DEFAULT_LEGAL_CONTENT.privacy, ...(legalContent?.privacy || {}) },
    shipping: { ...DEFAULT_LEGAL_CONTENT.shipping, ...(legalContent?.shipping || {}) },
    returns: { ...DEFAULT_LEGAL_CONTENT.returns, ...(legalContent?.returns || {}) },
  };

  const currentPolicy =
    activeTab === 'privacy'
      ? merged.privacy
      : activeTab === 'shipping'
      ? merged.shipping
      : activeTab === 'returns'
      ? merged.returns
      : merged.terms;

  const sections = Array.isArray(currentPolicy?.sections) ? currentPolicy.sections : [];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="legal-page-wrapper">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="legal-breadcrumb">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
          >
            Home
          </a>
          <span>/</span>
          <span className="current">
            {activeTab === 'terms'
              ? merged.terms?.tabTitle || 'Terms & Conditions'
              : activeTab === 'privacy'
              ? merged.privacy?.tabTitle || 'Privacy Policy'
              : activeTab === 'shipping'
              ? merged.shipping?.tabTitle || 'Shipping Policy'
              : merged.returns?.tabTitle || 'Return & Refund Policy'}
          </span>
        </div>

        {/* 1. Hero Header Banner */}
        <div className="legal-hero-banner">
          <div className="legal-badge-pill">
            <i className="fa-solid fa-scale-balanced"></i>
            <span>{merged.badgeText || 'Official Legal Documentation'}</span>
          </div>

          <h1>{currentPolicy?.heroTitle}</h1>

          <p>{currentPolicy?.heroSubtitle}</p>

          <div className="legal-last-updated">
            <i className="fa-regular fa-clock"></i>
            <span>
              Last Updated: {merged.lastUpdated || 'October 10, 2026'} •{' '}
              {merged.effectiveNotice || 'Effective Immediately'}
            </span>
          </div>
        </div>

        {/* 2. Policy Switcher Tabs */}
        <div className="legal-tabs-bar" role="tablist">
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('terms');
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
          >
            <i className="fa-solid fa-file-contract"></i>
            <span>{merged.terms?.tabTitle || 'Terms & Conditions'}</span>
          </button>

          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('privacy');
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
          >
            <i className="fa-solid fa-shield-halved"></i>
            <span>{merged.privacy?.tabTitle || 'Privacy Policy'}</span>
          </button>

          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('shipping');
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
          >
            <i className="fa-solid fa-truck-fast"></i>
            <span>{merged.shipping?.tabTitle || 'Shipping Policy'}</span>
          </button>

          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'returns' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('returns');
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
          >
            <i className="fa-solid fa-rotate-left"></i>
            <span>{merged.returns?.tabTitle || 'Return & Refund'}</span>
          </button>
        </div>

        {/* 3. Document Content with Sticky Outline */}
        <div className="legal-content-grid">
          {/* Table of Contents Sidebar */}
          <aside className="legal-toc-card">
            <div className="legal-toc-title">
              <i className="fa-solid fa-list-ul"></i> Quick Navigation
            </div>

            <ul className="legal-toc-list">
              {sections.map((sec, idx) => {
                const secId = sec.id || `${activeTab}-${idx + 1}`;
                return (
                  <li key={secId}>
                    <a
                      href={`#${secId}`}
                      className="legal-toc-link"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(secId);
                      }}
                    >
                      {idx + 1}. {sec.title}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="legal-toc-contact-box">
              <h5>Have Legal Inquiries?</h5>
              <p>Our compliance team is ready to answer questions.</p>
              <button
                type="button"
                className="legal-contact-btn"
                onClick={() => onNavigate('/contact')}
              >
                <i className="fa-solid fa-envelope"></i> Contact Support
              </button>
            </div>
          </aside>

          {/* Main Legal Document Content */}
          <main className="legal-doc-container">
            {/* Optional Privacy Guarantee Banner on Privacy tab */}
            {activeTab === 'privacy' && currentPolicy?.guaranteeTitle && (
              <div className="privacy-guarantee-banner">
                <div className="privacy-guarantee-icon">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <div className="privacy-guarantee-text">
                  <h4>{currentPolicy.guaranteeTitle}</h4>
                  <p>{currentPolicy.guaranteeDesc}</p>
                </div>
              </div>
            )}

            {/* Dynamic Policy Sections */}
            {sections.map((sec, idx) => {
              const secId = sec.id || `${activeTab}-${idx + 1}`;
              return (
                <section key={secId} id={secId} className="legal-doc-section">
                  <h2>
                    <span className="sec-num">{idx + 1}.</span> {sec.title}
                  </h2>
                  <div className="legal-doc-body">
                    {renderContentBlocks(sec.content)}
                  </div>
                </section>
              );
            })}

            {/* Grievance Officer Callout Box at bottom of Privacy Policy */}
            {activeTab === 'privacy' && merged.grievanceOfficer && (
              <div
                className="legal-callout-box"
                style={{ background: '#f8fafc', borderColor: '#475569', marginTop: '24px' }}
              >
                <h4 style={{ color: '#0f172a' }}>
                  <i className="fa-solid fa-user-shield" style={{ marginRight: '8px', color: '#7d2091' }}></i>
                  Grievance Officer: {merged.grievanceOfficer}
                </h4>
                <p style={{ color: '#334155', lineHeight: 1.6 }}>
                  <strong>Fine Gift Studio</strong>
                  <br />
                  Address: {merged.companyAddress}
                  <br />
                  Email:{' '}
                  <a
                    href={`mailto:${merged.supportEmail || 'info@gift.com'}`}
                    style={{ color: '#c40b90', fontWeight: 700 }}
                  >
                    {merged.supportEmail || 'info@gift.com'}
                  </a>
                  <br />
                  Direct Hotline: <strong>{merged.supportPhone || '+91 0000 000 000'}</strong> ({merged.supportHours || 'Mon - Sat: 9:00 AM - 7:00 PM IST'})
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
