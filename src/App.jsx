import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import HomePage from './components/Home/HomePage';
import AboutPage from './components/About/AboutPage';
import ContactPage from './components/Contact/ContactPage';
import ShopPage from './components/Shop/ShopPage';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import LegalPage from './components/Legal/LegalPage';
import EngagementGiftsPage from './components/Occasion/EngagementGiftsPage';
import BlogListingPage from './components/Blog/BlogListingPage';
import BlogDetailPage from './components/Blog/BlogDetailPage';
import CartDrawer from './components/Cart/CartDrawer';
import WishlistModal from './components/Wishlist/WishlistModal';
import AccountModal from './components/Account/AccountModal';
import AuthModal from './components/Auth/AuthModal';
import Footer from './components/Footer/Footer';
import Toast from './components/UI/Toast';
import BackToTop from './components/UI/BackToTop';
import WhatsAppButton from './components/UI/WhatsAppButton';
import Preloader from './components/UI/Preloader';
import { categoriesData, productsData } from './data/mockData';
import { DEFAULT_HOME_CONTENT } from './data/homeContentData';
import { DEFAULT_ABOUT_CONTENT } from './data/aboutContentData';
import { DEFAULT_CONTACT_CONTENT } from './data/contactContentData';
import { DEFAULT_LEGAL_CONTENT } from './data/legalData';
import { DEFAULT_HEADER_FOOTER_CONTENT } from './data/headerFooterData';
import { DEFAULT_OCCASION_DATA, DEFAULT_OCCASIONS_STATE } from './data/occasionContentData';
import { DEFAULT_BLOG_CONTENT } from './data/blogData';
import { apiCreateOrder, apiGetProducts, apiGetCategories, apiGetOrders, safeSaveProductsCache, apiGetCmsContent, apiSaveCmsContent } from './services/api';

