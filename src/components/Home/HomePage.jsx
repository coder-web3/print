import React from 'react';
import './HomePage.css';
import HeroSection from './HeroSection';
import CategoryStrip from './CategoryStrip';
import FeaturedCategories from './FeaturedCategories';
import PromoBanners from './PromoBanners';
import DealsOfTheDay from './DealsOfTheDay';
import WhyChooseSection from './WhyChooseSection';
import ProductListsSection from './ProductListsSection';
import { DiscountBanner, Testimonials } from './DiscountBanner';
import { testimonialsData } from '../../data/mockData';

export default function HomePage({
  categories = [],
  products = [],
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onProductClick = () => {},
  onCategoryClick = () => {},
  onNavigate = () => {},
  onSearch = () => {}
}) {
  // Slicing products for different sections (same logic as PHP)
  const dealsOfDay = products.slice(0, 4);
  const popularProducts = products.slice(0, 8);
  const colNew = products.slice(0, 3);
  const colTop = products.slice(3, 6);
  const colBest = products.slice(5, 8);

  return (
    <main className="homepage-wrapper">
      {/* 1. Hero Section */}
      <HeroSection onSearch={onSearch} onNavigate={onNavigate} />

      {/* 2. Panoramic Category Strip */}
      <CategoryStrip onCategoryClick={onCategoryClick} onNavigate={onNavigate} />

      {/* 3. Featured Categories Slider */}
      <FeaturedCategories categories={categories} onCategoryClick={onCategoryClick} />

      {/* 3. Promo Banners */}
      <PromoBanners onNavigate={onNavigate} />

      {/* 4. Deals of the Day */}
      <DealsOfTheDay
        products={dealsOfDay}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onProductClick={onProductClick}
      />

      {/* 5. Feel-Good Shopping Weekend Discount Banner */}
      <section className="discount-banner-section">
        <div className="container">
          <DiscountBanner onShopClick={() => onNavigate('/shop')} />
        </div>
      </section>

      {/* 6. Why Choose Fine Gift Studio & Corporate Bulk Gifts Banner */}
      <WhyChooseSection onNavigate={onNavigate} />

      {/* 7. Product Lists Columns (Deals & Collections) */}
      <ProductListsSection
        newCollection={colNew}
        topRated={colTop}
        bestSellers={colBest}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        onProductClick={onProductClick}
        onNavigate={onNavigate}
      />

      {/* 8. Customer Testimonials */}
      <section className="testimonials-section-wrapper">
        <div className="container">
          <Testimonials testimonials={testimonialsData} />
        </div>
      </section>
    </main>
  );
}
