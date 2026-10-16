import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  console.log('🚀 Initializing MySQL Database tables and seed data...');

  try {
    // 1. Run schema DDL
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const cleanedSql = schemaSql
      .split('\n')
      .map(line => line.trim())
      .filter(line => !line.startsWith('--'))
      .join('\n');

    const statements = cleanedSql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const sql of statements) {
      console.log('Running DDL statement...');
      await pool.query(sql);
    }
    console.log('✅ All tables verified / created successfully!');

    // 2. Seed Categories if empty
    const [existingCats] = await pool.query('SELECT COUNT(*) as count FROM categories');
    if (existingCats[0].count === 0) {
      console.log('📦 Seeding initial categories...');
      const defaultCategories = [
        { id: 'cat_1', name: 'Cups & Mugs', slug: 'cups-mugs', icon: 'fa-solid fa-mug-hot', item_count: 94 },
        { id: 'cat_2', name: 'Photo Frames', slug: 'photo-frames', icon: 'fa-regular fa-image', item_count: 62 },
        { id: 'cat_3', name: 'Personalized Pens', slug: 'pens', icon: 'fa-solid fa-pen-nib', item_count: 45 },
        { id: 'cat_4', name: 'Custom Wallets', slug: 'wallets', icon: 'fa-solid fa-wallet', item_count: 38 },
        { id: 'cat_5', name: 'Home Decor & Lamps', slug: 'lamps', icon: 'fa-solid fa-lightbulb', item_count: 53 },
        { id: 'cat_6', name: 'Corporate Gifts', slug: 'corporate', icon: 'fa-solid fa-briefcase', item_count: 70 },
        { id: 'cat_7', name: 'T-Shirts & Apparel', slug: 'apparel', icon: 'fa-solid fa-shirt', item_count: 120 },
        { id: 'cat_8', name: 'Gift Hampers & Sets', slug: 'hampers', icon: 'fa-solid fa-gift', item_count: 85 }
      ];

      for (const cat of defaultCategories) {
        await query(
          'INSERT INTO categories (id, name, slug, icon, item_count) VALUES (?, ?, ?, ?, ?)',
          [cat.id, cat.name, cat.slug, cat.icon, cat.item_count]
        );
      }
      console.log(`✅ Seeded ${defaultCategories.length} categories.`);
    }

    // 3. Seed Products if empty
    const [existingProducts] = await pool.query('SELECT COUNT(*) as count FROM products');
    if (existingProducts[0].count === 0) {
      console.log('📦 Seeding initial catalog products...');
      const defaultProducts = [
        {
          id: '101',
          name: 'Premium Real Black Leather Wallet',
          cat_name: 'Custom Wallets',
          price: 699,
          old_price: 1199,
          rating: 4.8,
          reviews_count: 124,
          image_url: '/assets/images/wallets.avif',
          fallback_image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
          badge: 'Best Seller',
          material: 'Genuine Top-Grain Leather',
          description: 'Laser-engraved personalized name and lucky charm tag.',
          show_on_home: 1
        },
        {
          id: '102',
          name: 'Custom Printed Magic Mug',
          cat_name: 'Cups & Mugs',
          price: 349,
          old_price: 549,
          rating: 4.7,
          reviews_count: 98,
          image_url: '/assets/images/cups-product.avif',
          fallback_image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80',
          badge: 'Popular',
          material: 'Ceramic with Thermal Coating',
          description: 'Heat-activated color changing ceramic mug that reveals your custom photo.',
          show_on_home: 1
        },
        {
          id: '103',
          name: 'Premium Couple Acrylic Photo Frame',
          cat_name: 'Photo Frames',
          price: 899,
          old_price: 1749,
          rating: 4.9,
          reviews_count: 210,
          image_url: '/assets/images/frames.avif',
          fallback_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          badge: 'Trending',
          material: 'Crystal Clear Cast Acrylic',
          description: 'High-definition UV printed acrylic plaque with warm LED wooden dock.',
          show_on_home: 1
        },
        {
          id: '104',
          name: 'Customized Graphic Cotton T-Shirt',
          cat_name: 'T-Shirts & Apparel',
          price: 499,
          old_price: 899,
          rating: 4.6,
          reviews_count: 75,
          image_url: '/assets/images/t-shirt.avif',
          fallback_image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
          badge: 'Trending',
          material: '100% Bio-Washed Combed Cotton',
          description: 'Breathable 220 GSM fabric with vibrant DTF long-lasting prints.',
          show_on_home: 1
        },
        {
          id: '105',
          name: 'Laser Engraved Executive Metal Pen',
          cat_name: 'Personalized Pens',
          price: 299,
          old_price: 499,
          rating: 4.8,
          reviews_count: 64,
          image_url: '/assets/images/pens.avif',
          fallback_image_url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
          badge: 'Staff Pick',
          material: 'Matte Brass Alloy',
          description: 'Smooth German ink rollerball with precision gold-laser engraving.',
          show_on_home: 1
        },
        {
          id: '106',
          name: 'Warm Wooden Name Plate Night Lamp',
          cat_name: 'Home Decor & Lamps',
          price: 799,
          old_price: 1399,
          rating: 4.9,
          reviews_count: 142,
          image_url: '/assets/images/lamps.avif',
          fallback_image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
          badge: 'Bestseller',
          material: 'Natural Pine Wood',
          description: 'Custom cut dual names with ambient warm-white LED backlighting.',
          show_on_home: 1
        },
        {
          id: '107',
          name: 'Executive Corporate Hamper & Diary Set',
          cat_name: 'Corporate Gifts',
          price: 1299,
          old_price: 1999,
          rating: 4.9,
          reviews_count: 88,
          image_url: '/assets/images/corporate-gifts.avif',
          fallback_image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
          badge: 'Corporate Choice',
          material: 'Leatherette & Stainless Steel',
          description: 'Includes engraved vacuum flask, A5 journal, pen, and metallic keychain.',
          show_on_home: 1
        },
        {
          id: '108',
          name: 'Festival Celebration Sweet & Keepsake Hamper',
          cat_name: 'Gift Hampers & Sets',
          price: 1499,
          old_price: 2499,
          rating: 5.0,
          reviews_count: 156,
          image_url: '/assets/images/gifts.avif',
          fallback_image_url: 'https://images.unsplash.com/photo-1605808316692-a7d5bdc91fb3?auto=format&fit=crop&w=600&q=80',
          badge: 'Festive Special',
          material: 'Handcrafted Wooden Pinewood Crate',
          description: 'Complete luxury festive set with artisan dry fruits and customized photo frame.',
          show_on_home: 1
        }
      ];

      for (const prod of defaultProducts) {
        await query(
          `INSERT INTO products (id, name, cat_name, price, old_price, rating, reviews_count, image_url, fallback_image_url, badge, material, description, show_on_home)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            prod.id,
            prod.name,
            prod.cat_name,
            prod.price,
            prod.old_price,
            prod.rating,
            prod.reviews_count,
            prod.image_url,
            prod.fallback_image_url,
            prod.badge,
            prod.material,
            prod.description,
            prod.show_on_home
          ]
        );
      }
      console.log(`✅ Seeded ${defaultProducts.length} catalog products.`);
    }

    // 4. Seed Users (Super Admin + Demo Customers) if empty
    const [existingUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count === 0) {
      console.log('👤 Seeding initial administrators and registered users...');
      const defaultUsers = [
        {
          id: 'usr_admin',
          name: 'Studio Admin',
          email: 'admin@finegiftstudio.com',
          phone: '+91 99999 88888',
          password: 'admin123',
          role: 'admin',
          status: 'active',
          city: 'Mangalore',
          notes: 'Master Super Administrator account'
        },
        {
          id: 'usr_rahul',
          name: 'Rahul Sharma',
          email: 'rahul.sharma@example.com',
          phone: '+91 98765 43210',
          password: 'password123',
          role: 'vip',
          status: 'active',
          city: 'Mangalore',
          notes: 'VIP customer'
        },
        {
          id: 'usr_priya',
          name: 'Priya Nair',
          email: 'priya.nair@sample.in',
          phone: '+91 98450 12345',
          password: 'password123',
          role: 'customer',
          status: 'active',
          city: 'Bengaluru',
          notes: 'Regular customer'
        }
      ];

      for (const u of defaultUsers) {
        await query(
          `INSERT INTO users (id, name, email, phone, password, role, status, city, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [u.id, u.name, u.email, u.phone, u.password, u.role, u.status, u.city, u.notes]
        );
      }
      console.log(`✅ Seeded ${defaultUsers.length} users (including master admin).`);
    }

    // 5. Seed Coupons if empty
    const [existingCoupons] = await pool.query('SELECT COUNT(*) as count FROM coupons');
    if (existingCoupons[0].count === 0) {
      console.log('🎟️ Seeding promotional vouchers...');
      const defaultCoupons = [
        { id: 'cp_1', code: 'WELCOME10', type: 'percentage', value: 10, min_order: 499 },
        { id: 'cp_2', code: 'FESTIVE500', type: 'flat', value: 500, min_order: 1999 },
        { id: 'cp_3', code: 'ARTISAN15', type: 'percentage', value: 15, min_order: 999 }
      ];

      for (const c of defaultCoupons) {
        await query(
          'INSERT INTO coupons (id, code, type, value, min_order, status) VALUES (?, ?, ?, ?, ?, ?)',
          [c.id, c.code, c.type, c.value, c.min_order, 'active']
        );
      }
      console.log(`✅ Seeded ${defaultCoupons.length} coupons.`);
    }

    // 6. Seed Initial Audit Log
    const [existingAudit] = await pool.query('SELECT COUNT(*) as count FROM audit_logs');
    if (existingAudit[0].count === 0) {
      await query(
        'INSERT INTO audit_logs (id, action, detail, user_name) VALUES (?, ?, ?, ?)',
        [`aud_${Date.now()}`, 'Database Connected', 'Remote Hostinger MySQL database synchronized and verified', 'System']
      );
    }

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
