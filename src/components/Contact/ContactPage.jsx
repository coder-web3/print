import React, { useState } from 'react';
import './ContactPage.css';
import { DEFAULT_CONTACT_CONTENT } from '../../data/contactContentData';

export default function ContactPage({
  contactContent = DEFAULT_CONTACT_CONTENT,
  onNavigate = () => {},
  showNotification = () => {}
}) {
  const content = contactContent || DEFAULT_CONTACT_CONTENT;
  const visibility = content?.visibility || DEFAULT_CONTACT_CONTENT.visibility;
  const hero = content?.hero || DEFAULT_CONTACT_CONTENT.hero;
  const channels = content?.channels || DEFAULT_CONTACT_CONTENT.channels;
  const formContent = content?.form || DEFAULT_CONTACT_CONTENT.form;
  const sidebar = content?.sidebar || DEFAULT_CONTACT_CONTENT.sidebar;
  const workshop = content?.workshop || DEFAULT_CONTACT_CONTENT.workshop;

  // Inquiry category tab: 'custom' | 'corporate' | 'wedding' | 'support'
  const [inquiryType, setInquiryType] = useState('custom');

  // Form input state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    occasion: 'Birthday',
    quantity: '1-10 items',
    neededBy: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryRefNumber, setInquiryRefNumber] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePromptClick = (text) => {
    setFormData((prev) => ({
      ...prev,
      message: prev.message ? `${prev.message} | ${text}` : text
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showNotification('error', 'Required Fields', 'Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedRef = `FG-${Math.floor(100000 + Math.random() * 900000)}`;
      setInquiryRefNumber(generatedRef);
      setIsSubmitting(false);
      setIsSubmitted(true);
      showNotification('success', 'Inquiry Received', `Thank you! Your reference is #${generatedRef}`);
    }, 900);
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      occasion: 'Birthday',
      quantity: '1-10 items',
      neededBy: '',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <main className="contact-page-wrapper">
      {/* ─────────────────────────────────────────────────────────────
          1. BREADCRUMB
          ───────────────────────────────────────────────────────────── */}
      <nav className="contact-breadcrumb-strip" aria-label="Breadcrumb">
        <div className="container contact-breadcrumb-inner">
          <a
            href="#home"
            className="contact-breadcrumb-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
          >
            <i className="fa-solid fa-house"></i> Home
          </a>
          <span className="contact-breadcrumb-sep">/</span>
          <span className="contact-breadcrumb-current">Contact Us</span>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO HEADER
          ───────────────────────────────────────────────────────────── */}
      {visibility.hero !== false && (
        <section className="contact-hero-section" aria-label="Contact Studio Hero">
          <div className="contact-hero-container">
            <div className="contact-eyebrow-pill">
              <span className="contact-pulse-dot"></span>
              {hero.eyebrow || 'Studio Concierge Online'}
            </div>
            <h1 className="contact-hero-title">
              {hero.title} <span>{hero.highlightTitle}</span>
            </h1>
            <p className="contact-hero-subtitle">{hero.subtitle}</p>
          </div>

          {/* 4 Direct Quick Channels */}
          {visibility.channels !== false && (
            <div className="contact-channels-strip">
              <a href={channels.phoneLink || 'tel:+910000000000'} className="contact-channel-pill">
                <div className="contact-channel-icon phone">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="contact-channel-info">
                  <span className="contact-channel-label">{channels.phoneLabel || 'Direct Hotline'}</span>
                  <span className="contact-channel-val">{channels.phoneVal || '+91 0000 000 000'}</span>
                </div>
              </a>

              <a
                href={channels.whatsappLink || 'https://wa.me/910000000000'}
                target="_blank"
                rel="noreferrer"
                className="contact-channel-pill"
              >
                <div className="contact-channel-icon whatsapp">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <div className="contact-channel-info">
                  <span className="contact-channel-label">{channels.whatsappLabel || 'WhatsApp Live'}</span>
                  <span className="contact-channel-val">{channels.whatsappVal || 'Chat with Artisan'}</span>
                </div>
              </a>

              <a href={channels.emailLink || 'mailto:info@gift.com'} className="contact-channel-pill">
                <div className="contact-channel-icon email">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="contact-channel-info">
                  <span className="contact-channel-label">{channels.emailLabel || 'Official Email'}</span>
                  <span className="contact-channel-val">{channels.emailVal || 'info@gift.com'}</span>
                </div>
              </a>

              <div className="contact-channel-pill">
                <div className="contact-channel-icon location">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="contact-channel-info">
                  <span className="contact-channel-label">{channels.workshopLabel || 'Artisan Workshop'}</span>
                  <span className="contact-channel-val">{channels.workshopVal || 'Mangalore, Karnataka'}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN WORKSPACE (Form + Concierge Details)
          ───────────────────────────────────────────────────────────── */}
      {(visibility.form !== false || visibility.sidebar !== false) && (
        <section className="contact-main-section">
          <div className="container">
            <div className="contact-layout-grid">
              {/* ─── 3A. INQUIRY CONCIERGE FORM ─── */}
              {visibility.form !== false && (
                <div className="contact-form-card">
                  <div className="contact-form-header">
                    <h2>{formContent.title || 'Send an Artisan Inquiry'}</h2>
                    <p>{formContent.subtitle}</p>
                  </div>

                  {/* Inquiry Type Tabs */}
                  <div className="inquiry-type-selector">
                    <span className="inquiry-types-label">{formContent.typesLabel || 'What can we help you create?'}</span>
                    <div className="inquiry-type-tabs" role="tablist">
                      <button
                        type="button"
                        className={`inquiry-type-btn ${inquiryType === 'custom' ? 'active' : ''}`}
                        onClick={() => setInquiryType('custom')}
                      >
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        <span>Personal Gift</span>
                      </button>

                      <button
                        type="button"
                        className={`inquiry-type-btn ${inquiryType === 'corporate' ? 'active' : ''}`}
                        onClick={() => setInquiryType('corporate')}
                      >
                        <i className="fa-solid fa-building"></i>
                        <span>Corporate & Bulk</span>
                      </button>

                      <button
                        type="button"
                        className={`inquiry-type-btn ${inquiryType === 'wedding' ? 'active' : ''}`}
                        onClick={() => setInquiryType('wedding')}
                      >
                        <i className="fa-solid fa-champagne-glasses"></i>
                        <span>Wedding & Event</span>
                      </button>

                      <button
                        type="button"
                        className={`inquiry-type-btn ${inquiryType === 'support' ? 'active' : ''}`}
                        onClick={() => setInquiryType('support')}
                      >
                        <i className="fa-solid fa-headset"></i>
                        <span>Order Support</span>
                      </button>
                    </div>
                  </div>

                  {isSubmitted ? (
                    <div className="contact-success-banner">
                      <div className="contact-success-icon">
                        <i className="fa-solid fa-check"></i>
                      </div>
                      <h3>Inquiry Dispatched Successfully!</h3>
                      <p>
                        Thank you <strong>{formData.name}</strong>. Your reference ID is{' '}
                        <strong>#{inquiryRefNumber}</strong>. An artisan specialist will contact you on{' '}
                        <strong>{formData.phone}</strong> shortly.
                      </p>
                      <button
                        type="button"
                        className="contact-reset-btn"
                        onClick={handleResetForm}
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="contact-form-grid">
                        {/* Full Name */}
                        <div className="contact-form-group">
                          <label className="contact-label" htmlFor="contactName">
                            Your Full Name <span className="req">*</span>
                          </label>
                          <div className="contact-input-wrap">
                            <i className="fa-regular fa-user"></i>
                            <input
                              type="text"
                              id="contactName"
                              name="name"
                              className="contact-input"
                              placeholder="e.g. Rahul Sharma"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        {/* Phone / WhatsApp */}
                        <div className="contact-form-group">
                          <label className="contact-label" htmlFor="contactPhone">
                            Phone / WhatsApp <span className="req">*</span>
                          </label>
                          <div className="contact-input-wrap">
                            <i className="fa-brands fa-whatsapp"></i>
                            <input
                              type="tel"
                              id="contactPhone"
                              name="phone"
                              className="contact-input"
                              placeholder="e.g. +91 98765 43210"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="contact-form-group">
                          <label className="contact-label" htmlFor="contactEmail">
                            Email Address <span className="optional">(Optional)</span>
                          </label>
                          <div className="contact-input-wrap">
                            <i className="fa-regular fa-envelope"></i>
                            <input
                              type="email"
                              id="contactEmail"
                              name="email"
                              className="contact-input"
                              placeholder="e.g. rahul@example.com"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        {/* Company (or Occasion depending on type) */}
                        {inquiryType === 'corporate' ? (
                          <div className="contact-form-group">
                            <label className="contact-label" htmlFor="contactCompany">
                              Company / Organization <span className="req">*</span>
                            </label>
                            <div className="contact-input-wrap">
                              <i className="fa-solid fa-briefcase"></i>
                              <input
                                type="text"
                                id="contactCompany"
                                name="company"
                                className="contact-input"
                                placeholder="e.g. Infosys Ltd."
                                value={formData.company}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="contact-form-group">
                            <label className="contact-label" htmlFor="contactOccasion">
                              Occasion / Milestone
                            </label>
                            <div className="contact-input-wrap">
                              <i className="fa-solid fa-gift"></i>
                              <select
                                id="contactOccasion"
                                name="occasion"
                                className="contact-select"
                                value={formData.occasion}
                                onChange={handleInputChange}
                              >
                                <option value="Birthday">Birthday Celebration</option>
                                <option value="Anniversary">Wedding Anniversary</option>
                                <option value="Wedding">Wedding / Engagement</option>
                                <option value="Corporate">Corporate / Farewell</option>
                                <option value="Festival">Festival (Diwali / Eid / X'mas)</option>
                                <option value="Other">Bespoke Keepsake</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="contact-form-group">
                          <label className="contact-label" htmlFor="contactQty">
                            Estimated Quantity
                          </label>
                          <div className="contact-input-wrap">
                            <i className="fa-solid fa-cubes"></i>
                            <select
                              id="contactQty"
                              name="quantity"
                              className="contact-select"
                              value={formData.quantity}
                              onChange={handleInputChange}
                            >
                              <option value="1-10 items">1 to 10 items (Personal order)</option>
                              <option value="10-50 items">10 to 50 items (Small group)</option>
                              <option value="50-200 items">50 to 200 items (Bulk event)</option>
                              <option value="200+ items">200+ items (Enterprise)</option>
                            </select>
                          </div>
                        </div>

                        {/* Target Date */}
                        <div className="contact-form-group">
                          <label className="contact-label" htmlFor="contactNeededBy">
                            Required Delivery Date <span className="optional">(Optional)</span>
                          </label>
                          <div className="contact-input-wrap">
                            <i className="fa-regular fa-calendar"></i>
                            <input
                              type="date"
                              id="contactNeededBy"
                              name="neededBy"
                              className="contact-input"
                              value={formData.neededBy}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        {/* Message / Details */}
                        <div className="contact-form-group full-width">
                          <label className="contact-label" htmlFor="contactMessage">
                            Your Customization Requirements <span className="req">*</span>
                          </label>
                          <textarea
                            id="contactMessage"
                            name="message"
                            className="contact-textarea"
                            placeholder="Tell us what you'd like to personalize — names, photos, quotes, preferred products, or custom packaging..."
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            required
                          ></textarea>

                          {/* Prompt chips suggestions */}
                          {formContent.prompts && formContent.prompts.length > 0 && (
                            <div className="contact-prompt-chips">
                              {formContent.prompts.map((promptText, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  className="prompt-chip"
                                  onClick={() => handlePromptClick(promptText)}
                                >
                                  + {promptText}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Submit Row */}
                      <div className="contact-submit-row">
                        <button
                          type="submit"
                          className="contact-submit-btn"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <i className="fa-solid fa-circle-notch fa-spin"></i>
                              <span>Sending Inquiry...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Inquiry to Studio</span>
                              <i className="fa-solid fa-paper-plane"></i>
                            </>
                          )}
                        </button>

                        <div className="contact-form-privacy-note">
                          <i className="fa-solid fa-shield-halved"></i>
                          <span>{formContent.privacyNote || 'Your details are 100% confidential. No spam ever.'}</span>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ─── 3B. DIRECT CONCIERGE CARDS (Right Column) ─── */}
              {visibility.sidebar !== false && (
                <aside className="contact-sidebar">
                  {/* WhatsApp VIP Desk */}
                  <div className="contact-info-card vip-highlight">
                    <div className="contact-card-header">
                      <div className="contact-card-icon green">
                        <i className="fa-brands fa-whatsapp"></i>
                      </div>
                      <div>
                        <h3>{sidebar?.whatsapp?.title || 'WhatsApp Priority Desk'}</h3>
                        <span className="contact-live-pill">
                          <span className="contact-pulse-dot"></span> {sidebar?.whatsapp?.badge || 'Avg reply: < 15 mins'}
                        </span>
                      </div>
                    </div>
                    <div className="contact-card-body">
                      <p>{sidebar?.whatsapp?.desc}</p>
                      <a
                        href={sidebar?.whatsapp?.link || 'https://wa.me/910000000000'}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-action-link-btn whatsapp-style"
                      >
                        <i className="fa-brands fa-whatsapp"></i>
                        <span>{sidebar?.whatsapp?.btnText || 'Open Live WhatsApp Chat'}</span>
                      </a>
                    </div>
                  </div>

                  {/* Direct Studio Hotline */}
                  <div className="contact-info-card">
                    <div className="contact-card-header">
                      <div className="contact-card-icon magenta">
                        <i className="fa-solid fa-phone-volume"></i>
                      </div>
                      <div>
                        <h3>{sidebar?.call?.title || 'Direct Studio Call'}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#718096' }}>
                          {sidebar?.call?.hours || 'Mon - Sat: 9:00 AM - 7:00 PM IST'}
                        </span>
                      </div>
                    </div>
                    <div className="contact-card-body">
                      <p>{sidebar?.call?.desc}</p>
                      <a href={sidebar?.call?.link || 'tel:+910000000000'} className="contact-action-link-btn call-style">
                        <i className="fa-solid fa-phone"></i>
                        <span>{sidebar?.call?.btnText || 'Call (+91) 0000 000 000'}</span>
                      </a>
                    </div>
                  </div>

                  {/* Mangalore Workshop Headquarters */}
                  <div className="contact-info-card">
                    <div className="contact-card-header">
                      <div className="contact-card-icon purple">
                        <i className="fa-solid fa-store"></i>
                      </div>
                      <div>
                        <h3>{sidebar?.studio?.title || 'Mangalore Flagship Studio'}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#718096' }}>{sidebar?.studio?.location || 'Karnataka, India'}</span>
                      </div>
                    </div>
                    <div className="contact-card-body">
                      <p>{sidebar?.studio?.desc}</p>
                      <div className="contact-address-list">
                        <div className="contact-address-item">
                          <i className="fa-solid fa-location-dot"></i>
                          <span>{sidebar?.studio?.address || 'Main Workshop & Experience Studio, Mangalore, Karnataka, India'}</span>
                        </div>
                        <div className="contact-address-item">
                          <i className="fa-regular fa-clock"></i>
                          <span>{sidebar?.studio?.hours || 'Working Hours: Monday to Saturday, 9:00 AM to 7:00 PM IST'}</span>
                        </div>
                        <div className="contact-address-item">
                          <i className="fa-regular fa-envelope"></i>
                          <span>{sidebar?.studio?.email || 'Official Mail: info@gift.com'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Corporate B2B Desk */}
                  <div className="contact-info-card">
                    <div className="contact-card-header">
                      <div className="contact-card-icon amber">
                        <i className="fa-solid fa-building-columns"></i>
                      </div>
                      <div>
                        <h3>{sidebar?.corporate?.title || 'Corporate Gifting Solutions'}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#718096' }}>{sidebar?.corporate?.subtitle || 'GST Invoices & Bulk Pricing'}</span>
                      </div>
                    </div>
                    <div className="contact-card-body">
                      <p>{sidebar?.corporate?.desc}</p>
                      <button
                        type="button"
                        className="contact-action-link-btn outline-style"
                        onClick={() => {
                          setInquiryType('corporate');
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                      >
                        <i className="fa-solid fa-file-invoice"></i>
                        <span>{sidebar?.corporate?.btnText || 'Request Corporate Catalog'}</span>
                      </button>
                    </div>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. WORKSHOP & NATIONWIDE DISPATCH SHOWCASE
          ───────────────────────────────────────────────────────────── */}
      {visibility.workshop !== false && (
        <section className="contact-workshop-section">
          <div className="container">
            <div className="contact-workshop-card">
              <div className="contact-workshop-content">
                <h3>
                  {workshop.title} <span>{workshop.highlightTitle}</span>
                </h3>
                <p>{workshop.desc}</p>
                <div className="contact-workshop-perks">
                  {(workshop.perks || []).map((perk, pIdx) => (
                    <div key={pIdx} className="workshop-perk">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="contact-workshop-visual">
                <div className="contact-map-mockup">
                  <div className="map-pin-badge">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{workshop.mapBadge || 'Fine Gift Studio Central Hub'}</span>
                  </div>
                  <div className="map-location-title">{workshop.mapLocation || 'Mangalore, Karnataka, India'}</div>
                  <p className="map-location-sub">{workshop.mapSub}</p>
                  <div className="map-shipping-pills">
                    {(workshop.pills || []).map((pill, idx) => (
                      <span key={idx} className="map-pill">{pill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
