// ==========================================================================
// FINE GIFT STUDIO — OCCASIONS CMS DATA STRUCTURE
// Supports customizable Occasion Detail Pages & Home Feature Banner Linking
// ==========================================================================

export const DEFAULT_OCCASION_DATA = {
  id: 'engagement-gifts',
  slug: 'engagement-gifts',
  name: 'Engagement Gifts',
  badge: 'GIFTS BY OCCASION',
  isHomeBanner: true, // Marked as the featured home banner
  status: 'active', // 'active' | 'draft'

  // 1. Hero Section
  hero: {
    tagline: 'CELEBRATE TOGETHERNESS',
    titleMain: 'Engagement',
    titleHighlight: 'Gifts',
    description: 'Thoughtful and personalised gifts to celebrate a beautiful new beginning.',
    ctaText: 'Explore Collection',
    image: '/assets/images/engagement-gifts-banner.png',
    floatingQuote: 'Two Hearts One Beautiful Journey',
    features: [
      { icon: '🌸', text: 'Personalised Gifts' },
      { icon: '💎', text: 'Premium Quality' },
      { icon: '🚀', text: 'Fast Delivery' }
    ]
  },

  // 2. Quick Category Filter Pills
  filterPills: [
    { id: 'all', label: 'All Engagement Gifts', icon: 'fa-solid fa-shapes' },
    { id: 'photo', label: 'Photo Gifts', icon: 'fa-solid fa-image' },
    { id: 'couple', label: 'Couple Gifts', icon: 'fa-solid fa-heart' },
    { id: 'decor', label: 'Home Decor', icon: 'fa-solid fa-house-chimney-window' },
    { id: 'hampers', label: 'Custom Hampers', icon: 'fa-solid fa-basket-shopping' },
    { id: 'led', label: 'LED Gifts', icon: 'fa-solid fa-lightbulb' },
    { id: 'jewelry', label: 'Jewelry Boxes', icon: 'fa-solid fa-ring' },
    { id: 'mugs', label: 'Mugs & Drinkware', icon: 'fa-solid fa-mug-hot' },
    { id: 'apparel', label: 'Apparel', icon: 'fa-solid fa-shirt' }
  ],

  // 3. Popular Gifts Showcase
  popularGifts: {
    tagline: 'TRENDING NOW —',
    heading: 'Popular Engagement Gifts',
    subtitle: 'Make their special moment even more memorable with our handpicked gifts.',
    viewAllLink: '/shop?cat=gifts',
    items: [
      {
        id: 'eng_pop_1',
        name: 'Personalised Couple Photoframe',
        price: 999,
        originalPrice: 1299,
        rating: 4.9,
        reviews: 120,
        image: '/assets/images/frames.avif',
        category: 'photo'
      },
      {
        id: 'eng_pop_2',
        name: 'Engraved LED Lamp',
        price: 699,
        originalPrice: 900,
        rating: 4.8,
        reviews: 95,
        image: '/assets/images/lamps.avif',
        category: 'led'
      },
      {
        id: 'eng_pop_3',
        name: 'Crafted Couple Mugs',
        price: 459,
        originalPrice: 599,
        rating: 4.7,
        reviews: 86,
        image: '/assets/images/cups-product.avif',
        category: 'mugs'
      },
      {
        id: 'eng_pop_4',
        name: 'Personalised Gift Hamper',
        price: 1499,
        originalPrice: 1899,
        rating: 4.9,
        reviews: 110,
        image: '/assets/images/packaging.avif',
        category: 'hampers'
      },
      {
        id: 'eng_pop_5',
        name: 'Engagement Memory Book',
        price: 899,
        originalPrice: 1099,
        rating: 4.8,
        reviews: 74,
        image: '/assets/images/gifts.avif',
        category: 'photo'
      }
    ]
  },

  // 4. Mid Feature Hamper Banner
  midHamperBanner: {
    tagline: 'MAKE IT EXTRA SPECIAL',
    titleMain: 'Personalised',
    titleHighlight: 'Engagement Hampers',
    description: 'Curated with love, made for their new beginning.',
    ctaText: 'Shop Hampers',
    ctaLink: '/shop?cat=packaging',
    image: '/assets/images/packaging.avif',
    floatBadge: 'Happy Engagement ❤️',
    features: [
      { icon: '🎁', text: 'Customised Gifts' },
      { icon: '📦', text: 'Premium Packaging' },
      { icon: '🎀', text: 'Wide Range of Options' },
      { icon: '⚡', text: 'Fast & Reliable Delivery' }
    ]
  },

  // 5. Gifts for Him
  giftsForHim: {
    heading: 'Gifts for Him',
    subtitle: "Thoughtful gifts he'll always cherish.",
    viewAllLink: '/shop?search=him',
    items: [
      {
        id: 'eng_him_1',
        name: 'Personalised Wallet',
        price: 799,
        originalPrice: 1099,
        rating: 4.8,
        reviews: 64,
        image: '/assets/images/wallets.avif',
        category: 'couple'
      },
      {
        id: 'eng_him_2',
        name: 'Custom T-Shirt',
        price: 599,
        originalPrice: 799,
        rating: 4.7,
        reviews: 52,
        image: '/assets/images/t-shirt.avif',
        category: 'apparel'
      },
      {
        id: 'eng_him_3',
        name: 'Engraved Keychain',
        price: 399,
        originalPrice: 520,
        rating: 4.8,
        reviews: 91,
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80',
        category: 'couple'
      },
      {
        id: 'eng_him_4',
        name: 'Groom To Be Mug',
        price: 499,
        originalPrice: 650,
        rating: 4.6,
        reviews: 40,
        image: '/assets/images/cups-product.avif',
        category: 'mugs'
      },
      {
        id: 'eng_him_5',
        name: 'Personalised Perfume Box',
        price: 1299,
        originalPrice: 1599,
        rating: 4.7,
        reviews: 38,
        image: '/assets/images/corporate-gifts.avif',
        category: 'hampers'
      }
    ]
  },

  // 6. Gifts for Her
  giftsForHer: {
    heading: 'Gifts for Her',
    subtitle: 'Elegant personalised gifts she will fall in love with.',
    viewAllLink: '/shop?search=her',
    items: [
      {
        id: 'eng_her_1',
        name: 'Custom Jewellery Box',
        price: 1099,
        originalPrice: 1399,
        rating: 4.9,
        reviews: 88,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
        category: 'jewelry'
      },
      {
        id: 'eng_her_2',
        name: 'Personalised Photo Lamp',
        price: 799,
        originalPrice: 1099,
        rating: 4.8,
        reviews: 76,
        image: '/assets/images/lamps.avif',
        category: 'led'
      },
      {
        id: 'eng_her_3',
        name: 'Custom Name Necklace',
        price: 1499,
        originalPrice: 1899,
        rating: 4.9,
        reviews: 68,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        category: 'jewelry'
      },
      {
        id: 'eng_her_4',
        name: 'Floral Gift Box',
        price: 999,
        originalPrice: 1199,
        rating: 4.9,
        reviews: 54,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
        category: 'hampers'
      },
      {
        id: 'eng_her_5',
        name: 'Spa Gift Hamper',
        price: 1299,
        originalPrice: 1599,
        rating: 4.7,
        reviews: 46,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
        category: 'hampers'
      }
    ]
  },

  // 7. Why Choose Us
  whyChoose: {
    tagline: 'WHY CHOOSE US',
    heading: 'Crafted for Your Special Moments',
    subtitle: 'We pour love and attention into every gift so your celebration becomes truly unforgettable.',
    cards: [
      {
        icon: 'fa-solid fa-wand-magic-sparkles',
        title: 'Customised Gifts',
        desc: 'Every gift is made uniquely for you with custom photos, names and dates.'
      },
      {
        icon: 'fa-solid fa-shield-halved',
        title: 'Premium Quality',
        desc: 'Crafted with premium materials designed to stand the test of time.'
      },
      {
        icon: 'fa-solid fa-truck-fast',
        title: 'Fast & Safe Delivery',
        desc: 'Dispatched safely in tamper-proof gift packaging right to your doorstep.'
      },
      {
        icon: 'fa-solid fa-gift',
        title: 'Beautiful Packaging',
        desc: 'Luxury presentation boxes ready to gift with ribbons and greeting cards.'
      }
    ]
  },

  // 8. Customer Reviews
  reviews: {
    tagline: 'WHAT COUPLES SAY',
    heading: 'Real Love Stories & Reviews',
    subtitle: 'Read what happy couples and gift givers have to say about our creations.',
    items: [
      {
        id: 'rev_1',
        name: 'Priya & Rahul',
        city: 'Bangalore, India',
        title: 'Absolutely Beautiful!',
        comment: 'The customised photo frame we ordered for our engagement was perfect. Amazing quality and fast delivery.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5
      },
      {
        id: 'rev_2',
        name: 'Ayesha Khan',
        city: 'Mangalore, India',
        title: 'Perfect Engagement Gift!',
        comment: 'The gift hamper was beautifully packed and looked premium. Highly recommend Fine Gift Studio.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        rating: 5
      },
      {
        id: 'rev_3',
        name: 'Sneha & Arjun',
        city: 'Delhi, India',
        title: 'Excellent Quality',
        comment: 'Loved the personalised LED lamp. It made our special day even more memorable.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5
      }
    ]
  },

  // 9. Newsletter Strip
  newsletter: {
    tagline: 'AS PART OF SPECIAL MOMENTS',
    heading: 'Get Exclusive Offers',
    headingHighlight: '& Gift Ideas',
    subtitle: 'Subscribe to get 15% off your first engagement gift order.',
    buttonText: 'Subscribe'
  }
};

