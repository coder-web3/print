import 'dotenv/config';
import pool, { query } from './db.js';

async function updateCategoriesAndProducts() {
  console.log('🔄 Updating categories and products in Hostinger MySQL database...');

  try {
    // 1. Ensure subcategories and sub_cat_name columns exist
    try {
      await pool.query('ALTER TABLE categories ADD COLUMN IF NOT EXISTS subcategories VARCHAR(255) DEFAULT NULL');
    } catch {}
    try {
      await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS sub_cat_name VARCHAR(150) DEFAULT NULL');
    } catch {}

    // 2. Clear old demo categories and products to set up the exact requested catalog structure
    await pool.query('DELETE FROM categories');
    await pool.query('DELETE FROM products');
    console.log('🧹 Cleaned existing tables.');

    // 3. Insert fresh categories
    const categories = [
      {
        id: 'cat_infants',
        name: 'Infants',
        slug: 'infants',
        icon: 'fa-solid fa-baby',
        subcategories: 'Boys, Girls',
        item_count: 4
      },
      {
        id: 'cat_boys',
        name: 'Boys',
        slug: 'boys',
        icon: 'fa-solid fa-child',
        subcategories: null,
        item_count: 3
      },
      {
        id: 'cat_girls',
        name: 'Girls',
        slug: 'girls',
        icon: 'fa-solid fa-child-dress',
        subcategories: null,
        item_count: 3
      },
      {
        id: 'cat_men',
        name: 'Men',
        slug: 'men',
        icon: 'fa-solid fa-person',
        subcategories: null,
        item_count: 3
      },
      {
        id: 'cat_women',
        name: 'Women',
        slug: 'women',
        icon: 'fa-solid fa-person-dress',
        subcategories: null,
        item_count: 3
      },
      {
        id: 'cat_cups',
        name: 'Cups & Mugs',
        slug: 'cups-mugs',
        icon: 'fa-solid fa-mug-hot',
        subcategories: null,
        item_count: 2
      },
      {
        id: 'cat_frames',
        name: 'Photo Frames',
        slug: 'photo-frames',
        icon: 'fa-regular fa-image',
        subcategories: null,
        item_count: 2
      },
      {
        id: 'cat_corporate',
        name: 'Corporate Gifts',
        slug: 'corporate',
        icon: 'fa-solid fa-briefcase',
        subcategories: null,
        item_count: 2
      }
    ];

    for (const c of categories) {
      await query(
        'INSERT INTO categories (id, name, slug, icon, subcategories, item_count) VALUES (?, ?, ?, ?, ?, ?)',
        [c.id, c.name, c.slug, c.icon, c.subcategories, c.item_count]
      );
    }
    console.log(`✅ Inserted ${categories.length} categories.`);

    // 4. Insert rich products tailored to user's events & subcategories
    const products = [
      // ── INFANTS > BOYS ──
      {
        id: 'prod_inf_b1',
        name: 'Baby Boy Naming Ceremony Wooden Keepsake Plaque',
        cat_name: 'Infants',
        sub_cat_name: 'Boys',
        price: 899,
        old_price: 1499,
        rating: 4.9,
        reviews_count: 42,
        image_url: '/assets/images/lamps.avif',
        badge: 'Naming Special',
        material: 'Natural Pine Wood',
        description: 'Personalized baby boy naming ceremony wooden plaque with date of birth, time, weight, and parents blessings.',
        show_on_home: 1
      },
      {
        id: 'prod_inf_b2',
        name: 'Baby Boy Naming Ceremony Silver Plated Kada & Keepsake Set',
        cat_name: 'Infants',
        sub_cat_name: 'Boys',
        price: 1299,
        old_price: 1999,
        rating: 4.8,
        reviews_count: 38,
        image_url: '/assets/images/gifts.avif',
        badge: 'Ceremony Gift',
        material: 'Silver Plated & Velvet Box',
        description: 'Traditional auspicious naming ceremony gift box featuring engraved baby boy kada, velvet pouch, and customized certificate.',
        show_on_home: 1
      },

      // ── INFANTS > GIRLS ──
      {
        id: 'prod_inf_g1',
        name: 'Baby Girl Naming Ceremony Floral Acrylic Keepsake',
        cat_name: 'Infants',
        sub_cat_name: 'Girls',
        price: 949,
        old_price: 1599,
        rating: 5.0,
        reviews_count: 51,
        image_url: '/assets/images/frames.avif',
        badge: 'Ceremony Choice',
        material: 'Crystal Acrylic & LED Dock',
        description: 'Exquisite UV-printed naming ceremony acrylic plaque with baby girl name, auspicious star, and illuminated warm LED wooden dock.',
        show_on_home: 1
      },
      {
        id: 'prod_inf_g2',
        name: 'Infant Girl Ear Piercing Celebration Keepsake Box',
        cat_name: 'Infants',
        sub_cat_name: 'Girls',
        price: 1199,
        old_price: 1849,
        rating: 4.9,
        reviews_count: 29,
        image_url: '/assets/images/gifts.avif',
        badge: 'Ear Piercing',
        material: 'Engraved Pinewood Box',
        description: 'Special celebration box designed to treasure first gold earrings, photograph, and baby milestone keepsake memory cards.',
        show_on_home: 1
      },

      // ── BOYS ──
      {
        id: 'prod_boy_1',
        name: 'Boys Naming Ceremony Engraved Wooden Photo Memory Frame',
        cat_name: 'Boys',
        sub_cat_name: null,
        price: 799,
        old_price: 1299,
        rating: 4.8,
        reviews_count: 35,
        image_url: '/assets/images/frames.avif',
        badge: 'Naming Ceremony',
        material: 'MDF Wood & Plexiglass',
        description: 'Commemorate your baby boy naming ceremony ceremony with custom gold lettering and family blessing quote.',
        show_on_home: 1
      },
      {
        id: 'prod_boy_2',
        name: 'Little Prince Customized Wooden LED Name Lamp',
        cat_name: 'Boys',
        sub_cat_name: null,
        price: 699,
        old_price: 1199,
        rating: 4.7,
        reviews_count: 64,
        image_url: '/assets/images/lamps.avif',
        badge: 'Trending',
        material: 'Natural Pine Wood',
        description: 'Warm glowing LED night lamp custom cut in the boy name with royal crown silhouette.',
        show_on_home: 1
      },
      {
        id: 'prod_boy_3',
        name: 'Boys Birthday & Milestone Personalized Graphic Cotton T-Shirt',
        cat_name: 'Boys',
        sub_cat_name: null,
        price: 449,
        old_price: 799,
        rating: 4.6,
        reviews_count: 82,
        image_url: '/assets/images/t-shirt.avif',
        badge: 'Bestseller',
        material: '100% Bio-Wash Cotton',
        description: 'Super soft custom celebratory t-shirt with customized boy name and celebration badge.',
        show_on_home: 0
      },

      // ── GIRLS ──
      {
        id: 'prod_girl_1',
        name: 'Traditional Ear Piercing Celebration Gift Hamper',
        cat_name: 'Girls',
        sub_cat_name: null,
        price: 1599,
        old_price: 2499,
        rating: 5.0,
        reviews_count: 48,
        image_url: '/assets/images/gifts.avif',
        badge: 'Ear Piercing',
        material: 'Luxe Wooden Box & Sweets',
        description: 'Grand traditional hamper celebrating the auspicious ear piercing ceremony with dry fruits, memory box, and blessings scroll.',
        show_on_home: 1
      },
      {
        id: 'prod_girl_2',
        name: 'Girls Ear Piercing Ceremony Golden Memory Plaque',
        cat_name: 'Girls',
        sub_cat_name: null,
        price: 849,
        old_price: 1399,
        rating: 4.9,
        reviews_count: 31,
        image_url: '/assets/images/frames.avif',
        badge: 'Ear Piercing',
        material: 'Mirror Gold Acrylic',
        description: 'Cherish the milestone ear pricking/piercing ceremony with a mirror-finish golden plaque engraved with photo and ceremony date.',
        show_on_home: 1
      },
      {
        id: 'prod_girl_3',
        name: 'Little Princess Personalized Name LED Night Lamp',
        cat_name: 'Girls',
        sub_cat_name: null,
        price: 749,
        old_price: 1299,
        rating: 4.8,
        reviews_count: 73,
        image_url: '/assets/images/lamps.avif',
        badge: 'Popular',
        material: 'Laser Cut Acrylic & Wood',
        description: 'Ambient warm light night lamp with floral butterfly patterns and baby girl name.',
        show_on_home: 0
      },

      // ── MEN ──
      {
        id: 'prod_men_1',
        name: 'Men Luxury Engagement Engraved Watch & Leather Wallet Set',
        cat_name: 'Men',
        sub_cat_name: null,
        price: 1699,
        old_price: 2799,
        rating: 4.9,
        reviews_count: 94,
        image_url: '/assets/images/wallets.avif',
        badge: 'Engagement Special',
        material: 'Genuine Leather & Metal',
        description: 'Special engagement gift hamper for the groom-to-be including customized leather wallet, engraved pen, and sleek watch box.',
        show_on_home: 1
      },
      {
        id: 'prod_men_2',
        name: 'Groom Engagement Keepsake Acrylic Couple Plaque',
        cat_name: 'Men',
        sub_cat_name: null,
        price: 999,
        old_price: 1799,
        rating: 4.8,
        reviews_count: 67,
        image_url: '/assets/images/frames.avif',
        badge: 'Engagement',
        material: 'Crystal Cast Acrylic',
        description: 'Celebrate the ring ceremony with high-definition UV printed couple photo, engagement date, and personalized vows.',
        show_on_home: 1
      },
      {
        id: 'prod_men_3',
        name: 'Executive Laser-Engraved Rollerball Pen & Diary Gift Set',
        cat_name: 'Men',
        sub_cat_name: null,
        price: 649,
        old_price: 999,
        rating: 4.7,
        reviews_count: 55,
        image_url: '/assets/images/pens.avif',
        badge: 'Best Gift',
        material: 'Brushed Brass & Leatherette',
        description: 'Sophisticated laser engraved name pen with German refill and matching executive A5 leather journal.',
        show_on_home: 0
      },

      // ── WOMEN ──
      {
        id: 'prod_wom_1',
        name: 'Women Bridal & Engagement Customized Keepsake Frame',
        cat_name: 'Women',
        sub_cat_name: null,
        price: 1099,
        old_price: 1899,
        rating: 5.0,
        reviews_count: 88,
        image_url: '/assets/images/frames.avif',
        badge: 'Engagement Special',
        material: 'Gold Border Acrylic',
        description: 'Romantic engagement memory plaque for the bride-to-be with ring ceremony photographs, calendar date mark, and warm LED backlight.',
        show_on_home: 1
      },
      {
        id: 'prod_wom_2',
        name: 'Bride Engagement Celebration Ambient LED Heart Lamp',
        cat_name: 'Women',
        sub_cat_name: null,
        price: 899,
        old_price: 1499,
        rating: 4.9,
        reviews_count: 76,
        image_url: '/assets/images/lamps.avif',
        badge: 'Engagement',
        material: '3D Cast Acrylic & Beech Wood',
        description: 'Heart-shaped illuminated plaque engraved with couple names and celebration rings symbol.',
        show_on_home: 1
      },
      {
        id: 'prod_wom_3',
        name: 'Personalized Velvet Keepsake Jewelry & Ring Box',
        cat_name: 'Women',
        sub_cat_name: null,
        price: 799,
        old_price: 1299,
        rating: 4.8,
        reviews_count: 49,
        image_url: '/assets/images/gifts.avif',
        badge: 'Trending',
        material: 'Plush Velvet with Gold Foil Name',
        description: 'Custom travel jewelry case with golden calligraphed bride name and ring organizers.',
        show_on_home: 0
      },

      // ── CLASSIC ITEMS ──
      {
        id: 'prod_cup_1',
        name: 'Custom Printed Magic Color Changing Mug',
        cat_name: 'Cups & Mugs',
        sub_cat_name: null,
        price: 349,
        old_price: 549,
        rating: 4.7,
        reviews_count: 110,
        image_url: '/assets/images/cups-product.avif',
        badge: 'Classic',
        material: 'Ceramic Thermal',
        description: 'Pour hot liquid to reveal custom ceremony photograph and blessing text.',
        show_on_home: 1
      },
      {
        id: 'prod_corp_1',
        name: 'Executive Corporate Hamper & Engraved Flask Set',
        cat_name: 'Corporate Gifts',
        sub_cat_name: null,
        price: 1299,
        old_price: 1999,
        rating: 4.9,
        reviews_count: 45,
        image_url: '/assets/images/corporate-gifts.avif',
        badge: 'Corporate Choice',
        material: 'Steel & Leatherette',
        description: 'Includes customized vacuum temperature flask, metallic pen, and branded keychain.',
        show_on_home: 0
      }
    ];

    for (const p of products) {
      await query(
        `INSERT INTO products (id, name, cat_name, sub_cat_name, price, old_price, rating, reviews_count, image_url, badge, material, description, show_on_home)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id,
          p.name,
          p.cat_name,
          p.sub_cat_name || null,
          p.price,
          p.old_price,
          p.rating,
          p.reviews_count,
          p.image_url,
          p.badge,
          p.material,
          p.description,
          p.show_on_home
        ]
      );
    }
    console.log(`✅ Seeded ${products.length} catalog products with categories & subcategories.`);

    // 5. Update categories item_count based on actual product counts
    for (const c of categories) {
      const [res] = await pool.query('SELECT COUNT(*) as cnt FROM products WHERE cat_name = ?', [c.name]);
      const count = res[0]?.cnt || 0;
      await query('UPDATE categories SET item_count = ? WHERE id = ?', [count, c.id]);
    }
    console.log('✅ Updated category item counts.');

    await query(
      'INSERT INTO audit_logs (id, action, detail, user_name) VALUES (?, ?, ?, ?)',
      [`aud_${Date.now()}`, 'Catalog Restructured', 'Updated categories (Infants, Boys, Girls, Men, Women) with subcategories and ceremony products', 'Admin']
    );

    console.log('🎉 Catalog restructure completed successfully in MySQL!');
  } catch (error) {
    console.error('❌ Error updating categories:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

updateCategoriesAndProducts();
