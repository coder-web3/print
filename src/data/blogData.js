/**
 * Default Blog Data & Schema
 * Includes posts, categories, trending articles, and hero settings
 * Matching the studio blog design.
 */

export const BLOG_CATEGORIES = [
  { id: 'all', label: 'All Posts', icon: 'fa-solid fa-shapes' },
  { id: 'gift-ideas', label: 'Gift Ideas', icon: 'fa-solid fa-lightbulb' },
  { id: 'occasions', label: 'Occasions', icon: 'fa-solid fa-gift' },
  { id: 'personalisation', label: 'Personalisation', icon: 'fa-solid fa-wand-magic-sparkles' },
  { id: 'gifting-tips', label: 'Gifting Tips', icon: 'fa-solid fa-heart' },
  { id: 'trends', label: 'Trends & Inspiration', icon: 'fa-solid fa-arrow-trend-up' },
  { id: 'corporate', label: 'Corporate Gifts', icon: 'fa-solid fa-briefcase' }
];

export const DEFAULT_BLOG_POSTS = [
  {
    id: 'post-1',
    slug: '10-unique-engagement-gift-ideas-for-a-perfect-start',
    title: '10 Unique Engagement Gift Ideas for a Perfect Start',
    titleHighlight: 'for a Perfect Start',
    category: 'Engagement',
    categorySlug: 'occasions',
    excerpt: 'Make their new journey special with thoughtful and personalised gifts that create lasting memories.',
    featuredImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=85',
    author: {
      name: 'Fine Gift Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    publishedAt: 'Oct 18, 2026',
    readTime: '5 min read',
    trending: true,
    trendingRank: 1,
    status: 'published',
    quote: "A thoughtful gift is more than just a present — it's a memory they'll cherish forever.",
    tableOfContents: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'personalised-couple-gifts', label: '1. Personalised Couple Gifts' },
      { id: 'memory-keepsakes', label: '2. Memory Keepsakes' },
      { id: 'home-decor-gifts', label: '3. Home Decor Gifts' },
      { id: 'experience-gifts', label: '4. Experience Gifts' },
      { id: 'practical-useful-gifts', label: '5. Practical & Useful Gifts' },
      { id: 'tips-for-choosing', label: 'Tips for Choosing' },
      { id: 'conclusion', label: 'Conclusion' }
    ],
    contentSections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        body: `An engagement is the beginning of a beautiful journey filled with love, dreams, and togetherness. Finding the right gift for this special occasion can make the moment even more memorable. Whether you're looking for something personalised, elegant, or meaningful, here are 10 unique engagement gift ideas that will surely leave a lasting impression.`
      },
      {
        id: 'personalised-couple-gifts',
        heading: '1. Personalised Couple Gifts',
        body: `Nothing says 'celebrating you two' like custom-made items featuring their names, engagement date, or initials. Popular options include custom engraved wine glasses, matching passport holders for their upcoming honeymoon, and bespoke couple illustration portraits. Adding that personal touch turns a simple item into an heirloom they will display proudly.`
      },
      {
        id: 'memory-keepsakes',
        heading: '2. Memory Keepsakes',
        body: `Preserve the proposal day forever with a custom star map depicting the night sky when they said 'Yes!'. Handcrafted wooden memory keepsake boxes and engraved acrylic blocks with their engagement coordinates also make heart-touching gifts that stand the test of time.`
      },
      {
        id: 'home-decor-gifts',
        heading: '3. Home Decor Gifts',
        body: `As the newly engaged couple begins planning their future home, decorative accents that celebrate their love add warmth to their space. Consider personalized LED night lamps, elegant monogram wooden frames, and embroidered linen cushions for the living room.`
      },
      {
        id: 'experience-gifts',
        heading: '4. Experience Gifts',
        body: `Give them the gift of time together! A weekend staycation voucher, a private couple pottery workshop, or a curated romantic candlelit dinner helps them unwind amidst all the wedding planning excitement.`
      },
      {
        id: 'practical-useful-gifts',
        heading: '5. Practical & Useful Gifts',
        body: `High quality personalized barware, luggage tags for honeymoon travels, or a wedding planning journal binder offer both beauty and practical utility that the couple will reach for every day.`
      },
      {
        id: 'tips-for-choosing',
        heading: 'Tips for Choosing the Perfect Engagement Gift',
        body: `When selecting an engagement gift, consider the couple's personal lifestyle and aesthetics. If they love hosting, barware and kitchen boards are fantastic. If they are sentimental, customized keepsakes and photo art take the crown. Always check delivery timing to ensure the gift arrives in time for the engagement party!`
      },
      {
        id: 'conclusion',
        heading: 'Conclusion',
        body: `Engagement gifts are all about sharing in the couple's joy and marking the beginning of their lifetime adventure. By choosing a thoughtful, custom gift from Fine Gift Studio, you offer more than just a product — you give a treasured symbol of their love.`
      }
    ]
  },
  {
    id: 'post-2',
    slug: 'why-personalised-gifts-always-feel-more-special',
    title: 'Why Personalised Gifts Always Feel More Special',
    titleHighlight: 'Always Feel More Special',
    category: 'Personalisation',
    categorySlug: 'personalisation',
    excerpt: 'Discover how personalised gifts create lasting memories and stronger emotional bonds between loved ones.',
    featuredImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=85',
    author: {
      name: 'Fine Gift Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    publishedAt: 'Oct 15, 2026',
    readTime: '6 min read',
    trending: true,
    trendingRank: 2,
    status: 'published',
    quote: "A gift with a name or memory speaks directly to the heart.",
    tableOfContents: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'emotional-value', label: 'The Emotional Connection' },
      { id: 'uniqueness', label: 'One-of-a-Kind Factor' },
      { id: 'thoughtfulness', label: 'Proof of Effort & Care' },
      { id: 'conclusion', label: 'Final Thoughts' }
    ],
    contentSections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        body: `In a world of mass-produced goods, receiving something made specifically for you holds an irreplaceable charm. Personalisation elevates standard gifting into a personal story.`
      },
      {
        id: 'emotional-value',
        heading: 'The Emotional Connection',
        body: `When someone unwraps a gift featuring a shared inside joke, an anniversary date, or their handwritten message engraved onto wood or metal, dopamine and nostalgia take over immediately.`
      },
      {
        id: 'uniqueness',
        heading: 'One-of-a-Kind Factor',
        body: `Nobody else in the world possesses the exact same customized mug, frame, or bracelet. It is exclusively theirs.`
      },
      {
        id: 'thoughtfulness',
        heading: 'Proof of Effort & Care',
        body: `Ordering a personalized gift requires advance planning, photo selection, and thoughtful deliberation — showing the recipient just how valued they truly are.`
      },
      {
        id: 'conclusion',
        heading: 'Final Thoughts',
        body: `Whether it is a birthday, anniversary, or farewell, custom gifts remain the ultimate token of warmth and affection.`
      }
    ]
  },
  {
    id: 'post-3',
    slug: 'top-10-trending-gifts-for-2026',
    title: 'Top 10 Trending Gifts for 2026',
    titleHighlight: 'for 2026',
    category: 'Gift Ideas',
    categorySlug: 'gift-ideas',
    excerpt: 'Explore the latest gift trends and find the perfect present for your loved ones this season.',
    featuredImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=85',
    author: {
      name: 'Fine Gift Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    publishedAt: 'Oct 12, 2026',
    readTime: '4 min read',
    trending: true,
    trendingRank: 3,
    status: 'published',
    quote: "Stay ahead of gifting trends with minimalist aesthetics and custom craftsmanship.",
    tableOfContents: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'trend-minimalist', label: '1. Minimalist Acrylic & LED' },
      { id: 'trend-sustainable', label: '2. Sustainable Wooden Crafts' },
      { id: 'trend-smart', label: '3. Interactive QR Audio Gifts' },
      { id: 'conclusion', label: 'Conclusion' }
    ],
    contentSections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        body: `Gifting in 2026 is driven by clean minimalist aesthetics, sustainable materials, and heartfelt digital-physical crossovers.`
      },
      {
        id: 'trend-minimalist',
        heading: '1. Minimalist Acrylic & LED',
        body: `Warm acrylic plaques with soft amber LED glow bring ambient coziness to work desks and bedside tables.`
      },
      {
        id: 'trend-sustainable',
        heading: '2. Sustainable Wooden Crafts',
        body: `Solid pine, walnut and bamboo personalized boxes and frames are replacing synthetic plastics across top gift categories.`
      },
      {
        id: 'trend-smart',
        heading: '3. Interactive QR Audio Gifts',
        body: `Engraving scannable Spotify music codes and voice message QR codes onto keepsakes has become one of this year's biggest viral sensations.`
      },
      {
        id: 'conclusion',
        heading: 'Conclusion',
        body: `Explore our 2026 trending catalog to pick modern, viral-worthy presents that impress.`
      }
    ]
  },
  {
    id: 'post-4',
    slug: 'creative-birthday-gift-ideas-for-loved-ones',
    title: 'Creative Birthday Gift Ideas for Loved Ones',
    titleHighlight: 'for Loved Ones',
    category: 'Birthday',
    categorySlug: 'occasions',
    excerpt: 'Thoughtful and unique gift ideas to make their day extra special and unforgettable.',
    featuredImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85',
    author: {
      name: 'Fine Gift Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    publishedAt: 'Oct 10, 2026',
    readTime: '5 min read',
    trending: true,
    trendingRank: 4,
    status: 'published',
    quote: "Birthdays are milestones of love, laughter, and new beginnings.",
    tableOfContents: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'age-milestones', label: 'Milestone Celebrations' },
      { id: 'photo-gifts', label: 'Photo Collagen Keepsakes' },
      { id: 'conclusion', label: 'Conclusion' }
    ],
    contentSections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        body: `Every birthday represents another chapter of life. A memorable birthday present celebrates who they are and how far they have come.`
      },
      {
        id: 'age-milestones',
        heading: 'Milestone Celebrations',
        body: `From 18th to 21st, 30th, and 50th golden birthdays, custom milestone frames and memory books make celebratory centerpieces.`
      },
      {
        id: 'photo-gifts',
        heading: 'Photo Collagen Keepsakes',
        body: `Transform years of smartphone photos into a premium gallery collage or a rotating LED cube lamp.`
      },
      {
        id: 'conclusion',
        heading: 'Conclusion',
        body: `Wrap your love in a studio gift box and make their special day one they will never forget.`
      }
    ]
  },
  {
    id: 'post-5',
    slug: 'personalised-home-decor-gifts-to-brighten-any-space',
    title: 'Personalised Home Decor Gifts to Brighten Any Space',
    titleHighlight: 'to Brighten Any Space',
    category: 'Home Decor',
    categorySlug: 'personalisation',
    excerpt: 'Turn everyday spaces into meaningful memories with customised decor gifts and wall frames.',
    featuredImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=85',
    author: {
      name: 'Fine Gift Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    publishedAt: 'Oct 8, 2026',
    readTime: '6 min read',
    trending: true,
    trendingRank: 5,
    status: 'published',
    quote: "Home is where our favorite memories are turned into art.",
    tableOfContents: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'living-room', label: 'Living Room Accents' },
      { id: 'bedroom-vibes', label: 'Cozy Bedroom Keepsakes' },
      { id: 'conclusion', label: 'Conclusion' }
    ],
    contentSections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        body: `Personalized home decor strikes the perfect balance between high-end aesthetic interior styling and deeply personal sentiment.`
      },
      {
        id: 'living-room',
        heading: 'Living Room Accents',
        body: `Custom metal wall clocks, wooden family nameplates, and canvas prints give living spaces a welcoming, lived-in feel.`
      },
      {
        id: 'bedroom-vibes',
        heading: 'Cozy Bedroom Keepsakes',
        body: `Gentle warm light lamps engraved with wedding vows or couple silhouettes create a tranquil sanctuary.`
      },
      {
        id: 'conclusion',
        heading: 'Conclusion',
        body: `Discover bespoke home decor pieces that transform a house into a warm, cherished home.`
      }
    ]
  },
  {
    id: 'post-6',
    slug: 'corporate-gift-ideas-that-leave-a-lasting-impression',
    title: 'Corporate Gift Ideas That Leave a Lasting Impression',
    titleHighlight: 'That Leave a Lasting Impression',
    category: 'Corporate Gifts',
    categorySlug: 'corporate',
    excerpt: 'Build stronger relationships with thoughtful and customised corporate gifts for clients and teams.',
    featuredImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
    author: {
      name: 'Fine Gift Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    publishedAt: 'Oct 5, 2026',
    readTime: '5 min read',
    trending: false,
    trendingRank: null,
    status: 'published',
    quote: "Excellence in corporate relationships begins with thoughtful appreciation.",
    tableOfContents: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'client-gifting', label: 'Executive Client Hampers' },
      { id: 'employee-onboarding', label: 'Employee Welcome Kits' },
      { id: 'conclusion', label: 'Conclusion' }
    ],
    contentSections: [
      {
        id: 'introduction',
        heading: 'Introduction',
        body: `In the business world, corporate gifts express gratitude, strengthen partnerships, and reinforce brand loyalty.`
      },
      {
        id: 'client-gifting',
        heading: 'Executive Client Hampers',
        body: `Engraved metal pens, branded thermal flasks, and artisanal treats in custom magnetic luxury gift boxes leave an undeniable executive impression.`
      },
      {
        id: 'employee-onboarding',
        heading: 'Employee Welcome Kits',
        body: `Make new hires feel celebrated from day one with personalized tech accessories, notebooks, and water bottles featuring their names.`
      },
      {
        id: 'conclusion',
        heading: 'Conclusion',
        body: `Partner with Fine Gift Studio for bulk corporate orders, custom company logo branding, and reliable doorstep delivery.`
      }
    ]
  }
];

export const DEFAULT_BLOG_CONTENT = {
  hero: {
    tag: 'OUR BLOG',
    title: 'Thoughtful Ideas',
    titleHighlight: 'for Every Occasion',
    desc: 'Explore gift guides, creative ideas, personalisation tips and inspiration to make every moment special.',
    heroImage: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=85'
  },
  posts: DEFAULT_BLOG_POSTS
};
