/**
 * Default Contact Us Page Content & Sections Schema
 * Used for Contact Page CMS in Admin Dashboard and fallback on storefront.
 */

export const DEFAULT_CONTACT_CONTENT = {
  visibility: {
    hero: true,
    channels: true,
    form: true,
    sidebar: true,
    workshop: true,
  },
  hero: {
    eyebrow: 'Studio Concierge Online',
    title: 'Let’s Craft Something',
    highlightTitle: 'Extraordinary Together.',
    subtitle: 'Have a custom gifting vision, corporate branding project, or need immediate assistance? Our Mangalore artisan team is dedicated to turning your ideas into memorable keepsakes.',
  },
  channels: {
    phoneLabel: 'Direct Hotline',
    phoneVal: '+91 0000 000 000',
    phoneLink: 'tel:+910000000000',

    whatsappLabel: 'WhatsApp Live',
    whatsappVal: 'Chat with Artisan',
    whatsappLink: 'https://wa.me/910000000000',

    emailLabel: 'Official Email',
    emailVal: 'info@gift.com',
    emailLink: 'mailto:info@gift.com',

    workshopLabel: 'Artisan Workshop',
    workshopVal: 'Mangalore, Karnataka',
  },
  form: {
    title: 'Send an Artisan Inquiry',
    subtitle: 'Fill out your details below and our team will get back to you with custom options, pricing, and preview mockups within 2 hours.',
    typesLabel: 'What can we help you create?',
    privacyNote: 'Your details are 100% confidential. No spam ever.',
    prompts: [
      'Custom wooden engraved frame with photo',
      'Personalized ceramic coffee mugs with name',
      'Corporate employee welcome kit with company logo',
      'Bespoke leather wallet and metallic pen set',
    ],
  },
  sidebar: {
    whatsapp: {
      title: 'WhatsApp Priority Desk',
      badge: 'Avg reply: < 15 mins',
      desc: 'Need an immediate design preview, price quote, or photo placement check? Chat directly with our head artisan.',
      btnText: 'Open Live WhatsApp Chat',
      link: 'https://wa.me/910000000000',
    },
    call: {
      title: 'Direct Studio Call',
      hours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
      desc: 'Speak with our customer support for urgent order modifications or special shipping deadlines.',
      btnText: 'Call (+91) 0000 000 000',
      link: 'tel:+910000000000',
    },
    studio: {
      title: 'Mangalore Flagship Studio',
      location: 'Karnataka, India',
      desc: 'Our central production studio where design curation, laser engraving, UV printing, and gift wrapping happen daily.',
      address: 'Main Workshop & Experience Studio, Mangalore, Karnataka, India',
      hours: 'Working Hours: Monday to Saturday, 9:00 AM to 7:00 PM IST',
      email: 'Official Mail: info@gift.com',
    },
    corporate: {
      title: 'Corporate Gifting Solutions',
      subtitle: 'GST Invoices & Bulk Pricing',
      desc: 'Looking to order 50+ branded executive gifts, trophies, or festival hampers with tax credit invoices?',
      btnText: 'Request Corporate Catalog',
    },
  },
  workshop: {
    title: 'Handcrafted in Mangalore,',
    highlightTitle: 'Loved Across India',
    desc: 'From coastal Karnataka to every corner of India, our dedicated packing team ensures that every delicate item arrives in pristine, ready-to-gift condition.',
    perks: [
      '19,000+ Pincodes Covered',
      'Zero-Plastic Cushioning',
      'Real-Time SMS & Email Tracking',
      'Complimentary Greeting Cards',
    ],
    mapBadge: 'Fine Gift Studio Central Hub',
    mapLocation: 'Mangalore, Karnataka, India',
    mapSub: 'State-of-the-art laser engraving machines, high-resolution UV flatbed printers, and hand-finishing inspection tables.',
    pills: [
      '🚀 Air Priority Dispatch',
      '📦 Breakage-Free Guarantee',
      '🕒 24-48h Fast Turnaround',
    ],
  },
};