// Preset Templates for New Occasions that Admins can create in 1-click
export const OCCASION_PRESET_TEMPLATES = [
  {
    id: 'wedding-gifts',
    slug: 'wedding-gifts',
    name: 'Wedding Gifts',
    badge: 'GIFTS BY OCCASION',
    hero: {
      tagline: 'CELEBRATE ETERNAL LOVE',
      titleMain: 'Wedding',
      titleHighlight: 'Gifts',
      description: 'Exclusive keepsake gifts and luxury hampers crafted for the bride & groom.',
      ctaText: 'Explore Wedding Gifts',
      image: '/assets/images/engagement-gifts-banner.png',
      floatingQuote: 'A Lifetime of Love & Happiness',
      features: [
        { icon: '💍', text: 'Royal Keepsakes' },
        { icon: '✨', text: 'Luxury Hamper Boxes' },
        { icon: '🚚', text: 'Pan-India Express' }
      ]
    },
    popularGifts: {
      tagline: 'WEDDING FAVOURITES —',
      heading: 'Most Loved Wedding Gifts',
      subtitle: 'Memorable gifts designed to honour the sacred bond of marriage.'
    },
    midHamperBanner: {
      tagline: 'ROYAL WEDDING COLLECTION',
      titleMain: 'Luxury Bespoke',
      titleHighlight: 'Wedding Hampers',
      description: 'Handcrafted luxury packaging with personalized gold engravings.',
      ctaText: 'View Wedding Hampers',
      ctaLink: '/shop?cat=packaging',
      image: '/assets/images/packaging.avif',
      floatBadge: 'Just Married 💖'
    },
    newsletter: {
      tagline: 'WEDDING GIFT REGISTRY',
      heading: 'Special Wedding Discounts',
      headingHighlight: '& Bulk Perks',
      subtitle: 'Subscribe for complimentary calligraphy cards with every wedding order.',
      buttonText: 'Claim Offer'
    }
  },
  {
    id: 'anniversary-gifts',
    slug: 'anniversary-gifts',
    name: 'Anniversary Gifts',
    badge: 'GIFTS BY OCCASION',
    hero: {
      tagline: 'CHERISH EVERY MILESTONE',
      titleMain: 'Anniversary',
      titleHighlight: 'Gifts',
      description: 'Celebrate years of togetherness with heartwarming custom memories.',
      ctaText: 'Explore Anniversary Gifts',
      image: '/assets/images/engagement-gifts-banner.png',
      floatingQuote: 'Years Change, Love Remains Forever',
      features: [
        { icon: '🥂', text: 'Milestone Frames' },
        { icon: '💖', text: 'Couple LED Art' },
        { icon: '🎁', text: 'Handcrafted With Care' }
      ]
    },
    popularGifts: {
      tagline: 'ROMANTIC PICKS —',
      heading: 'Top Anniversary Keepsakes',
      subtitle: 'Gifts that say "I choose you again and again".'
    },
    midHamperBanner: {
      tagline: 'TIMELESS MEMORIES',
      titleMain: 'Personalised',
      titleHighlight: 'Anniversary Hamper',
      description: 'Curated wines, etched glasses and wooden photobooks for milestones.',
      ctaText: 'Explore Hampers',
      ctaLink: '/shop?cat=packaging',
      image: '/assets/images/packaging.avif',
      floatBadge: 'Happy Anniversary ❤️'
    },
    newsletter: {
      tagline: 'CELEBRATE YOUR LOVE',
      heading: 'Never Forget an Anniversary',
      headingHighlight: '& Save 20%',
      subtitle: 'Get early reminders and VIP coupon codes straight to your inbox.',
      buttonText: 'Subscribe'
    }
  },
  {
    id: 'birthday-gifts',
    slug: 'birthday-gifts',
    name: 'Birthday Gifts',
    badge: 'GIFTS BY OCCASION',
    hero: {
      tagline: 'MAKE THEIR DAY EXTRA SPECIAL',
      titleMain: 'Birthday',
      titleHighlight: 'Gifts',
      description: 'Exciting custom presents to bring the brightest smiles on their special day.',
      ctaText: 'Discover Birthday Gifts',
      image: '/assets/images/engagement-gifts-banner.png',
      floatingQuote: 'Cheers to Another Beautiful Year',
      features: [
        { icon: '🎂', text: 'Custom Photo Cakes & Gifts' },
        { icon: '🎉', text: 'Exciting Surprise Boxes' },
        { icon: '⚡', text: 'Same-Day Dispatch' }
      ]
    },
    popularGifts: {
      tagline: 'TRENDING BIRTHDAY GIFTS —',
      heading: 'Most Popular Birthday Gifts',
      subtitle: 'From magic mugs to 3D LED lamps, find the perfect gift for every age.'
    },
    midHamperBanner: {
      tagline: 'BIRTHDAY BASH SPECIAL',
      titleMain: 'Curated',
      titleHighlight: 'Birthday Hampers',
      description: 'Packed with gourmet treats, custom accessories, and heartfelt birthday notes.',
      ctaText: 'Shop Birthday Hampers',
      ctaLink: '/shop?cat=packaging',
      image: '/assets/images/packaging.avif',
      floatBadge: 'Happy Birthday 🎂'
    },
    newsletter: {
      tagline: 'BIRTHDAY CLUB',
      heading: 'Get a Special Birthday Gift',
      headingHighlight: 'On Us!',
      subtitle: 'Join our birthday club to receive surprise coupon codes on your birthday month.',
      buttonText: 'Join Club'
    }
  }
];

// Initial CMS state with Engagement Gifts as primary
export const DEFAULT_OCCASIONS_STATE = {
  activeOccasionId: 'engagement-gifts',
  occasions: [
    DEFAULT_OCCASION_DATA
  ]
};
