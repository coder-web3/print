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
