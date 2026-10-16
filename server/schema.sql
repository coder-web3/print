-- Fine Gift Studio Production MySQL Database Schema
-- Charset: utf8mb4, Collation: utf8mb4_unicode_ci

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  slug VARCHAR(150) DEFAULT NULL,
  icon VARCHAR(100) DEFAULT 'fa-solid fa-gift',
  subcategories VARCHAR(255) DEFAULT NULL,
  image_url LONGTEXT DEFAULT NULL,
  item_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cat_name VARCHAR(150) NOT NULL,
  sub_cat_name VARCHAR(150) DEFAULT NULL,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2) DEFAULT 0.00,
  rating DECIMAL(3, 1) DEFAULT 4.8,
  reviews_count INT DEFAULT 12,
  image_url LONGTEXT NOT NULL,
  fallback_image_url LONGTEXT DEFAULT NULL,
  badge VARCHAR(80) DEFAULT NULL,
  material VARCHAR(150) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  in_stock TINYINT(1) DEFAULT 1,
  show_on_home TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_cat (cat_name),
  INDEX idx_products_subcat (sub_cat_name),
  INDEX idx_products_price (price),
  INDEX idx_products_home (show_on_home)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Users / Customers / Admins Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(50) DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  status VARCHAR(50) DEFAULT 'active',
  provider VARCHAR(50) DEFAULT 'email',
  wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
  city VARCHAR(100) DEFAULT 'Mangalore',
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(100) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(191) NOT NULL,
  customer_phone VARCHAR(50) DEFAULT NULL,
  items_json LONGTEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Processing',
  shipping_address_json TEXT DEFAULT NULL,
  awb VARCHAR(100) DEFAULT NULL,
  courier VARCHAR(100) DEFAULT 'BlueDart Express',
  payment_method VARCHAR(80) DEFAULT 'Online / UPI',
  payment_status VARCHAR(50) DEFAULT 'Paid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_orders_email (customer_email),
  INDEX idx_orders_status (status),
  INDEX idx_orders_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Promotional Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id VARCHAR(100) PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(20) DEFAULT 'percentage',
  value DECIMAL(10, 2) NOT NULL,
  min_order DECIMAL(10, 2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'active',
  customer_id VARCHAR(100) DEFAULT NULL,
  customer_email VARCHAR(150) DEFAULT NULL,
  customer_name VARCHAR(150) DEFAULT NULL,
  title VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Media Assets Table
CREATE TABLE IF NOT EXISTS media (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  size VARCHAR(50) DEFAULT NULL,
  dimensions VARCHAR(50) DEFAULT NULL,
  type VARCHAR(50) DEFAULT 'image/avif',
  category VARCHAR(100) DEFAULT 'Product Photos',
  alt VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. CMS Content Store (Homepage, About, Contact)
CREATE TABLE IF NOT EXISTS cms_content (
  content_key VARCHAR(100) PRIMARY KEY,
  data_json LONGTEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. CMS Audit Trail Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(100) PRIMARY KEY,
  action VARCHAR(150) NOT NULL,
  detail TEXT NOT NULL,
  user_name VARCHAR(150) DEFAULT 'Studio Admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
