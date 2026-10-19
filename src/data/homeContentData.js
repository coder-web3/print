// ==========================================================================
// FINE GIFT STUDIO — HOMEPAGE CMS DEFAULT CONTENT STRUCTURE
// Serves as single source of truth for all editable homepage sections
// ==========================================================================

export const DEFAULT_HOME_CONTENT = {
  // Global Section Visibility Toggles
  visibility: {
    hero: true,
    categoryStrip: true,
    featuredCategories: true,
    promoBanners: true,
    occasionBanner: true,
    dealsOfDay: true,
    discountBanner: true,
    whyChoose: true,
    productLists: true,
    testimonials: true
  },

  // 1. Hero Carousel (3 Slides)
  hero: {
    slides: [
      {
        id: 'hero1',
        subtitle: 'PERSONALISED GIFTS',
        titleMain: 'Make Every',
        titleHighlight: 'Moment Special',
        description: 'Custom gifts for your loved ones – made with creativity, care and a personal touch.',
        ctaText: 'Shop Custom Gifts',
        ctaLink: '/shop?cat=tshirts',
        badgeTag: 'T-SHIRTS DESIGN',
        badgeIcon: 'fa-solid fa-shirt',
        count: '12K+',
        countLabel: 'TEMPLATE',
        image: '/assets/images/hero1.avif',
        tagClass: 'tag-dark'
      },
      {
        id: 'hero2',
        subtitle: 'CUSTOM PACKAGING & GIFT BOXES',
        titleMain: 'Luxury Custom',
        titleHighlight: 'Packaging Boxes',
        description: 'Premium branded boxes, rigid gift packaging and bespoke presentation crafted for every special delivery.',
        ctaText: 'Explore Packaging',
        ctaLink: '/shop?cat=packaging',
        badgeTag: 'PACKAGING BOX',
        badgeIcon: 'fa-solid fa-box-open',
        count: '18K+',
        countLabel: 'TEMPLATE',
        image: '/assets/images/hero2.avif',
        tagClass: 'tag-gray'
      },
      {
        id: 'hero3',
        subtitle: 'PHOTO MUGS & DRINKWARE',
        titleMain: 'Personalised',
        titleHighlight: 'Cups & Mug Designs',
        description: 'Ceramic photo mugs, insulated tumblers and magic drinkware to bring everyday warmth with every sip.',
        ctaText: 'Shop Mugs & Bottles',
        ctaLink: '/shop?cat=mugs',
        badgeTag: 'CUPS & MUG DESIGN',
        badgeIcon: 'fa-solid fa-mug-hot',
        count: '10K+',
        countLabel: 'TEMPLATE',
        image: '/assets/images/hero3.avif',
        tagClass: 'tag-magenta'
      }
    ]
  },

  // 2. Category Strip
  categoryStrip: {
    tag: 'EXPLORE BY THEME',
    heading: 'Curated Gift Categories'
  },

  // 3. Featured Categories
  featuredCategories: {
    subtitle: 'EXPLORE OUR COLLECTION',
    titleMain: 'Featured',
    titleHighlight: 'Categories',
    description: 'Discover thoughtful and personalised gifts for every occasion.'
  },

  // 4. Promo Banners (3 Cards)
  promoBanners: {
    card1: {
      badge: 'FREE DESIGN SERVICE',
      title: 'Free Expert',
      highlight: 'Art',
      titleEnd: 'Design',
      desc: 'Our professional designers will create perfect artwork for your personalised gifts – completely free.',
      btnText: 'Shop Now',
      btnLink: '/shop?promo=free-design'
    },
    card2: {
      badge: 'PREVIEW BEFORE YOU ORDER',
      title: 'Realistic 3D',
      highlight: 'Mockup',
      titleEnd: 'Design',
      desc: 'See exactly how your personalised gift will look with our instant high-fidelity 3D digital mockups.',
      btnText: 'Explore Mockups',
      btnLink: '/shop?promo=mockup'
    },
    card3: {
      badge: 'SPEED & PRECISION',
      title: 'Express 24H',
      highlight: 'Laser',
      titleEnd: 'Engraving',
      desc: 'High-speed fiber laser etching for stainless steel, wood, and leather items delivered on time.',
      btnText: 'Shop Engravings',
      btnLink: '/shop?promo=express'
    }
  },

  // 4B. Occasion Feature Banner (e.g. Engagement Gifts) - Rendered Before Deals of the Day
  occasionBanner: {
    tag: 'GIFTS BY OCCASION',
    titleMain: 'Engagement',
    titleHighlight: 'Gifts',
    desc: 'Celebrate their new beginning with thoughtful, personalised gifts that make their engagement journey even more special.',
    btnText: 'View Details',
    btnLink: '/engagement-gifts',
    image: '/assets/images/engagement-gifts-banner.png',
    alt: 'Engagement Gifts - Celebrate their new beginning'
  },

  // 5. Deals of the Day
  dealsOfDay: {
    subtitle: 'LIMITED TIME OFFERS',
    titleMain: 'Deals Of The',
    titleHighlight: 'Day',
    description: 'Grab your favourite products at special prices. Limited time only!'
  },

  // 6. Weekend Discount Banner
  discountBanner: {
    pillLabel: 'Weekend Discount',
    titleMain: 'Feel-Good Shopping',
    titleHighlight: 'Up To 50% Off',
    description: 'Customized gifts, photo prints, personalized accessories and much more directly delivered.',
    btnText: 'Shop Now',
    fromPrice: '₹199'
  },

  // 7. Why Choose Fine Gift Studio & Corporate Bulk Gifts
  whyChoose: {
    tag: 'WHY CHOOSE',
    titleMain: 'Fine',
    titleHighlight: 'Gift Studio?',
    description: 'We create personalised gifts that bring smiles, memories and emotions closer to your heart.',
    features: [
      { id: 1, icon: 'fa-solid fa-wand-magic-sparkles', title: 'Unique Custom Designs', subtitle: 'Made just for you' },
      { id: 2, icon: 'fa-solid fa-shield-halved', title: 'High Quality Materials', subtitle: 'Long-lasting & premium' },
      { id: 3, icon: 'fa-solid fa-gift', title: 'Wide Range of Products', subtitle: 'Gifts for every occasion' },
      { id: 4, icon: 'fa-solid fa-truck-fast', title: 'Fast & Reliable Delivery', subtitle: 'Safe and on time' },
      { id: 5, icon: 'fa-solid fa-user-group', title: 'Bulk & Corporate Orders', subtitle: 'Special pricing available' }
    ],
    corporate: {
      tag: 'FOR BUSINESSES & EVENTS',
      titleMain: 'Corporate &',
      titleHighlight: 'Bulk Gifts',
      description: 'Custom gifts for your business, team and special events.',
      btnText: 'Get a Bulk Quote',
      btnLink: '/contact?type=corporate'
    }
  },

  // 8. Product Lists (Collection Columns)
  productLists: {
    col1Title: 'New Collection',
    col2Title: 'Top Rated',
    col3Title: 'Best Sellers'
  },

  // 9. Testimonials
  testimonials: {
    tag: 'HAPPY CUSTOMERS',
    titleMain: 'What People Say',
    titleHighlight: 'About Us',
    description: 'Real stories and reviews from our valued customers across India.'
  }
};
