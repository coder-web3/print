/**
 * Default Header & Footer Content & Sections Schema
 * Used for Header & Footer CMS in Admin Dashboard and fallback on storefront.
 */

import logoImg from '../assets/Gift-Studio-Logo.webp';
import footerCtaImg from '../assets/images/footer-cta-img.avif';

export const DEFAULT_HEADER_FOOTER_CONTENT = {
  header: {
    visibility: {
      topBar: true,
      socialIcons: true,
      helpLink: true,
      trackLink: false,
      uspStrip: true,
    },
    topBar: {
      usp1: 'Unique Gifts for Every Occasion',
      usp2: 'Custom Design',
      usp3: 'Premium Quality',
      usp4: 'Fast Delivery',
      trackOrderText: 'Track Order',
      helpText: 'Help',
    },
    socialLinks: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      pinterest: 'https://pinterest.com',
      youtube: 'https://youtube.com',
      whatsapp: 'https://wa.me/910000000000',
    },
    brand: {
      logoUrl: '',
      logoAlt: 'Fine Gift Studio',
      title: '+FINE GIFT STUDIO',
      subtitle: '— PRINT YOUR IDEAS —',
    },
    search: {
      placeholder: 'Search for personalised gifts...',
    },
    contact: {
      phone: '+91 0000 000 000',
      phoneLink: 'tel:+910000000000',
      whatsapp: '910000000000',
      whatsappLink: 'https://wa.me/910000000000',
      email: 'info@gift.com',
      emailLink: 'mailto:info@gift.com',
    },
  },
  footer: {
    visibility: {
      expressBanner: true,
      instagramSection: true,
      newsletter: true,
      contactInfo: true,
      socialRow: true,
      showcaseImage: true,
      brandBio: true,
    },
    expressBanner: {
      tag: 'NEED IT URGENTLY?',
      title: 'We Also Offer',
      highlightTitle: 'Express Delivery',
      desc: 'For special occasions and last minute gifts.',
      btnText: 'Contact Us Now',
      btnLink: '/contact',
      feature1Title: 'Fast & Reliable',
      feature1Subtitle: 'Get it on time',
      feature2Title: 'Perfect for',
      feature2Subtitle: 'Special Occasions',
      feature3Title: 'Safe & Secure',
      feature3Subtitle: 'Delivery',
    },
    instagramSection: {
      tag: 'FOLLOW US ON',
      title: 'Instagram',
      desc: 'Get inspired with our latest gifts, custom designs and happy moments.',
      handle: '@finegiftstudio',
      handleLink: 'https://instagram.com',
      posts: [
        {
          id: 1,
          name: 'LED Heart Photo Lamp',
          image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80',
          link: 'https://instagram.com',
        },
        {
          id: 2,
          name: 'Custom Photo Mug',
          image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=300&q=80',
          link: 'https://instagram.com',
        },
        {
          id: 3,
          name: 'Monogram Leather Keychain',
          image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=300&q=80',
          link: 'https://instagram.com',
        },
        {
          id: 4,
          name: 'Wooden Couple Frame',
          image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=300&q=80',
          link: 'https://instagram.com',
        },
        {
          id: 5,
          name: 'Custom Water Bottle',
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=300&q=80',
          link: 'https://instagram.com',
        },
        {
          id: 6,
          name: 'Good Vibes T-Shirt',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80',
          link: 'https://instagram.com',
        },
      ],
    },
    newsletter: {
      title: 'Stay Updated',
      desc: 'Subscribe to get latest offers, new products and gift ideas.',
      placeholder: 'Your email address',
      btnText: 'Subscribe',
    },
    brand: {
      logoUrl: '',
      bioText:
        'Your one-stop destination for customised gifts. We turn your ideas into meaningful and memorable products.',
      showcaseImgUrl: '',
    },
    socialLinks: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com',
      pinterest: 'https://pinterest.com',
      whatsapp: 'https://whatsapp.com',
    },
    contactInfo: {
      address: 'Mangalore, Karnataka, India',
      phone: '+91 0000 000 000',
      phoneLink: 'tel:+910000000000',
      email: 'info@gift.com',
      emailLink: 'mailto:info@gift.com',
      hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    },
    bottomBar: {
      copyrightText: '© 2026 Fine Gift Studio. All rights reserved.',
      loveBadgeText: 'Made with ❤️ for Special Moments',
    },
  },
};
