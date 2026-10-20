import React from 'react';

export default function WhatsAppButton({ whatsappLink = '' }) {
  const defaultLink = 'https://wa.me/910000000000';
  const rawLink = whatsappLink || defaultLink;

  // Add a friendly greeting message if not already parameterized
  const finalHref = rawLink.includes('text=')
    ? rawLink
    : `${rawLink}${rawLink.includes('?') ? '&' : '?'}text=${encodeURIComponent(
        'Hi Fine Gift Studio! I would like to inquire about personalised gifts.'
      )}`;

  return (
    <a
      href={finalHref}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-btn"
      title="Chat on WhatsApp"
      aria-label="Chat with us on WhatsApp"
    >
      <i className="fa-brands fa-whatsapp"></i>
      <span className="floating-whatsapp-tooltip">Chat with us</span>
    </a>
  );
}
