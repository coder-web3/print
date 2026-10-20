/**
 * Default Header & Footer Content & Sections Schema
 * Used for Header & Footer CMS in Admin Dashboard and fallback on storefront.
 */

import logoImg from '../assets/Gift-Studio-Logo.webp';
import footerCtaImg from '../assets/images/footer-cta-img.avif';

export const DEFAULT_HEADER_NAV_ITEMS = [
  { id: 'nav_home', label: 'Home', path: '/', icon: 'fa-solid fa-house', type: 'link', visible: true },
  { id: 'nav_shop', label: 'Shop', path: '/shop', icon: 'fa-solid fa-bag-shopping', type: 'link', visible: true },
  { id: 'nav_custom', label: 'Custom Design', path: '/shop?filter=custom', icon: 'fa-solid fa-wand-magic-sparkles', type: 'link', visible: true },
  { id: 'nav_occasion', label: 'Gifts by Occasion', path: '#occasion', icon: 'fa-solid fa-gift', type: 'dropdown-occasion', visible: true },
  { id: 'nav_category', label: 'Gifts by Category', path: '#category', icon: 'fa-solid fa-table-cells-large', type: 'dropdown-category', visible: true },
  { id: 'nav_corporate', label: 'Bulk/Corporate Gifts', path: '#corporate', icon: 'fa-solid fa-briefcase', type: 'dropdown-corporate', visible: true },
  { id: 'nav_about', label: 'About Us', path: '/about-us', icon: 'fa-solid fa-users', type: 'link', visible: true },
  { id: 'nav_blog', label: 'Blog', path: '/blog', icon: 'fa-solid fa-newspaper', type: 'link', visible: true },
  { id: 'nav_contact', label: 'Contact Us', path: '/contact', icon: 'fa-solid fa-phone', type: 'dropdown-contact', visible: true }
];

export const DEFAULT_FOOTER_QUICK_LINKS = {
  title: 'Quick Links',
  links: [
    { id: 'fql_1', label: 'Home', url: '/' },
    { id: 'fql_2', label: 'Shop', url: '/shop' },
    { id: 'fql_3', label: 'About Us', url: '/about-us' },
    { id: 'fql_4', label: 'Our Blog', url: '/blog' },
    { id: 'fql_5', label: 'Contact Us', url: '/contact' }
  ]
};

export const DEFAULT_FOOTER_CUSTOMER_SUPPORT = {
  title: 'Customer Support',
  links: [
    { id: 'fcs_1', label: 'Shipping Policy', url: '/shipping' },
    { id: 'fcs_2', label: 'Return & Refund', url: '/returns' },
    { id: 'fcs_3', label: 'FAQs', url: '/contact' },
    { id: 'fcs_4', label: 'Help Center', url: '/contact' }
  ]
};

export const DEFAULT_OCCASION_MENU_DATA = {
  sections: [
    {
      id: 'occ_sec_1',
      heading: 'Romantic',
      links: [
        { id: 'occ_l_1', name: 'Engagement Gifts', url: '/engagement-gifts' },
        { id: 'occ_l_2', name: "Valentine's Day", url: '/shop?cat=valentines' },
        { id: 'occ_l_3', name: 'Proposals', url: '/shop?cat=proposals' },
        { id: 'occ_l_4', name: 'Date Nights', url: '/shop?cat=date-nights' }
      ]
    },
    {
      id: 'occ_sec_2',
      heading: 'Family Events',
      links: [
        { id: 'occ_l_5', name: "Mother's Day", url: '/shop?cat=mothers-day' },
        { id: 'occ_l_6', name: "Father's Day", url: '/shop?cat=fathers-day' },
        { id: 'occ_l_7', name: 'Baby Showers', url: '/shop?cat=baby-showers' }
      ]
    },
    {
      id: 'occ_sec_3',
      heading: 'Celebrations',
      links: [
        { id: 'occ_l_8', name: 'Housewarming', url: '/shop?cat=housewarming' },
        { id: 'occ_l_9', name: 'Graduation', url: '/shop?cat=graduation' },
        { id: 'occ_l_10', name: 'Retirement', url: '/shop?cat=retirement' }
      ]
    },
    {
      id: 'occ_sec_4',
      heading: 'Festivals',
      links: [
        { id: 'occ_l_11', name: 'Christmas', url: '/shop?cat=christmas' },
        { id: 'occ_l_12', name: 'New Year', url: '/shop?cat=new-year' },
        { id: 'occ_l_13', name: 'Diwali / Eid', url: '/shop?cat=festivals' }
      ]
    }
  ]
};

export const DEFAULT_CORPORATE_MENU_DATA = {
  links: [
    { id: 'corp_1', label: 'Bulk Order Discounts', url: '/category/Corporate%20Gifts', icon: 'fa-solid fa-box-open' },
    { id: 'corp_2', label: 'Company Logo Branding', url: '/contact?type=corporate', icon: 'fa-solid fa-building' },
    { id: 'corp_3', label: 'Executive Gift Hampers', url: '/category/Corporate%20Gifts', icon: 'fa-solid fa-gifts' },
    { id: 'corp_4', label: 'Request Instant RFQ Quote', url: '/contact?type=corporate', icon: 'fa-solid fa-file-invoice' }
  ]
};

export const DEFAULT_HEADER_FOOTER_CONTENT = {
  header: {
    visibility: {
      topBar: true,
      socialIcons: true,
      helpLink: true,
      trackLink: false,
      uspStrip: true,
    },
    navItems: DEFAULT_HEADER_NAV_ITEMS,
    occasionMenu: DEFAULT_OCCASION_MENU_DATA,
    corporateMenu: DEFAULT_CORPORATE_MENU_DATA,
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
    quickLinks: DEFAULT_FOOTER_QUICK_LINKS,
    customerSupport: DEFAULT_FOOTER_CUSTOMER_SUPPORT,
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
