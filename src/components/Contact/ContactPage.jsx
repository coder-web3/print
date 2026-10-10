import React, { useState } from 'react';
import './ContactPage.css';

export default function ContactPage({
  onNavigate = () => {},
  showNotification = () => {}
}) {
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

  // FAQ open/close accordion state
  const [openFaq, setOpenFaq] = useState(0);

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
    // Simulate API submission
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

  const faqs = [
    {
      q: 'How long does custom personalized gifting take to craft?',
      a: 'Standard custom gifts (mugs, photo frames, engraved pens) are crafted and dispatched from our Mangalore workshop within 24 to 48 hours. Express courier shipping takes 2 to 4 business days across India.'
    },
    {
      q: 'Can I preview a digital design mockup before printing or engraving?',
      a: 'Yes! For every custom gift or bulk order, our design team shares a complimentary digital mockup on WhatsApp for your approval before we proceed to printing and engraving.'
    },
    {
      q: 'Do you accept bulk orders for corporate events or weddings?',
      a: 'Absolutely. We specialize in B2B corporate gift sets, employee onboarding hampers, conference kits, and wedding return favors with custom logo branding and special tier pricing.'
    },
    {
      q: 'Can you ship directly to the recipient with a personalized handwritten card?',
      a: 'Yes, during checkout you can enter the recipient’s address and include your personalized message. We will print or handwrite your note on luxury stationery card free of cost with no invoice inside.'
    },
    {
      q: 'What if a delicate item (like a ceramic mug or frame) is damaged in transit?',
      a: 'We use multi-layer bubble cushioning and high-density foam packaging. In the rare event of transit damage, just send a photo to our WhatsApp support within 24 hours of delivery and we provide an immediate free replacement.'
    }
  ];

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
      <section className="contact-hero-section" aria-label="Contact Studio Hero">
        <div className="contact-hero-container">
          <div className="contact-eyebrow-pill">
            <span className="contact-pulse-dot"></span>
            Studio Concierge Online
          </div>
          <h1 className="contact-hero-title">
            Let’s Craft Something <span>Extraordinary Together.</span>
          </h1>
          <p className="contact-hero-subtitle">
            Have a custom gifting vision, corporate branding project, or need immediate assistance?
            Our Mangalore artisan team is dedicated to turning your ideas into memorable keepsakes.
          </p>
        </div>

        {/* 4 Direct Quick Channels */}
        <div className="contact-channels-strip">
          <a href="tel:+910000000000" className="contact-channel-pill">
            <div className="contact-channel-icon phone">
              <i className="fa-solid fa-phone"></i>
            </div>
            <div className="contact-channel-info">
              <span className="contact-channel-label">Direct Hotline</span>
              <span className="contact-channel-val">+91 0000 000 000</span>
            </div>
          </a>

          <a
            href="https://wa.me/910000000000"
            target="_blank"
            rel="noreferrer"
            className="contact-channel-pill"
          >
            <div className="contact-channel-icon whatsapp">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <div className="contact-channel-info">
              <span className="contact-channel-label">WhatsApp Live</span>
              <span className="contact-channel-val">Chat with Artisan</span>
            </div>
          </a>

          <a href="mailto:info@gift.com" className="contact-channel-pill">
            <div className="contact-channel-icon email">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <div className="contact-channel-info">
              <span className="contact-channel-label">Official Email</span>
              <span className="contact-channel-val">info@gift.com</span>
            </div>
          </a>

          <div className="contact-channel-pill">
            <div className="contact-channel-icon location">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="contact-channel-info">
              <span className="contact-channel-label">Artisan Workshop</span>
              <span className="contact-channel-val">Mangalore, Karnataka</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN WORKSPACE (Form + Concierge Details)
          ───────────────────────────────────────────────────────────── */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-layout-grid">
            {/* ─── 3A. INQUIRY CONCIERGE FORM ─── */}
            <div className="contact-form-card">
              <div className="contact-form-header">
                <h2>Send an Artisan Inquiry</h2>
                <p>
                  Fill out your details below and our team will get back to you with custom options,
                  pricing, and preview mockups within 2 hours.
                </p>
              </div>

              {/* Inquiry Type Tabs */}
              <div className="inquiry-type-selector">
                <span className="inquiry-types-label">What can we help you create?</span>
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
                      <div className="contact-prompt-chips">
                        <button
                          type="button"
                          className="prompt-chip"
                          onClick={() => handlePromptClick('Custom wooden engraved frame with photo')}
                        >
                          + Wooden Photo Frame
                        </button>
                        <button
                          type="button"
                          className="prompt-chip"
                          onClick={() => handlePromptClick('Personalized ceramic coffee mugs with name')}
                        >
                          + Custom Coffee Mugs
                        </button>
                        <button
                          type="button"
                          className="prompt-chip"
                          onClick={() => handlePromptClick('Corporate employee welcome kit with company logo')}
                        >
                          + Employee Hamper Kit
                        </button>
                        <button
                          type="button"
                          className="prompt-chip"
                          onClick={() => handlePromptClick('Bespoke leather wallet and metallic pen set')}
                        >
                          + Wallet & Pen Set
                        </button>
                      </div>
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
                      <span>Your details are 100% confidential. No spam ever.</span>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* ─── 3B. DIRECT CONCIERGE CARDS (Right Column) ─── */}
            <aside className="contact-sidebar">
              {/* WhatsApp VIP Desk */}
              <div className="contact-info-card vip-highlight">
                <div className="contact-card-header">
                  <div className="contact-card-icon green">
                    <i className="fa-brands fa-whatsapp"></i>
                  </div>
                  <div>
                    <h3>WhatsApp Priority Desk</h3>
                    <span className="contact-live-pill">
                      <span className="contact-pulse-dot"></span> Avg reply: &lt; 15 mins
                    </span>
                  </div>
                </div>
                <div className="contact-card-body">
                  <p>
                    Need an immediate design preview, price quote, or photo placement check? Chat
                    directly with our head artisan.
                  </p>
                  <a
                    href="https://wa.me/910000000000"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-action-link-btn whatsapp-style"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>Open Live WhatsApp Chat</span>
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
                    <h3>Direct Studio Call</h3>
                    <span style={{ fontSize: '0.8rem', color: '#718096' }}>
                      Mon - Sat: 9:00 AM - 7:00 PM IST
                    </span>
                  </div>
                </div>
                <div className="contact-card-body">
                  <p>
                    Speak with our customer support for urgent order modifications or special
                    shipping deadlines.
                  </p>
                  <a href="tel:+910000000000" className="contact-action-link-btn call-style">
                    <i className="fa-solid fa-phone"></i>
                    <span>Call (+91) 0000 000 000</span>
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
                    <h3>Mangalore Flagship Studio</h3>
                    <span style={{ fontSize: '0.8rem', color: '#718096' }}>Karnataka, India</span>
                  </div>
                </div>
                <div className="contact-card-body">
                  <p>
                    Our central production studio where design curation, laser engraving, UV printing,
                    and gift wrapping happen daily.
                  </p>
                  <div className="contact-address-list">
                    <div className="contact-address-item">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>Main Workshop &amp; Experience Studio, Mangalore, Karnataka, India</span>
                    </div>
                    <div className="contact-address-item">
                      <i className="fa-regular fa-clock"></i>
                      <span>Working Hours: Monday to Saturday, 9:00 AM to 7:00 PM IST</span>
                    </div>
                    <div className="contact-address-item">
                      <i className="fa-regular fa-envelope"></i>
                      <span>Official Mail: info@gift.com</span>
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
                    <h3>Corporate Gifting Solutions</h3>
                    <span style={{ fontSize: '0.8rem', color: '#718096' }}>GST Invoices &amp; Bulk Pricing</span>
                  </div>
                </div>
                <div className="contact-card-body">
                  <p>
                    Looking to order 50+ branded executive gifts, trophies, or festival hampers with
                    tax credit invoices?
                  </p>
                  <button
                    type="button"
                    className="contact-action-link-btn outline-style"
                    onClick={() => {
                      setInquiryType('corporate');
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                  >
                    <i className="fa-solid fa-file-invoice"></i>
                    <span>Request Corporate Catalog</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. WORKSHOP & NATIONWIDE DISPATCH SHOWCASE
          ───────────────────────────────────────────────────────────── */}
      <section className="contact-workshop-section">
        <div className="container">
          <div className="contact-workshop-card">
            <div className="contact-workshop-content">
              <h3>
                Handcrafted in Mangalore, <span>Loved Across India</span>
              </h3>
              <p>
                From coastal Karnataka to every corner of India, our dedicated packing team ensures
                that every delicate item arrives in pristine, ready-to-gift condition.
              </p>
              <div className="contact-workshop-perks">
                <div className="workshop-perk">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>19,000+ Pincodes Covered</span>
                </div>
                <div className="workshop-perk">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Zero-Plastic Cushioning</span>
                </div>
                <div className="workshop-perk">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Real-Time SMS &amp; Email Tracking</span>
                </div>
                <div className="workshop-perk">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Complimentary Greeting Cards</span>
                </div>
              </div>
            </div>

            <div className="contact-workshop-visual">
              <div className="contact-map-mockup">
                <div className="map-pin-badge">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>Fine Gift Studio Central Hub</span>
                </div>
                <div className="map-location-title">Mangalore, Karnataka, India</div>
                <p className="map-location-sub">
                  State-of-the-art laser engraving machines, high-resolution UV flatbed printers,
                  and hand-finishing inspection tables.
                </p>
                <div className="map-shipping-pills">
                  <span className="map-pill">🚀 Air Priority Dispatch</span>
                  <span className="map-pill">📦 Breakage-Free Guarantee</span>
                  <span className="map-pill">🕒 24-48h Fast Turnaround</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. FAQ ACCORDION
          ───────────────────────────────────────────────────────────── */}
      <section className="contact-faq-section">
        <div className="container">
          <div className="contact-faq-header">
            <h2>
              Frequently Asked <span>Questions</span>
            </h2>
            <p>Everything you need to know about custom crafting, delivery, and previews.</p>
          </div>

          <div className="contact-faq-list">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`faq-accordion-item ${isOpen ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-accordion-btn"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <i className="fa-solid fa-chevron-down"></i>
                  </button>
                  {isOpen && <div className="faq-accordion-body">{item.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
