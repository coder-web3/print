import React, { useState, useEffect } from 'react';
import './LegalPage.css';

export default function LegalPage({
  initialTab = 'terms', // 'terms' | 'privacy' | 'shipping' | 'returns'
  onNavigate = () => {}
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

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
          <a href="#home" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>Home</a>
          <span>/</span>
          <span className="current">
            {activeTab === 'terms'
              ? 'Terms & Conditions'
              : activeTab === 'privacy'
              ? 'Privacy Policy'
              : activeTab === 'shipping'
              ? 'Shipping Policy'
              : 'Return & Refund Policy'}
          </span>
        </div>

        {/* 1. Hero Header Banner */}
        <div className="legal-hero-banner">
          <div className="legal-badge-pill">
            <i className="fa-solid fa-scale-balanced"></i>
            <span>Official Legal Documentation</span>
          </div>

          <h1>
            {activeTab === 'terms' && 'Terms & Conditions of Service'}
            {activeTab === 'privacy' && 'Customer Privacy & Data Protection Policy'}
            {activeTab === 'shipping' && 'Shipping & Delivery Policy'}
            {activeTab === 'returns' && 'Cancellation, Return & Refund Policy'}
          </h1>

          <p>
            {activeTab === 'terms' &&
              'Please read these Terms & Conditions carefully before using our platform, placing customized orders, or requesting personalization services at Fine Gift Studio.'}
            {activeTab === 'privacy' &&
              'Your trust and memory privacy are sacred to us. Learn how Fine Gift Studio protects your uploaded photos, contact information, and payment transactions.'}
            {activeTab === 'shipping' &&
              'Transparent timeline, courier partners, pan-India delivery details, and express dispatch guidelines for all custom printed gifts.'}
            {activeTab === 'returns' &&
              'Our fair and customer-first guidelines regarding order modifications, defective item replacements, and refunds on personalized merchandise.'}
          </p>

          <div className="legal-last-updated">
            <i className="fa-regular fa-clock"></i>
            <span>Last Updated: October 10, 2026 • Effective Immediately</span>
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
            <span>Terms &amp; Conditions</span>
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
            <span>Privacy Policy</span>
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
            <span>Shipping Policy</span>
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
            <span>Return &amp; Refund</span>
          </button>
        </div>

        {/* 3. Document Content with Sticky Outline */}
        <div className="legal-content-grid">
          {/* Table of Contents Sidebar */}
          <aside className="legal-toc-card">
            <div className="legal-toc-title">
              <i className="fa-solid fa-list-ul"></i> Quick Navigation
            </div>

            {activeTab === 'terms' && (
              <ul className="legal-toc-list">
                <li><a href="#terms-1" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('terms-1'); }}>1. Acceptance &amp; Eligibility</a></li>
                <li><a href="#terms-2" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('terms-2'); }}>2. Custom Printing Guidelines</a></li>
                <li><a href="#terms-3" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('terms-3'); }}>3. Orders, Pricing &amp; Taxes</a></li>
                <li><a href="#terms-4" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('terms-4'); }}>4. Cancellation Window</a></li>
                <li><a href="#terms-5" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('terms-5'); }}>5. Intellectual Property</a></li>
                <li><a href="#terms-6" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('terms-6'); }}>6. Limitation of Liability</a></li>
                <li><a href="#terms-7" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('terms-7'); }}>7. Governing Law (Mangalore)</a></li>
              </ul>
            )}

            {activeTab === 'privacy' && (
              <ul className="legal-toc-list">
                <li><a href="#priv-1" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('priv-1'); }}>1. Information We Collect</a></li>
                <li><a href="#priv-2" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('priv-2'); }}>2. Uploaded Media &amp; Photo Privacy</a></li>
                <li><a href="#priv-3" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('priv-3'); }}>3. Purpose of Processing</a></li>
                <li><a href="#priv-4" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('priv-4'); }}>4. Third-Party Sharing</a></li>
                <li><a href="#priv-5" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('priv-5'); }}>5. Data Storage &amp; Security</a></li>
                <li><a href="#priv-6" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('priv-6'); }}>6. Your Privacy Rights</a></li>
                <li><a href="#priv-7" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('priv-7'); }}>7. Grievance Officer</a></li>
              </ul>
            )}

            {activeTab === 'shipping' && (
              <ul className="legal-toc-list">
                <li><a href="#ship-1" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('ship-1'); }}>1. Production Timelines</a></li>
                <li><a href="#ship-2" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('ship-2'); }}>2. Pan-India Delivery Partners</a></li>
                <li><a href="#ship-3" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('ship-3'); }}>3. Shipping Charges &amp; Free Tier</a></li>
                <li><a href="#ship-4" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('ship-4'); }}>4. Live AWB Tracking</a></li>
                <li><a href="#ship-5" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('ship-5'); }}>5. Delivery Delays &amp; Remote Zones</a></li>
              </ul>
            )}

            {activeTab === 'returns' && (
              <ul className="legal-toc-list">
                <li><a href="#ret-1" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('ret-1'); }}>1. Personalized Products Policy</a></li>
                <li><a href="#ret-2" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('ret-2'); }}>2. Transit Damage &amp; Print Errors</a></li>
                <li><a href="#ret-3" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('ret-3'); }}>3. Replacement Claims (48h Window)</a></li>
                <li><a href="#ret-4" className="legal-toc-link" onClick={(e) => { e.preventDefault(); scrollToSection('ret-4'); }}>4. Refund Processing Timelines</a></li>
              </ul>
            )}

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
            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB: TERMS & CONDITIONS                                 */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 'terms' && (
              <div>
                <section id="terms-1" className="legal-doc-section">
                  <h2><span className="sec-num">1.</span> Acceptance of Terms &amp; Eligibility</h2>
                  <p>
                    Welcome to <strong>Fine Gift Studio</strong> ("we," "our," "us"). By browsing our website,
                    creating a customer account, utilizing our personalized printing studio, or purchasing
                    products, you acknowledge that you have read, understood, and agree to be bound by these
                    Terms &amp; Conditions.
                  </p>
                  <p>
                    To place an order or create an account, you must be at least 18 years old or possess legal
                    parental/guardian consent under the laws of the Republic of India. If you are placing orders
                    on behalf of a business entity or corporate client, you warrant that you are authorized to bind
                    that organization.
                  </p>
                </section>

                <section id="terms-2" className="legal-doc-section">
                  <h2><span className="sec-num">2.</span> Custom Personalization &amp; Uploaded Media Policy</h2>
                  <p>
                    Fine Gift Studio specializes in tailored, made-to-order personalized gifts including ceramic mugs,
                    laser-engraved wooden frames, acrylic awards, custom apparel, and hampers.
                  </p>
                  <div className="legal-callout-box">
                    <h4><i className="fa-solid fa-triangle-exclamation"></i> Customer Quality Responsibility</h4>
                    <p>
                      Customers are responsible for the quality, spelling, text layout, and resolution of uploaded
                      photographs. While our design lab optimizes files prior to printing, we cannot be held liable
                      for blurry or pixelated results stemming from low-resolution source images provided by the customer.
                    </p>
                  </div>
                  <h3>Content Restrictions:</h3>
                  <p>
                    You agree not to submit or upload any media, text, or artwork that:
                  </p>
                  <ul>
                    <li>Infringes upon any third-party copyright, patent, trademark, or proprietary trade secrets.</li>
                    <li>Is defamatory, obscene, pornographic, harassing, hate-speech oriented, or unlawful under the Indian Information Technology Act, 2000.</li>
                    <li>Promotes illegal activities, violence, or harm against any individual or group.</li>
                  </ul>
                  <p>
                    We reserve the right to decline or cancel any custom printing order containing content that violates
                    our ethical standards.
                  </p>
                </section>

                <section id="terms-3" className="legal-doc-section">
                  <h2><span className="sec-num">3.</span> Orders, Pricing &amp; Payment Terms</h2>
                  <p>
                    All prices displayed on Fine Gift Studio are listed in <strong>Indian Rupees (INR)</strong> and
                    include applicable Goods and Services Tax (GST) unless explicitly noted during bulk corporate quotation.
                  </p>
                  <p>
                    We support major digital payment gateways including Unified Payments Interface (UPI - GPay, PhonePe, Paytm),
                    Net Banking across Indian banks, Visa, MasterCard, RuPay debit/credit cards, and Studio Wallet vouchers.
                    Payment must be received and verified before custom production begins.
                  </p>
                </section>

                <section id="terms-4" className="legal-doc-section">
                  <h2><span className="sec-num">4.</span> Order Cancellation &amp; Production Window</h2>
                  <p>
                    Because personalized items cannot be restocked or resold once manufactured:
                  </p>
                  <ul>
                    <li><strong>Cancellation Grace Period:</strong> You may request cancellation within <strong>2 hours</strong> of placing the order by reaching our hotline or support desk at info@gift.com.</li>
                    <li><strong>Post-Production:</strong> Once an order transitions to <em>"In Production"</em> (UV printing, laser engraving, or framing has begun), the order is non-cancellable and non-refundable.</li>
                  </ul>
                </section>

                <section id="terms-5" className="legal-doc-section">
                  <h2><span className="sec-num">5.</span> Intellectual Property Rights</h2>
                  <p>
                    All brand logos, graphics, typography, photography, user interface designs, and code across
                    Fine Gift Studio are the proprietary intellectual property of Fine Gift Studio. Reproduction or
                    unauthorized scraping of our catalog designs without written consent is strictly prohibited.
                  </p>
                  <p>
                    You retain ownership of any personal photographs and private memories you submit for printing. By
                    uploading them, you grant us a limited license strictly to print, package, and fulfill your order.
                  </p>
                </section>

                <section id="terms-6" className="legal-doc-section">
                  <h2><span className="sec-num">6.</span> Limitation of Liability</h2>
                  <p>
                    In no event shall Fine Gift Studio, its directors, employees, or artisans be liable for any indirect,
                    incidental, consequential, or punitive damages arising out of delays by third-party courier services,
                    unforeseen natural calamities, or incorrect customer delivery details. Our maximum aggregate liability
                    shall not exceed the total amount paid by you for the specific order in dispute.
                  </p>
                </section>

                <section id="terms-7" className="legal-doc-section">
                  <h2><span className="sec-num">7.</span> Governing Law &amp; Jurisdiction</h2>
                  <p>
                    These Terms &amp; Conditions are governed by and construed in accordance with the laws of the Republic of
                    India. Any legal disputes or claims arising hereunder shall be subject to the exclusive jurisdiction
                    of the competent courts situated in <strong>Mangalore, Karnataka, India</strong>.
                  </p>
                </section>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB: PRIVACY POLICY                                     */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 'privacy' && (
              <div>
                {/* Privacy Guarantee Box */}
                <div className="privacy-guarantee-banner">
                  <div className="privacy-guarantee-icon">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <div className="privacy-guarantee-text">
                    <h4>100% Confidential Memory Guarantee</h4>
                    <p>
                      Your personal photos, couple portraits, family memories, and engraved messages are used solely
                      to craft your physical merchandise. They are never shared, published, or sold to third parties.
                    </p>
                  </div>
                </div>

                <section id="priv-1" className="legal-doc-section">
                  <h2><span className="sec-num">1.</span> Information We Collect</h2>
                  <p>
                    To fulfill your gifting requirements and deliver memorable experiences, we collect the following categories
                    of information:
                  </p>
                  <ul>
                    <li><strong>Contact &amp; Account Details:</strong> Full Name, Email Address, Mobile Number, Account Password (securely hashed).</li>
                    <li><strong>Delivery Destinations:</strong> Recipient Name, Delivery Address, Landmark, City, Pincode, and contact numbers.</li>
                    <li><strong>Personalization Media:</strong> Uploaded images, custom texts, names, dates, and message notes intended for printing or engraving.</li>
                    <li><strong>Transaction Records:</strong> Order IDs, amounts paid, payment confirmation hashes, and coupon redemptions. (We never store debit/credit card CVVs or net banking passwords).</li>
                    <li><strong>Technical Device Data:</strong> IP address, device type, browser metadata, and cookie tokens for cart persistence.</li>
                  </ul>
                </section>

                <section id="priv-2" className="legal-doc-section">
                  <h2><span className="sec-num">2.</span> Uploaded Media &amp; Photo Protection</h2>
                  <p>
                    We recognize that personal photographs sent for custom mugs, acrylic frames, or photo albums are deeply
                    intimate. We enforce strict data handling safeguards:
                  </p>
                  <ul>
                    <li>Uploaded media files are stored in encrypted, access-restricted cloud vaults.</li>
                    <li>Only certified production technicians access image files to calibrate print machinery.</li>
                    <li>Temporary production image caches are purged periodically after order delivery confirmation.</li>
                  </ul>
                </section>

                <section id="priv-3" className="legal-doc-section">
                  <h2><span className="sec-num">3.</span> How We Use Your Information</h2>
                  <p>We process your data strictly for legitimate operational purposes:</p>
                  <ul>
                    <li>Manufacturing, quality-inspecting, and packaging your custom gifts.</li>
                    <li>Coordinating with express shipping partners for real-time delivery and SMS/WhatsApp AWB tracking updates.</li>
                    <li>Issuing official tax invoices and facilitating customer support inquiries.</li>
                    <li>Sending celebratory birthday/anniversary gift vouchers (you can opt out with one click anytime).</li>
                  </ul>
                </section>

                <section id="priv-4" className="legal-doc-section">
                  <h2><span className="sec-num">4.</span> Third-Party Service Providers</h2>
                  <p>
                    We share only necessary subsets of data with trusted service providers:
                  </p>
                  <ul>
                    <li><strong>Logistics Partners:</strong> BlueDart, Delhivery, DTDC, and India Post receive delivery address, recipient name, and phone number for shipment dispatch.</li>
                    <li><strong>Payment Gateways:</strong> PCI-DSS compliant Indian payment aggregators (e.g. Razorpay, UPI) to securely process prepaid orders.</li>
                    <li><strong>Communication APIs:</strong> Transactional SMS and email notification relays for order receipts.</li>
                  </ul>
                </section>

                <section id="priv-5" className="legal-doc-section">
                  <h2><span className="sec-num">5.</span> Data Security &amp; Encryption Standards</h2>
                  <p>
                    Our website is fortified with 256-bit SSL (Secure Socket Layer) encryption. All data transferred between your
                    browser and our servers is encrypted in transit and at rest. Security audits and firewall reviews are conducted
                    routinely to prevent unauthorized access.
                  </p>
                </section>

                <section id="priv-6" className="legal-doc-section">
                  <h2><span className="sec-num">6.</span> Your Privacy Rights &amp; Choices</h2>
                  <p>
                    Under Indian privacy laws and international best practices, you have the right to:
                  </p>
                  <ul>
                    <li>Access and inspect your personal profile details directly through the User Dashboard.</li>
                    <li>Update, modify, or correct your stored delivery addresses and phone numbers.</li>
                    <li>Request total erasure of your customer account and uploaded assets by emailing our compliance team.</li>
                    <li>Unsubscribe from promotional emails or gifting reminders at any time.</li>
                  </ul>
                </section>

                <section id="priv-7" className="legal-doc-section">
                  <h2><span className="sec-num">7.</span> Grievance Officer &amp; Contact Information</h2>
                  <p>
                    In accordance with the Information Technology Act, 2000 and the Rules made thereunder, the contact details
                    of our designated Grievance Officer are provided below:
                  </p>
                  <div className="legal-callout-box" style={{ background: '#f8fafc', borderColor: '#475569' }}>
                    <h4 style={{ color: '#0f172a' }}>Grievance Officer: Customer Redressal Team</h4>
                    <p style={{ color: '#334155' }}>
                      <strong>Fine Gift Studio</strong><br />
                      Address: Hampankatta / Kadri Hills, Mangalore, Karnataka - 575001, India<br />
                      Email: <a href="mailto:info@gift.com" style={{ color: '#b8005b', fontWeight: 700 }}>info@gift.com</a><br />
                      Direct Telephone: <strong>+91 0000 000 000</strong> (Mon - Sat: 9:00 AM - 7:00 PM IST)
                    </p>
                  </div>
                </section>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB: SHIPPING POLICY                                    */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 'shipping' && (
              <div>
                <section id="ship-1" className="legal-doc-section">
                  <h2><span className="sec-num">1.</span> Handcrafted Production Timelines</h2>
                  <p>
                    Unlike mass-manufactured goods, each item at Fine Gift Studio is individually printed, engraved,
                    and packaged. Production turnaround is typically <strong>1 to 2 business days</strong> following
                    payment verification and design confirmation.
                  </p>
                </section>

                <section id="ship-2" className="legal-doc-section">
                  <h2><span className="sec-num">2.</span> Pan-India Delivery Partners</h2>
                  <p>
                    We partner with India's premier courier networks (BlueDart, Delhivery, DTDC, Express Cargo) to ensure
                    your fragile gifts arrive securely. Standard transit timelines:
                  </p>
                  <ul>
                    <li><strong>Karnataka &amp; South India Metros:</strong> 2 to 3 business days post-dispatch.</li>
                    <li><strong>Rest of India (Metro Cities):</strong> 3 to 5 business days post-dispatch.</li>
                    <li><strong>Remote &amp; Northeast Regions:</strong> 5 to 7 business days.</li>
                  </ul>
                </section>

                <section id="ship-3" className="legal-doc-section">
                  <h2><span className="sec-num">3.</span> Shipping Charges &amp; Free Tier</h2>
                  <p>
                    We offer standard delivery starting at a nominal flat fee of ₹49 for small gifts. Orders exceeding
                    <strong> ₹999</strong> qualify for <strong>100% Free Express Shipping</strong> automatically at checkout.
                  </p>
                </section>

                <section id="ship-4" className="legal-doc-section">
                  <h2><span className="sec-num">4.</span> Live AWB Tracking</h2>
                  <p>
                    Once dispatched, you will receive an automated tracking notification via SMS/Email containing your
                    Airway Bill (AWB) number. You can also monitor real-time tracking updates directly in your User Dashboard.
                  </p>
                </section>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TAB: RETURN & REFUND POLICY                             */}
            {/* ═══════════════════════════════════════════════════════ */}
            {activeTab === 'returns' && (
              <div>
                <section id="ret-1" className="legal-doc-section">
                  <h2><span className="sec-num">1.</span> Personalized Merchandise Guidelines</h2>
                  <p>
                    Customized gifts carrying individual names, personal photographs, or dates cannot be restocked or
                    resold. As such, standard "change of mind" returns are not permitted once goods have been delivered.
                  </p>
                </section>

                <section id="ret-2" className="legal-doc-section">
                  <h2><span className="sec-num">2.</span> Damage in Transit &amp; Print Defects</h2>
                  <p>
                    We stand firmly behind our artisanal quality. If your parcel arrives broken, cracked, defective,
                    or displays a printing error made by our lab (such as a spelling mistake differing from your submitted
                    order), we will issue an <strong>immediate 100% free replacement</strong>.
                  </p>
                </section>

                <section id="ret-3" className="legal-doc-section">
                  <h2><span className="sec-num">3.</span> How to Report a Claim (48-Hour Window)</h2>
                  <p>To qualify for a prompt replacement or refund:</p>
                  <ol>
                    <li>Notify our support team within <strong>48 hours</strong> of package delivery.</li>
                    <li>Share clear photos or a brief unboxing video illustrating the transit damage or defect to <a href="mailto:info@gift.com" style={{ color: '#b8005b', fontWeight: 700 }}>info@gift.com</a> or WhatsApp (+91 0000 000 000).</li>
                    <li>Our team will inspect the claim and dispatch a brand-new replacement within 24 hours.</li>
                  </ol>
                </section>

                <section id="ret-4" className="legal-doc-section">
                  <h2><span className="sec-num">4.</span> Refund Processing Timelines</h2>
                  <p>
                    Where a replacement is not feasible or in case of duplicate charges, approved refunds are credited back
                    to your original payment source (Bank Account, UPI, or Credit Card) within <strong>5 to 7 business days</strong>.
                  </p>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
