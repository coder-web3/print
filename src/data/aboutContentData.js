/**
 * Default About Us Page Content & Sections Schema
 * Used for About Page CMS in Admin Dashboard and fallback on storefront.
 */

export const DEFAULT_ABOUT_CONTENT = {
  visibility: {
    hero: true,
    highlights: true,
    story: true,
    stats: true,
    process: true,
    values: true,
    cta: true,
  },
  hero: {
    eyebrow: 'The Art of Gifting',
    title: 'Every Gift Tells',
    highlightTitle: 'Your Story.',
    subtitle: 'At Fine Gift Studio, we craft thoughtful, personalized gifts that turn everyday moments into meaningful memories.',
    ctaText: 'Discover Our Story',
    tagline: 'Made Personal, Made Memorable',
    heroImage: '', // Fallback to asset hero.avif if empty
  },
  highlights: [
    {
      id: 1,
      icon: 'fa-solid fa-wand-magic-sparkles',
      title: 'Custom Personalization',
      desc: 'Tailored names, photos & unique memories',
    },
    {
      id: 2,
      icon: 'fa-solid fa-gift',
      title: 'Luxury Gift Packaging',
      desc: 'Curated boxes with satin ribbons & cards',
    },
    {
      id: 3,
      icon: 'fa-solid fa-truck-fast',
      title: 'Reliable Pan-India Delivery',
      desc: 'Safe shipping for birthdays & celebrations',
    },
    {
      id: 4,
      icon: 'fa-solid fa-heart',
      title: 'Handcrafted with Love',
      desc: 'Quality checked in Mangalore, India',
    },
  ],
  story: {
    badge: 'Our Journey',
    title: 'Crafting Memories That',
    highlightTitle: 'Last a Lifetime',
    p1: 'Fine Gift Studio was founded with a singular conviction: gifting is never just about handing over an object. It is a tangible expression of love, respect, gratitude, and celebration.',
    p2: 'Starting from our artisan studio in Mangalore, Karnataka, we set out to replace impersonal store-bought items with customized keepsakes — from engraved drinkware and customized wooden frames to tailor-made leather accessories and curated corporate gift boxes.',
    quote: '"Every ribbon tied and every message engraved represents someone’s precious bond. We treat every order as if it were for our own family."',
    quoteAuthor: '— The Fine Gift Studio Family',
    p3: 'Today, our studio blends traditional artisanal finishing with state-of-the-art printing and laser engraving technology, ensuring that every gift looks breathtaking and endures through the years.',
    floatingBadgeTitle: 'Mangalore Roots',
    floatingBadgeSubtitle: 'Delivering Smiles Pan-India',
    img1: '', // packagingImg fallback
    img2: '', // artDesignImg fallback
    img3: '', // cupsProductImg fallback
  },
  stats: [
    {
      id: 1,
      number: '50',
      suffix: 'K+',
      label: 'Gifts Delivered',
      desc: 'Spreading happiness nationwide',
    },
    {
      id: 2,
      number: '15',
      suffix: 'K+',
      label: 'Custom Designs',
      desc: 'Unique photo & name templates',
    },
    {
      id: 3,
      number: '99.4',
      suffix: '%',
      label: 'On-Time Delivery',
      desc: 'Before birthdays & milestones',
    },
    {
      id: 4,
      number: '4.9',
      suffix: '★',
      label: 'Customer Rating',
      desc: 'Over 12,000+ 5-star reviews',
    },
  ],
  process: {
    badge: 'Simple Process',
    title: 'How We Turn Ideas into',
    highlightTitle: 'Heirlooms',
    description: 'Creating a one-of-a-kind personalized gift should be exciting and effortless. Here is how we bring your imagination to life:',
    steps: [
      {
        num: '01',
        icon: 'fa-solid fa-hand-pointer',
        title: 'Choose Your Item',
        desc: 'Browse hundreds of mugs, wood photo frames, metal pens, leather goods, and luxury gift sets.',
      },
      {
        num: '02',
        icon: 'fa-solid fa-pen-nib',
        title: 'Personalize It',
        desc: 'Upload your favourite photos, enter recipient names, or request a customized monogram and message.',
      },
      {
        num: '03',
        icon: 'fa-solid fa-compass-drafting',
        title: 'Artisan Precision',
        desc: 'Our Mangalore studio prints, engraves, checks quality, and hand-wraps your gift with satin ribbon.',
      },
      {
        num: '04',
        icon: 'fa-solid fa-box-open',
        title: 'Delivered with Joy',
        desc: "Securely packaged and dispatched with real-time tracking straight to your loved one's doorstep.",
      },
    ],
  },
  values: {
    badge: 'Our Pillars',
    title: 'The Values That',
    highlightTitle: 'Guide Us',
    description: 'We pride ourselves on honesty, artistry, and an obsession with customer delight.',
    pillars: [
      {
        icon: 'fa-solid fa-gem',
        title: 'Uncompromised Quality',
        desc: 'We only source heavy-gauge ceramics, real polished wood, and durable metals. No flimsy materials or low-resolution prints.',
      },
      {
        icon: 'fa-solid fa-leaf',
        title: 'Thoughtful Packaging',
        desc: 'We use protective, eco-friendly cushioning and reusable gift presentation boxes designed to impress the moment they are unboxed.',
      },
      {
        icon: 'fa-solid fa-comments',
        title: 'Customer First, Always',
        desc: 'Need preview assistance or last-minute customization? Our Mangalore team is always available via WhatsApp and direct call.',
      },
    ],
  },
  cta: {
    title: 'Ready to Turn Moments into',
    highlightTitle: 'Memories?',
    description: 'Explore our best-selling personalized gifts or talk with our team to create a bespoke order for weddings, birthdays, or corporate celebrations.',
    primaryBtnText: 'Explore Gift Collections',
    secondaryBtnText: 'Contact Our Studio',
  },
};