export default function App() {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_admin_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return categoriesData;
    } catch {
      return categoriesData;
    }
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_admin_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return productsData;
    } catch {
      return productsData;
    }
  });

  const handleUpdateProducts = (newProducts) => {
    setProducts(newProducts);
    safeSaveProductsCache(newProducts);
  };

  const handleUpdateCategories = (newCategories) => {
    setCategories(newCategories);
    try {
      localStorage.setItem('finegift_admin_categories', JSON.stringify(newCategories));
    } catch {}
  };

  // Sync initial live products & categories from remote MySQL database
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const remoteProds = await apiGetProducts();
        if (Array.isArray(remoteProds) && remoteProds.length > 0) {
          setProducts(remoteProds);
          safeSaveProductsCache(remoteProds);
        }
      } catch (e) {
        console.warn('Initial products sync:', e);
      }

      try {
        const remoteCats = await apiGetCategories();
        if (Array.isArray(remoteCats) && remoteCats.length > 0) {
          setCategories(remoteCats);
          try { localStorage.setItem('finegift_admin_categories', JSON.stringify(remoteCats)); } catch {}
        }
      } catch (e) {
        console.warn('Initial categories sync:', e);
      }

      try {
        const remoteLegal = await apiGetCmsContent('legal_content');
        if (remoteLegal && typeof remoteLegal === 'object') {
          setLegalContent(prev => ({
            ...prev,
            ...remoteLegal,
            terms: { ...DEFAULT_LEGAL_CONTENT.terms, ...(remoteLegal.terms || {}) },
            privacy: { ...DEFAULT_LEGAL_CONTENT.privacy, ...(remoteLegal.privacy || {}) },
            shipping: { ...DEFAULT_LEGAL_CONTENT.shipping, ...(remoteLegal.shipping || {}) },
            returns: { ...DEFAULT_LEGAL_CONTENT.returns, ...(remoteLegal.returns || {}) },
          }));
          try { localStorage.setItem('finegift_legal_content', JSON.stringify(remoteLegal)); } catch {}
        }
      } catch (e) {
        console.warn('Initial legal content sync:', e);
      }

      try {
        const remoteHF = await apiGetCmsContent('header_footer_content');
        if (remoteHF && typeof remoteHF === 'object') {
          setHeaderFooterContent(prev => ({
            ...prev,
            ...remoteHF,
            header: {
              ...DEFAULT_HEADER_FOOTER_CONTENT.header,
              ...(prev.header || {}),
              ...(remoteHF.header || {}),
              navItems: remoteHF.header?.navItems || prev.header?.navItems || DEFAULT_HEADER_FOOTER_CONTENT.header.navItems,
              occasionMenu: remoteHF.header?.occasionMenu || prev.header?.occasionMenu || DEFAULT_HEADER_FOOTER_CONTENT.header.occasionMenu,
              corporateMenu: remoteHF.header?.corporateMenu || prev.header?.corporateMenu || DEFAULT_HEADER_FOOTER_CONTENT.header.corporateMenu,
              visibility: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.visibility, ...(remoteHF.header?.visibility || {}) },
              topBar: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.topBar, ...(remoteHF.header?.topBar || {}) },
              socialLinks: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.socialLinks, ...(remoteHF.header?.socialLinks || {}) },
              brand: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.brand, ...(remoteHF.header?.brand || {}) },
              search: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.search, ...(remoteHF.header?.search || {}) },
              contact: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.contact, ...(remoteHF.header?.contact || {}) },
            },
            footer: {
              ...DEFAULT_HEADER_FOOTER_CONTENT.footer,
              ...(prev.footer || {}),
              ...(remoteHF.footer || {}),
              quickLinks: remoteHF.footer?.quickLinks || prev.footer?.quickLinks || DEFAULT_HEADER_FOOTER_CONTENT.footer.quickLinks,
              customerSupport: remoteHF.footer?.customerSupport || prev.footer?.customerSupport || DEFAULT_HEADER_FOOTER_CONTENT.footer.customerSupport,
              visibility: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.visibility, ...(remoteHF.footer?.visibility || {}) },
              expressBanner: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.expressBanner, ...(remoteHF.footer?.expressBanner || {}) },
              instagramSection: {
                ...DEFAULT_HEADER_FOOTER_CONTENT.footer.instagramSection,
                ...(remoteHF.footer?.instagramSection || {}),
                posts: remoteHF.footer?.instagramSection?.posts || DEFAULT_HEADER_FOOTER_CONTENT.footer.instagramSection.posts,
              },
              newsletter: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.newsletter, ...(remoteHF.footer?.newsletter || {}) },
              brand: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.brand, ...(remoteHF.footer?.brand || {}) },
              socialLinks: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.socialLinks, ...(remoteHF.footer?.socialLinks || {}) },
              contactInfo: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.contactInfo, ...(remoteHF.footer?.contactInfo || {}) },
              bottomBar: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.bottomBar, ...(remoteHF.footer?.bottomBar || {}) },
            },
          }));
          try { localStorage.setItem('finegift_header_footer_content', JSON.stringify(remoteHF)); } catch {}
        }
      } catch (e) {
        console.warn('Initial header/footer sync:', e);
      }

      try {
        const remoteOrders = await apiGetOrders();
        if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
          setOrders(remoteOrders);
          try { localStorage.setItem('finegift_orders', JSON.stringify(remoteOrders)); } catch {}
        }
      } catch (e) {
        console.warn('Initial orders sync:', e);
      }

      try {
        const remoteOccasions = await apiGetCmsContent('occasion_content');
        if (remoteOccasions && Array.isArray(remoteOccasions.occasions) && remoteOccasions.occasions.length > 0) {
          setOccasionsContent(remoteOccasions);
          try { localStorage.setItem('finegift_occasions_content', JSON.stringify(remoteOccasions)); } catch {}
        }
      } catch (e) {
        console.warn('Initial occasions content sync:', e);
      }

      try {
        const remoteBlog = await apiGetCmsContent('blog_content');
        if (remoteBlog && Array.isArray(remoteBlog.posts) && remoteBlog.posts.length > 0) {
          setBlogContent(remoteBlog);
          try { localStorage.setItem('finegift_blog_content', JSON.stringify(remoteBlog)); } catch {}
        }
      } catch (e) {
        console.warn('Initial blog content sync:', e);
      }
    };

    fetchLiveData();
  }, []);

  // Listen for product, category & order updates from Admin or other tabs in real-time
  useEffect(() => {
    let channel;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('finegift_store_sync');
        channel.onmessage = (event) => {
          if (event.data?.key === 'finegift_admin_products' && Array.isArray(event.data.data)) {
            setProducts(event.data.data);
          } else if (event.data?.key === 'finegift_admin_categories' && Array.isArray(event.data.data)) {
            setCategories(event.data.data);
          } else if (event.data?.key === 'finegift_orders' && Array.isArray(event.data.data)) {
            setOrders(event.data.data);
          } else if (event.data?.key === 'finegift_header_footer_content' && event.data.data) {
            setHeaderFooterContent(event.data.data);
          } else if (event.data?.key === 'finegift_occasions_content' && event.data.data) {
            setOccasionsContent(event.data.data);
          } else if (event.data?.key === 'finegift_blog_content' && event.data.data) {
            setBlogContent(event.data.data);
          }
        };
      }
    } catch {}

    const handleStorage = (e) => {
      if (e.key === 'finegift_admin_products' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        } catch {}
      } else if (e.key === 'finegift_admin_categories' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
          }
        } catch {}
      } else if (e.key === 'finegift_orders' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          }
        } catch {}
      } else if (e.key === 'finegift_header_footer_content' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            setHeaderFooterContent(parsed);
          }
        } catch {}
      } else if (e.key === 'finegift_occasions_content' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            setOccasionsContent(parsed);
          }
        } catch {}
      } else if (e.key === 'finegift_blog_content' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object') {
            setBlogContent(parsed);
          }
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Persistent Home Page Content state for CMS
  const [homeContent, setHomeContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_home_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_HOME_CONTENT,
          ...parsed,
          visibility: { ...DEFAULT_HOME_CONTENT.visibility, ...(parsed.visibility || {}) },
          hero: { ...DEFAULT_HOME_CONTENT.hero, ...(parsed.hero || {}) },
          categoryStrip: { ...DEFAULT_HOME_CONTENT.categoryStrip, ...(parsed.categoryStrip || {}) },
          featuredCategories: { ...DEFAULT_HOME_CONTENT.featuredCategories, ...(parsed.featuredCategories || {}) },
          promoBanners: { ...DEFAULT_HOME_CONTENT.promoBanners, ...(parsed.promoBanners || {}) },
          occasionBanner: { ...DEFAULT_HOME_CONTENT.occasionBanner, ...(parsed.occasionBanner || {}) },
          dealsOfDay: { ...DEFAULT_HOME_CONTENT.dealsOfDay, ...(parsed.dealsOfDay || {}) },
          discountBanner: { ...DEFAULT_HOME_CONTENT.discountBanner, ...(parsed.discountBanner || {}) },
          whyChoose: { ...DEFAULT_HOME_CONTENT.whyChoose, ...(parsed.whyChoose || {}) },
          productLists: { ...DEFAULT_HOME_CONTENT.productLists, ...(parsed.productLists || {}) },
          testimonials: { ...DEFAULT_HOME_CONTENT.testimonials, ...(parsed.testimonials || {}) },
        };
      }
      return DEFAULT_HOME_CONTENT;
    } catch {
      return DEFAULT_HOME_CONTENT;
    }
  });

  const handleUpdateHomeContent = (newContent) => {
    setHomeContent(newContent);
    try {
      localStorage.setItem('finegift_home_content', JSON.stringify(newContent));
    } catch (e) {
      console.error('Error saving home content:', e);
    }
  };

  // Persistent About Us Page Content state for CMS
  const [aboutContent, setAboutContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_about_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_ABOUT_CONTENT,
          ...parsed,
          visibility: { ...DEFAULT_ABOUT_CONTENT.visibility, ...(parsed.visibility || {}) },
          hero: { ...DEFAULT_ABOUT_CONTENT.hero, ...(parsed.hero || {}) },
          highlights: parsed.highlights || DEFAULT_ABOUT_CONTENT.highlights,
          story: { ...DEFAULT_ABOUT_CONTENT.story, ...(parsed.story || {}) },
          stats: parsed.stats || DEFAULT_ABOUT_CONTENT.stats,
          process: {
            ...DEFAULT_ABOUT_CONTENT.process,
            ...(parsed.process || {}),
            steps: parsed.process?.steps || DEFAULT_ABOUT_CONTENT.process.steps,
          },
          values: {
            ...DEFAULT_ABOUT_CONTENT.values,
            ...(parsed.values || {}),
            pillars: parsed.values?.pillars || DEFAULT_ABOUT_CONTENT.values.pillars,
          },
          cta: { ...DEFAULT_ABOUT_CONTENT.cta, ...(parsed.cta || {}) },
        };
      }
      return DEFAULT_ABOUT_CONTENT;
    } catch {
      return DEFAULT_ABOUT_CONTENT;
    }
  });

  const handleUpdateAboutContent = (newContent) => {
    setAboutContent(newContent);
    try {
      localStorage.setItem('finegift_about_content', JSON.stringify(newContent));
    } catch (e) {
      console.error('Error saving about content:', e);
    }
  };

  // Persistent Contact Page Content state for CMS
  const [contactContent, setContactContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_contact_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONTACT_CONTENT,
          ...parsed,
          visibility: { ...DEFAULT_CONTACT_CONTENT.visibility, ...(parsed.visibility || {}) },
          hero: { ...DEFAULT_CONTACT_CONTENT.hero, ...(parsed.hero || {}) },
          channels: { ...DEFAULT_CONTACT_CONTENT.channels, ...(parsed.channels || {}) },
          form: {
            ...DEFAULT_CONTACT_CONTENT.form,
            ...(parsed.form || {}),
            prompts: parsed.form?.prompts || DEFAULT_CONTACT_CONTENT.form.prompts,
          },
          sidebar: {
            ...DEFAULT_CONTACT_CONTENT.sidebar,
            ...(parsed.sidebar || {}),
            whatsapp: { ...DEFAULT_CONTACT_CONTENT.sidebar.whatsapp, ...(parsed.sidebar?.whatsapp || {}) },
            call: { ...DEFAULT_CONTACT_CONTENT.sidebar.call, ...(parsed.sidebar?.call || {}) },
            studio: { ...DEFAULT_CONTACT_CONTENT.sidebar.studio, ...(parsed.sidebar?.studio || {}) },
            corporate: { ...DEFAULT_CONTACT_CONTENT.sidebar.corporate, ...(parsed.sidebar?.corporate || {}) },
          },
          workshop: {
            ...DEFAULT_CONTACT_CONTENT.workshop,
            ...(parsed.workshop || {}),
            perks: parsed.workshop?.perks || DEFAULT_CONTACT_CONTENT.workshop.perks,
            pills: parsed.workshop?.pills || DEFAULT_CONTACT_CONTENT.workshop.pills,
          },
        };
      }
      return DEFAULT_CONTACT_CONTENT;
    } catch {
      return DEFAULT_CONTACT_CONTENT;
    }
  });

  const handleUpdateContactContent = (newContent) => {
    setContactContent(newContent);
    try {
      localStorage.setItem('finegift_contact_content', JSON.stringify(newContent));
    } catch (e) {
      console.error('Error saving contact content:', e);
    }
  };

  // Persistent Legal & Policies Content state for CMS
  const [legalContent, setLegalContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_legal_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_LEGAL_CONTENT,
          ...parsed,
          terms: { ...DEFAULT_LEGAL_CONTENT.terms, ...(parsed.terms || {}) },
          privacy: { ...DEFAULT_LEGAL_CONTENT.privacy, ...(parsed.privacy || {}) },
          shipping: { ...DEFAULT_LEGAL_CONTENT.shipping, ...(parsed.shipping || {}) },
          returns: { ...DEFAULT_LEGAL_CONTENT.returns, ...(parsed.returns || {}) },
        };
      }
      return DEFAULT_LEGAL_CONTENT;
    } catch {
      return DEFAULT_LEGAL_CONTENT;
    }
  });

  const handleUpdateLegalContent = (newContent) => {
    setLegalContent(newContent);
    try {
      localStorage.setItem('finegift_legal_content', JSON.stringify(newContent));
    } catch (e) {
      console.error('Error saving legal content:', e);
    }
    // Asynchronously save to MySQL CMS API
    apiSaveCmsContent('legal_content', newContent).catch(err => {
      console.warn('Backend sync for legal_content error:', err);
    });
  };

  // Persistent Header & Footer Content state for CMS
  const [headerFooterContent, setHeaderFooterContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_header_footer_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_HEADER_FOOTER_CONTENT,
          ...parsed,
          header: {
            ...DEFAULT_HEADER_FOOTER_CONTENT.header,
            ...(parsed.header || {}),
            navItems: parsed.header?.navItems || DEFAULT_HEADER_FOOTER_CONTENT.header.navItems,
            occasionMenu: parsed.header?.occasionMenu || DEFAULT_HEADER_FOOTER_CONTENT.header.occasionMenu,
            corporateMenu: parsed.header?.corporateMenu || DEFAULT_HEADER_FOOTER_CONTENT.header.corporateMenu,
            visibility: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.visibility, ...(parsed.header?.visibility || {}) },
            topBar: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.topBar, ...(parsed.header?.topBar || {}) },
            socialLinks: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.socialLinks, ...(parsed.header?.socialLinks || {}) },
            brand: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.brand, ...(parsed.header?.brand || {}) },
            search: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.search, ...(parsed.header?.search || {}) },
            contact: { ...DEFAULT_HEADER_FOOTER_CONTENT.header.contact, ...(parsed.header?.contact || {}) },
          },
          footer: {
            ...DEFAULT_HEADER_FOOTER_CONTENT.footer,
            ...(parsed.footer || {}),
            quickLinks: parsed.footer?.quickLinks || DEFAULT_HEADER_FOOTER_CONTENT.footer.quickLinks,
            customerSupport: parsed.footer?.customerSupport || DEFAULT_HEADER_FOOTER_CONTENT.footer.customerSupport,
            visibility: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.visibility, ...(parsed.footer?.visibility || {}) },
            expressBanner: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.expressBanner, ...(parsed.footer?.expressBanner || {}) },
            instagramSection: {
              ...DEFAULT_HEADER_FOOTER_CONTENT.footer.instagramSection,
              ...(parsed.footer?.instagramSection || {}),
              posts: parsed.footer?.instagramSection?.posts || DEFAULT_HEADER_FOOTER_CONTENT.footer.instagramSection.posts,
            },
            newsletter: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.newsletter, ...(parsed.footer?.newsletter || {}) },
            brand: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.brand, ...(parsed.footer?.brand || {}) },
            socialLinks: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.socialLinks, ...(parsed.footer?.socialLinks || {}) },
            contactInfo: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.contactInfo, ...(parsed.footer?.contactInfo || {}) },
            bottomBar: { ...DEFAULT_HEADER_FOOTER_CONTENT.footer.bottomBar, ...(parsed.footer?.bottomBar || {}) },
          },
        };
      }
      return DEFAULT_HEADER_FOOTER_CONTENT;
    } catch {
      return DEFAULT_HEADER_FOOTER_CONTENT;
    }
  });

  const handleUpdateHeaderFooterContent = (newContent) => {
    setHeaderFooterContent(newContent);
    try {
      localStorage.setItem('finegift_header_footer_content', JSON.stringify(newContent));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('finegift_store_sync');
        bc.postMessage({ key: 'finegift_header_footer_content', data: newContent });
        bc.close();
      }
    } catch (e) {
      console.error('Error saving header/footer content:', e);
    }
    // Asynchronously save to MySQL CMS API
    apiSaveCmsContent('header_footer_content', newContent).catch(err => {
      console.warn('Backend sync for header_footer_content error:', err);
    });
  };

  // Persistent Occasions Content state for CMS
  const [occasionsContent, setOccasionsContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_occasions_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.occasions) && parsed.occasions.length > 0) {
          return parsed;
        }
      }
      return DEFAULT_OCCASIONS_STATE;
    } catch {
      return DEFAULT_OCCASIONS_STATE;
    }
  });

  const [activeOccasionSlug, setActiveOccasionSlug] = useState('engagement-gifts');

  const handleUpdateOccasionContent = (newContent) => {
    setOccasionsContent(newContent);
    try {
      localStorage.setItem('finegift_occasions_content', JSON.stringify(newContent));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('finegift_store_sync');
        bc.postMessage({ key: 'finegift_occasions_content', data: newContent });
        bc.close();
      }
    } catch (e) {
      console.error('Error saving occasion content:', e);
    }
    // Asynchronously save to MySQL CMS API
    apiSaveCmsContent('occasion_content', newContent).catch(err => {
      console.warn('Backend sync for occasion_content error:', err);
    });
  };

  // Persistent Blog Content state for CMS
  const [blogContent, setBlogContent] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_blog_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.posts)) {
          // If the cached blog content has the old demo posts (post-2 through post-6), clean them out
          const hasOldDemoPosts = parsed.posts.some((p) =>
            ['post-2', 'post-3', 'post-4', 'post-5', 'post-6'].includes(p.id)
          );
          if (hasOldDemoPosts) {
            const cleaned = {
              ...parsed,
              posts: DEFAULT_BLOG_POSTS
            };
            try {
              localStorage.setItem('finegift_blog_content', JSON.stringify(cleaned));
            } catch {}
            return cleaned;
          }
          if (parsed.posts.length > 0) {
            return parsed;
          }
        }
      }
      return DEFAULT_BLOG_CONTENT;
    } catch {
      return DEFAULT_BLOG_CONTENT;
    }
  });

  const [activeBlogSlug, setActiveBlogSlug] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || '';
      const hash = window.location.hash || '';
      const match = path.match(/^\/blog\/([^/?#]+)/i) || hash.match(/^#\/?blog\/([^/?#]+)/i);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }
    return '10-unique-engagement-gift-ideas-for-a-perfect-start';
  });

  const handleUpdateBlogContent = (newContent) => {
    setBlogContent(newContent);
    try {
      localStorage.setItem('finegift_blog_content', JSON.stringify(newContent));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('finegift_store_sync');
        bc.postMessage({ key: 'finegift_blog_content', data: newContent });
        bc.close();
      }
    } catch (e) {
      console.error('Error saving blog content:', e);
    }
    // Asynchronously save to MySQL CMS API
    apiSaveCmsContent('blog_content', newContent).catch(err => {
      console.warn('Backend sync for blog_content error:', err);
    });
  };

  // Persistent Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.map((item) => {
            const img = item.image_url || item.image || item.fallback_image_url || '/assets/images/cups-product.avif';
            return {
              ...item,
              image_url: img,
              image: img,
              price: Number(item.price) || 0
            };
          })
        : [];
    } catch {
      return [];
    }
  });

  // Persistent Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_wishlist');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.map((item) => {
            const img = item.image_url || item.image || item.fallback_image_url || '/assets/images/cups-product.avif';
            return {
              ...item,
              image_url: img,
              image: img,
              price: Number(item.price) || 0
            };
          })
        : [];
    } catch {
      return [];
    }
  });

  // Persistent Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent User state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('finegift_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Drawer / Modal visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'

  // Legal policy tab state: 'terms' | 'privacy' | 'shipping' | 'returns'
  const [legalTab, setLegalTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const url = (window.location.pathname + window.location.hash).toLowerCase();
      if (url.includes('privacy')) return 'privacy';
      if (url.includes('shipping')) return 'shipping';
      if (url.includes('return') || url.includes('refund')) return 'returns';
    }
    return 'terms';
  });

  // Shop filter state for cross-component navigation
  const [shopCategory, setShopCategory] = useState('all');
  const [shopSubCategory, setShopSubCategory] = useState('all');
  const [shopSearchQuery, setShopSearchQuery] = useState('');

  const handleOpenAuth = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'info' });

  // Routing state ('home' | 'about' | 'contact' | 'dashboard' | 'legal' | 'blog' | 'blog-detail')
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      const fullUrl = path + hash;

      if (path.startsWith('/blog/') || hash.startsWith('#/blog/') || hash.startsWith('#blog/')) {
        return 'blog-detail';
      }
      if (path === '/blog' || path === '/blogs' || hash === '#blog' || hash === '#/blog' || hash === '#blogs') {
        return 'blog';
      }
      if (fullUrl.includes('terms') || fullUrl.includes('privacy') || fullUrl.includes('shipping') || fullUrl.includes('return') || fullUrl.includes('refund')) return 'legal';
      if (fullUrl.includes('engagement') || fullUrl.includes('occasion')) return 'occasion-detail';
      if (fullUrl.includes('dashboard') || fullUrl.includes('account')) return 'dashboard';
      if (fullUrl.includes('admin')) return 'admin';
      if (fullUrl.includes('shop') || fullUrl.includes('custom-design') || fullUrl.includes('category')) return 'shop';
      if (fullUrl.includes('about')) return 'about';
      if (fullUrl.includes('contact')) return 'contact';
      if (fullUrl.includes('blog')) return 'blog';
    }
    return 'home';
  });

  // LocalStorage synchronizers
  useEffect(() => {
    try {
      localStorage.setItem('finegift_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('finegift_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('finegift_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('finegift_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('finegift_user');
      }
    } catch {}
  }, [user]);

  // Synchronize URL change (both popstate for back/forward and hashchange for legacy links)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      const full = path + hash;

      if (path.startsWith('/blog/') || hash.startsWith('#/blog/') || hash.startsWith('#blog/')) {
        const raw = (window.location.pathname || '').replace(/^\/blog\//i, '').split('?')[0].split('#')[0] ||
                    (window.location.hash || '').replace(/^#\/?blog\//i, '').split('?')[0];
        if (raw) {
          setActiveBlogSlug(decodeURIComponent(raw));
        }
        setCurrentPage('blog-detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (path === '/blog' || path === '/blogs' || hash === '#blog' || hash === '#/blog' || hash === '#blogs') {
        setCurrentPage('blog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (full.includes('cart')) {
        setIsCartOpen(true);
      } else if (full.includes('wishlist')) {
        setIsWishlistOpen(true);
      } else if (full.includes('login')) {
        handleOpenAuth('login');
      } else if (full.includes('signup') || full.includes('register')) {
        handleOpenAuth('signup');
      } else if (full.includes('terms')) {
        setLegalTab('terms');
        setCurrentPage('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('privacy')) {
        setLegalTab('privacy');
        setCurrentPage('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('shipping')) {
        setLegalTab('shipping');
        setCurrentPage('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('return') || full.includes('refund')) {
        setLegalTab('returns');
        setCurrentPage('legal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (
        full.includes('engagement') ||
        full.includes('occasion') ||
        (occasionsContent?.occasions || []).some(o => o.slug && full.includes(o.slug.toLowerCase()))
      ) {
        const matched = (occasionsContent?.occasions || []).find(o => o.slug && full.includes(o.slug.toLowerCase()));
        setActiveOccasionSlug(matched ? matched.slug : 'engagement-gifts');
        setCurrentPage('occasion-detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('account') || full.includes('dashboard')) {
        setCurrentPage('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('admin')) {
        setCurrentPage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('shop') || full.includes('custom-design') || full.includes('category')) {
        setCurrentPage('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('about')) {
        setCurrentPage('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (full.includes('contact')) {
        setCurrentPage('contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentPage('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [user]);

  const showNotification = (type, title, message) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // Cart operations
  const handleAddToCart = (product) => {
    if (!product) return;
    const img = product.image_url || product.image || product.img || product.fallback_image_url || '/assets/images/cups-product.avif';
    const normalized = {
      ...product,
      image_url: img,
      image: img,
      price: Number(product.price) || 0
    };

    setCart((prev) => {
      const existing = prev.find((item) => item.id === normalized.id);
      if (existing) {
        return prev.map((item) =>
          item.id === normalized.id
            ? { ...item, ...normalized, quantity: (item.quantity || 1) + (normalized.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...normalized, quantity: normalized.quantity || 1 }];
    });
    showNotification('success', 'Added to Bag', `"${normalized.name}" added to your bag!`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showNotification('info', 'Bag Updated', 'Item removed from your bag.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleAddToWishlist = (product) => {
    if (!product) return;
    const img = product.image_url || product.image || product.img || product.fallback_image_url || '/assets/images/cups-product.avif';
    const normalized = {
      ...product,
      image_url: img,
      image: img,
      price: Number(product.price) || 0
    };

    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === normalized.id);
      if (exists) {
        showNotification('info', 'Wishlist Notice', `"${normalized.name}" is already in your wishlist.`);
        return prev;
      }
      showNotification('success', 'Saved to Wishlist', `"${normalized.name}" saved to wishlist!`);
      return [...prev, normalized];
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    showNotification('info', 'Wishlist Notice', 'Item removed from wishlist.');
  };

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    showNotification('success', 'Moved to Bag', `"${product.name}" moved to your bag!`);
  };

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    setCart((prev) => {
      const updated = [...prev];
      wishlist.forEach((item) => {
        const found = updated.find((u) => u.id === item.id);
        if (found) {
          found.quantity = (found.quantity || 1) + 1;
        } else {
          updated.push({ ...item, quantity: 1 });
        }
      });
      return updated;
    });
    setWishlist([]);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    showNotification('success', 'All Items Moved', 'All wishlist items moved to your bag!');
  };

  const handleOrderPlaced = (newOrder) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem('finegift_orders', JSON.stringify(updated));
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('finegift_store_sync');
          bc.postMessage({ key: 'finegift_orders', data: updated });
          bc.close();
        }
      } catch {}
      return updated;
    });

    // Sync order to remote MySQL database
    apiCreateOrder(newOrder).catch(console.warn);

    // Also link order in registered customer roster finegift_registered_users
    try {
      const storedUsers = localStorage.getItem('finegift_registered_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        if (Array.isArray(users)) {
          const updatedUsers = users.map((u) => {
            if (user && (u.id === user.id || u.email?.toLowerCase() === user.email?.toLowerCase())) {
              return {
                ...u,
                ordersCount: (u.ordersCount || 0) + 1,
                lifetimeSpend: (u.lifetimeSpend || 0) + (newOrder.total || 0),
                orders: [newOrder, ...(u.orders || [])]
              };
            }
            return u;
          });
          localStorage.setItem('finegift_registered_users', JSON.stringify(updatedUsers));
          if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            const bc = new BroadcastChannel('finegift_store_sync');
            bc.postMessage({ key: 'finegift_registered_users', data: updatedUsers });
            bc.close();
          }
        }
      }
    } catch {}

    showNotification('success', 'Order Placed!', `Your order #${newOrder.id} has been placed.`);
  };

  const handleSearch = ({ query, categoryId }) => {
    let catName = 'all';
    if (categoryId && categoryId !== 'all') {
      const match = categories.find((c) => String(c.id) === String(categoryId));
      if (match) catName = match.name;
    }
    setShopCategory(catName);
    setShopSearchQuery(query || '');
    setCurrentPage('shop');
    try {
      window.history.pushState({}, '', '/shop');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (query) {
      showNotification('info', 'Searching Shop', `Filtering catalog for "${query}"`);
    }
  };

  const handleNavigate = (path) => {
    if (path === '/cart' || path === '#cart') {
      setIsCartOpen(true);
      return;
    }
    if (path === '/wishlist' || path === '#wishlist') {
      setIsWishlistOpen(true);
      return;
    }
    if (
      path === '/login-register' ||
      path === '/login' ||
      path === '#login'
    ) {
      handleOpenAuth('login');
      return;
    }
    if (path === '/signup' || path === '#signup') {
      handleOpenAuth('signup');
      return;
    }

    if (path === '/admin' || path === '#admin' || path.startsWith('/admin')) {
      setCurrentPage('admin');
      try { window.history.pushState({}, '', '/admin'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path === '/my-account' ||
      path === '/dashboard' ||
      path === '#account' ||
      path === '#dashboard'
    ) {
      setCurrentPage('dashboard');
      try { window.history.pushState({}, '', '/dashboard'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path === '/terms' ||
      path === '#terms' ||
      path === '/terms-and-conditions'
    ) {
      setLegalTab('terms');
      setCurrentPage('legal');
      try { window.history.pushState({}, '', '/terms'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path === '/privacy-policy' ||
      path === '/privacy' ||
      path === '#privacy'
    ) {
      setLegalTab('privacy');
      setCurrentPage('legal');
      try { window.history.pushState({}, '', '/privacy-policy'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path === '/shipping' ||
      path === '#shipping' ||
      path === '/shipping-policy'
    ) {
      setLegalTab('shipping');
      setCurrentPage('legal');
      try { window.history.pushState({}, '', '/shipping'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path === '/returns' ||
      path === '#returns' ||
      path === '/return-and-refund' ||
      path === '/refund'
    ) {
      setLegalTab('returns');
      setCurrentPage('legal');
      try { window.history.pushState({}, '', '/returns'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path.startsWith('/shop') ||
      path === '#shop' ||
      path === '/custom-design' ||
      path === '#custom-design' ||
      path.startsWith('/category/')
    ) {
      if (path.startsWith('/category/')) {
        const raw = path.replace('/category/', '');
        const [catPart, queryPart] = raw.split('?');
        setShopCategory(decodeURIComponent(catPart));
        if (queryPart) {
          const params = new URLSearchParams(queryPart);
          const sub = params.get('sub');
          setShopSubCategory(sub ? decodeURIComponent(sub) : 'all');
        } else {
          setShopSubCategory('all');
        }
      } else {
        setShopCategory('all');
        setShopSubCategory('all');
      }
      setCurrentPage('shop');
      try { window.history.pushState({}, '', '/shop'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path.startsWith('/contact') || path === '#contact' || path === '#contact-page') {
      setCurrentPage('contact');
      try { window.history.pushState({}, '', '/contact'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '/about-us' || path === '/about' || path === '#about') {
      setCurrentPage('about');
      try { window.history.pushState({}, '', '/about'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (
      path === '/engagement-gifts' ||
      path === '/occasion/engagement' ||
      path.includes('occasion=engagement') ||
      path.includes('engagement') ||
      path === '#engagement-gifts' ||
      path.startsWith('/occasion') ||
      (occasionsContent?.occasions || []).some(o => o.slug && (path === `/${o.slug}` || path === `#${o.slug}` || path.includes(o.slug)))
    ) {
      const matched = (occasionsContent?.occasions || []).find(o => o.slug && (path === `/${o.slug}` || path === `#${o.slug}` || path.includes(o.slug)));
      const chosenSlug = matched ? matched.slug : 'engagement-gifts';
      setActiveOccasionSlug(chosenSlug);
      setCurrentPage('occasion-detail');
      try { window.history.pushState({}, '', `/${chosenSlug}`); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '/blog' || path === '#blog' || path === '/blogs' || path === '#blogs') {
      setCurrentPage('blog');
      try { window.history.pushState({}, '', '/blog'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path.startsWith('/blog/') || path.startsWith('#blog/') || path.startsWith('#/blog/')) {
      const raw = path.replace(/^#?\/?blog\//i, '').split('?')[0].split('#')[0];
      if (raw) {
        const cleanSlug = decodeURIComponent(raw);
        setActiveBlogSlug(cleanSlug);
        setCurrentPage('blog-detail');
        try { window.history.pushState({}, '', `/blog/${raw}`); } catch {}
      } else {
        setCurrentPage('blog');
        try { window.history.pushState({}, '', '/blog'); } catch {}
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === '/' || path === '#home' || path === '/home') {
      setCurrentPage('home');
      try { window.history.pushState({}, '', '/'); } catch {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showNotification('info', 'Page Notice', `Navigating to ${path}`);
    }
  };

  const handleSubscribe = (email) => {
    showNotification('success', 'Subscribed', `Thank you for subscribing with ${email}!`);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const activePath =
    currentPage === 'admin'
      ? '/admin'
      : currentPage === 'shop'
      ? '/shop'
      : currentPage === 'about'
      ? '/about-us'
      : currentPage === 'contact'
      ? '/contact'
      : currentPage === 'occasion-detail'
      ? `/${activeOccasionSlug || 'engagement-gifts'}`
      : currentPage === 'blog'
      ? '/blog'
      : currentPage === 'blog-detail'
      ? `/blog/${activeBlogSlug || ''}`
      : currentPage === 'dashboard'
      ? '/my-account'
      : currentPage === 'legal'
      ? legalTab === 'privacy'
        ? '/privacy-policy'
        : '/terms'
      : '/';

  if (currentPage === 'admin') {
    return (
      <>
        <AdminDashboard
          user={user}
          orders={orders}
          products={products}
          categories={categories}
          homeContent={homeContent}
          aboutContent={aboutContent}
          contactContent={contactContent}
          legalContent={legalContent}
          headerFooterContent={headerFooterContent}
          occasionsContent={occasionsContent}
          blogContent={blogContent}
          onUpdateProducts={handleUpdateProducts}
          onUpdateOrders={(newOrds) => setOrders(newOrds)}
          onUpdateCategories={(newCats) => {
            setCategories(newCats);
            try {
              localStorage.setItem('finegift_admin_categories', JSON.stringify(newCats));
            } catch {}
          }}
          onUpdateHomeContent={handleUpdateHomeContent}
          onUpdateAboutContent={handleUpdateAboutContent}
          onUpdateContactContent={handleUpdateContactContent}
          onUpdateLegalContent={handleUpdateLegalContent}
          onUpdateHeaderFooterContent={handleUpdateHeaderFooterContent}
          onUpdateOccasionContent={handleUpdateOccasionContent}
          onUpdateBlogContent={handleUpdateBlogContent}
          onNavigate={handleNavigate}
          showNotification={showNotification}
        />
        <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* 1. Header (Sticky navigation, mega menus, search, cart counter, modals trigger) */}
      <Header
        headerContent={headerFooterContent?.header}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        user={user}
        categories={categories}
        activePath={activePath}
        onSearch={handleSearch}
        onNavigate={handleNavigate}
        onLogout={() => {
          setUser(null);
          showNotification('info', 'Signed Out', 'You have been signed out.');
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => handleNavigate('/my-account')}
        onOpenAuth={handleOpenAuth}
      />

      {/* 2. Page Content: Contact vs About Us vs User Dashboard vs Legal Page vs Home Page */}
      {currentPage === 'contact' ? (
        <ContactPage
          contactContent={contactContent}
          onNavigate={handleNavigate}
          showNotification={showNotification}
        />
      ) : currentPage === 'about' ? (
        <AboutPage
          aboutContent={aboutContent}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
        />
      ) : currentPage === 'shop' ? (
        <ShopPage
          categories={categories}
          products={products}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          wishlist={wishlist}
          onNavigate={handleNavigate}
          showNotification={showNotification}
          initialCategory={shopCategory}
          initialSubCategory={shopSubCategory}
          initialSearchQuery={shopSearchQuery}
        />
      ) : currentPage === 'dashboard' ? (
        <UserDashboard
          user={user}
          orders={orders}
          wishlist={wishlist}
          cart={cart}
          onNavigate={handleNavigate}
          onOpenAuth={handleOpenAuth}
          onLogout={() => {
            setUser(null);
            showNotification('info', 'Signed Out', 'You have been safely signed out.');
          }}
          onUpdateUser={(updated) => {
            setUser(updated);
            showNotification('success', 'Profile Saved', 'Profile changes updated.');
          }}
          onAddToCart={handleAddToCart}
          onRemoveWishlist={handleRemoveFromWishlist}
          showNotification={showNotification}
        />
      ) : currentPage === 'legal' ? (
        <LegalPage
          initialTab={legalTab}
          legalContent={legalContent}
          onNavigate={handleNavigate}
        />
      ) : currentPage === 'occasion-detail' ? (
        <EngagementGiftsPage
          occasionData={
            (occasionsContent?.occasions || []).find(
              (o) => o.slug === activeOccasionSlug || o.id === activeOccasionSlug
            ) ||
            (occasionsContent?.occasions || [])[0] ||
            DEFAULT_OCCASION_DATA
          }
          wishlist={wishlist}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onProductClick={(p) => {
            setShopCategory(p.category || 'Gifts');
            setCurrentPage('shop');
            try { window.history.pushState({}, '', '/shop'); } catch {}
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigate={handleNavigate}
        />
      ) : currentPage === 'blog' ? (
        <BlogListingPage
          blogContent={blogContent}
          onNavigate={handleNavigate}
          showNotification={showNotification}
        />
      ) : currentPage === 'blog-detail' ? (
        <BlogDetailPage
          slug={activeBlogSlug}
          blogContent={blogContent}
          onNavigate={handleNavigate}
          showNotification={showNotification}
        />
      ) : (
        <HomePage
          homeContent={homeContent}
          categories={categories}
          products={products}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onProductClick={(p) => {
            setCurrentPage('shop');
            try { window.history.pushState({}, '', '/shop'); } catch {}
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onCategoryClick={(c) => {
            setShopCategory(c.name);
            setCurrentPage('shop');
            try { window.history.pushState({}, '', `/category/${encodeURIComponent(c.name)}`); } catch {}
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
        />
      )}

      {/* 3. Footer (Features strip, footer links, newsletter form, store badges) */}
      <Footer
        footerContent={headerFooterContent?.footer}
        onSubscribe={handleSubscribe}
        onNavigate={handleNavigate}
      />

      {/* 4. Functional Overlays: Cart Drawer, Wishlist Modal, Account Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onNavigate={handleNavigate}
        user={user}
        onOrderPlaced={handleOrderPlaced}
        onOpenAuth={handleOpenAuth}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
        onMoveAllToCart={handleMoveAllToCart}
        onNavigate={handleNavigate}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        onUpdateUser={(updated) => {
          setUser(updated);
          showNotification('success', 'Profile Saved', 'Profile changes updated.');
        }}
        onLogout={() => {
          setUser(null);
          showNotification('info', 'Signed Out', 'You have signed out.');
        }}
        onLogin={(loggedUser) => {
          setUser(loggedUser);
          showNotification('success', 'Welcome Back', `Logged in as ${loggedUser.name}!`);
        }}
        onOpenAuth={handleOpenAuth}
        orders={orders}
        onOpenWishlist={() => {
          setIsAccountOpen(false);
          setIsWishlistOpen(true);
        }}
        onOpenCart={() => {
          setIsAccountOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* 5. Authentication Modal (Sign In, Sign Up & Forgot Password) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authTab}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
        }}
        showToast={showNotification}
        onNavigate={handleNavigate}
      />

      {/* 5. Global UI Components & Preloader */}
      <Preloader />
      <Toast toast={toast} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
      <WhatsAppButton whatsappLink={headerFooterContent?.header?.contact?.whatsappLink || contactContent?.channels?.whatsappLink || 'https://wa.me/910000000000'} />
      <BackToTop />
    </div>
  );
}
