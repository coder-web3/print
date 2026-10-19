import React from 'react';
import './HomePage.css';
import HeroSection from './HeroSection';
import CategoryStrip from './CategoryStrip';
import FeaturedCategories from './FeaturedCategories';
import PromoBanners from './PromoBanners';
import OccasionBanner from './OccasionBanner';
import DealsOfTheDay from './DealsOfTheDay';
import WhyChooseSection from './WhyChooseSection';
import ProductListsSection from './ProductListsSection';
import { DiscountBanner, Testimonials } from './DiscountBanner';
import { testimonialsData } from '../../data/mockData';
import { DEFAULT_HOME_CONTENT } from '../../data/homeContentData';

export default function HomePage({
  homeContent = DEFAULT_HOME_CONTENT,
  categories = [],
  products = [],
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onProductClick = () => {},
  onCategoryClick = () => {},
  onNavigate = () => {},
  onSearch = () => {}
}) {
  const content = homeContent || DEFAULT_HOME_CONTENT;
  const visibility = content?.visibility || DEFAULT_HOME_CONTENT.visibility;

  // Slicing products for different sections (same logic as PHP)
  const dealsOfDay = products.slice(0, 4);
  const colNew = products.slice(0, 3);
  const colTop = products.slice(3, 6);
  const colBest = products.slice(5, 8);

  return (
    <main className="homepage-wrapper">
      {/* 1. Hero Section */}
      {visibility.hero !== false && (
        <HeroSection content={content?.hero} onSearch={onSearch} onNavigate={onNavigate} />
      )}

      {/* 2. Panoramic Category Strip */}
      {visibility.categoryStrip !== false && (
        <CategoryStrip content={content?.categoryStrip} onCategoryClick={onCategoryClick} onNavigate={onNavigate} />
      )}

      {/* 3. Featured Categories Slider */}
      {visibility.featuredCategories !== false && (
        <FeaturedCategories content={content?.featuredCategories} categories={categories} onCategoryClick={onCategoryClick} />
      )}

      {/* 4. Promo Banners */}
      {visibility.promoBanners !== false && (
        <PromoBanners content={content?.promoBanners} onNavigate={onNavigate} />
      )}

      {/* 4B. Occasion Feature Banner (Engagement Gifts) */}
      {visibility.occasionBanner !== false && (
        <OccasionBanner content={content?.occasionBanner} onNavigate={onNavigate} />
      )}

      {/* 5. Deals of the Day */}
      {visibility.dealsOfDay !== false && (
        <DealsOfTheDay
          content={content?.dealsOfDay}
          products={dealsOfDay}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          onProductClick={onProductClick}
        />
      )}

      {/* 6. Feel-Good Shopping Weekend Discount Banner */}
      {visibility.discountBanner !== false && (
        <section className="discount-banner-section">
          <div className="container">
            <DiscountBanner content={content?.discountBanner} onShopClick={() => onNavigate('/shop')} />
          </div>
        </section>
      )}

      {/* 7. Why Choose Fine Gift Studio & Corporate Bulk Gifts Banner */}
      {visibility.whyChoose !== false && (
        <WhyChooseSection content={content?.whyChoose} onNavigate={onNavigate} />
      )}

      {/* 8. Product Lists Columns (Deals & Collections) */}
      {visibility.productLists !== false && (
        <ProductListsSection
          content={content?.productLists}
          newCollection={colNew}
          topRated={colTop}
          bestSellers={colBest}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
          onProductClick={onProductClick}
          onNavigate={onNavigate}
        />
      )}

      {/* 9. Customer Testimonials */}
      {visibility.testimonials !== false && (
        <section className="testimonials-section-wrapper">
          <div className="container">
            <Testimonials content={content?.testimonials} testimonials={testimonialsData} />
          </div>
        </section>
      )}
    </main>
  );
}
