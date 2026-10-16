import { query } from './db.js';

const catalogProducts = [
  {
    id: 'prod_inf_b1',
    name: 'Baby Boy Naming Ceremony Wooden Keepsake Plaque',
    cat_name: 'Infants',
    sub_cat_name: 'Boys',
    price: 899,
    old_price: 1499,
    image_url: '/assets/images/lamps.avif',
    rating: 4.9,
    reviews_count: 42,
    badge: 'Naming Special',
    material: 'Natural Pine Wood',
    description: 'Personalized baby boy naming ceremony wooden plaque with date of birth, time, weight, and parents blessings.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_inf_b2',
    name: 'Baby Boy Naming Ceremony Silver Plated Kada & Keepsake Set',
    cat_name: 'Infants',
    sub_cat_name: 'Boys',
    price: 1299,
    old_price: 1999,
    image_url: '/assets/images/gifts.avif',
    rating: 4.8,
    reviews_count: 38,
    badge: 'Ceremony Gift',
    material: 'Silver Plated & Velvet Box',
    description: 'Traditional auspicious naming ceremony gift box featuring engraved baby boy kada, velvet pouch, and customized certificate.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_inf_g1',
    name: 'Baby Girl Naming Ceremony Floral Acrylic Keepsake',
    cat_name: 'Infants',
    sub_cat_name: 'Girls',
    price: 949,
    old_price: 1599,
    image_url: '/assets/images/frames.avif',
    rating: 5.0,
    reviews_count: 51,
    badge: 'Ceremony Choice',
    material: 'Crystal Acrylic & LED Dock',
    description: 'Exquisite UV-printed naming ceremony acrylic plaque with baby girl name, auspicious star, and illuminated warm LED wooden dock.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_inf_g2',
    name: 'Infant Girl Ear Piercing Celebration Keepsake Box',
    cat_name: 'Infants',
    sub_cat_name: 'Girls',
    price: 1199,
    old_price: 1849,
    image_url: '/assets/images/gifts.avif',
    rating: 4.9,
    reviews_count: 29,
    badge: 'Ear Piercing',
    material: 'Engraved Pinewood Box',
    description: 'Special celebration box designed to treasure first gold earrings, photograph, and baby milestone keepsake memory cards.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_boy_1',
    name: 'Boys Naming Ceremony Engraved Wooden Photo Memory Frame',
    cat_name: 'Boys',
    sub_cat_name: null,
    price: 799,
    old_price: 1299,
    image_url: '/assets/images/frames.avif',
    rating: 4.8,
    reviews_count: 35,
    badge: 'Naming Ceremony',
    material: 'MDF Wood & Plexiglass',
    description: 'Commemorate your baby boy naming ceremony with custom gold lettering and family blessing quote.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_boy_2',
    name: 'Little Prince Customized Wooden LED Name Lamp',
    cat_name: 'Boys',
    sub_cat_name: null,
    price: 699,
    old_price: 1199,
    image_url: '/assets/images/lamps.avif',
    rating: 4.7,
    reviews_count: 64,
    badge: 'Trending',
    material: 'Natural Pine Wood',
    description: 'Warm glowing LED night lamp custom cut in the boy name with royal crown silhouette.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_girl_1',
    name: 'Traditional Ear Piercing Celebration Gift Hamper',
    cat_name: 'Girls',
    sub_cat_name: null,
    price: 1599,
    old_price: 2499,
    image_url: '/assets/images/gifts.avif',
    rating: 5.0,
    reviews_count: 48,
    badge: 'Ear Piercing',
    material: 'Luxe Wooden Box & Sweets',
    description: 'Grand traditional hamper celebrating the auspicious ear piercing ceremony with dry fruits, memory box, and blessings scroll.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_girl_2',
    name: 'Girls Ear Piercing Ceremony Golden Memory Plaque',
    cat_name: 'Girls',
    sub_cat_name: null,
    price: 849,
    old_price: 1399,
    image_url: '/assets/images/frames.avif',
    rating: 4.9,
    reviews_count: 31,
    badge: 'Ear Piercing',
    material: 'Mirror Gold Acrylic',
    description: 'Cherish the milestone ear pricking/piercing ceremony with a mirror-finish golden plaque engraved with photo and ceremony date.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_men_1',
    name: 'Men Luxury Engagement Engraved Watch & Leather Wallet Set',
    cat_name: 'Men',
    sub_cat_name: null,
    price: 1699,
    old_price: 2799,
    image_url: '/assets/images/wallets.avif',
    rating: 4.9,
    reviews_count: 94,
    badge: 'Engagement Special',
    material: 'Genuine Leather & Metal',
    description: 'Special engagement gift hamper for the groom-to-be including customized leather wallet, engraved pen, and sleek watch box.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_men_2',
    name: 'Groom Engagement Keepsake Acrylic Couple Plaque',
    cat_name: 'Men',
    sub_cat_name: null,
    price: 999,
    old_price: 1799,
    image_url: '/assets/images/frames.avif',
    rating: 4.8,
    reviews_count: 67,
    badge: 'Engagement',
    material: 'Crystal Cast Acrylic',
    description: 'Celebrate the ring ceremony with high-definition UV printed couple photo, engagement date, and personalized vows.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_wom_1',
    name: 'Women Bridal & Engagement Customized Keepsake Frame',
    cat_name: 'Women',
    sub_cat_name: null,
    price: 1099,
    old_price: 1899,
    image_url: '/assets/images/frames.avif',
    rating: 5.0,
    reviews_count: 88,
    badge: 'Engagement Special',
    material: 'Gold Border Acrylic',
    description: 'Romantic engagement memory plaque for the bride-to-be with ring ceremony photographs, calendar date mark, and warm LED backlight.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_wom_2',
    name: 'Bride Engagement Celebration Ambient LED Heart Lamp',
    cat_name: 'Women',
    sub_cat_name: null,
    price: 899,
    old_price: 1499,
    image_url: '/assets/images/lamps.avif',
    rating: 4.9,
    reviews_count: 76,
    badge: 'Engagement',
    material: '3D Cast Acrylic & Beech Wood',
    description: 'Heart-shaped illuminated plaque engraved with couple names and celebration rings symbol.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_cup_1',
    name: 'Custom Printed Magic Mug',
    cat_name: 'Cups & Mugs',
    sub_cat_name: null,
    price: 349,
    old_price: 549,
    image_url: '/assets/images/cups-product.avif',
    rating: 4.7,
    reviews_count: 98,
    badge: 'Popular',
    material: 'Ceramic with Thermal Coating',
    description: 'Heat-activated color changing ceramic mug that reveals your custom photo.',
    show_on_home: 1,
    in_stock: 1
  },
  {
    id: 'prod_corp_1',
    name: 'Executive Corporate Hamper & Engraved Flask Set',
    cat_name: 'Corporate Gifts',
    sub_cat_name: null,
    price: 1299,
    old_price: 1999,
    image_url: '/assets/images/corporate-gifts.avif',
    rating: 4.9,
    reviews_count: 45,
    badge: 'Corporate Choice',
    material: 'Stainless Steel & Premium Box',
    description: 'Executive branding corporate gift set with insulated flask, metal pen, and notebook.',
    show_on_home: 1,
    in_stock: 1
  }
];

async function sync() {
  console.log('Syncing catalog products into MySQL...');
  for (const p of catalogProducts) {
    await query(
      `INSERT IGNORE INTO products (id, name, cat_name, sub_cat_name, price, old_price, rating, reviews_count, image_url, badge, material, description, show_on_home, in_stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.name,
        p.cat_name,
        p.sub_cat_name,
        p.price,
        p.old_price,
        p.rating,
        p.reviews_count,
        p.image_url,
        p.badge,
        p.material,
        p.description,
        p.show_on_home,
        p.in_stock
      ]
    );
  }
  const [res] = await query('SELECT COUNT(*) as count FROM products');
  console.log(`✅ Total products in MySQL after sync: ${res.count}`);
  process.exit(0);
}

sync().catch((err) => {
  console.error('Catalog sync error:', err);
  process.exit(1);
});
