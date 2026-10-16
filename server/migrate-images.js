import { query } from './db.js';

async function migrate() {
  console.log('Altering products.image_url to LONGTEXT...');
  await query('ALTER TABLE products MODIFY COLUMN image_url LONGTEXT NOT NULL');
  await query('ALTER TABLE products MODIFY COLUMN fallback_image_url LONGTEXT DEFAULT NULL');
  await query('ALTER TABLE categories MODIFY COLUMN image_url LONGTEXT DEFAULT NULL');
  console.log('Columns successfully migrated to LONGTEXT in MySQL!');

  const cols = await query("SHOW COLUMNS FROM products WHERE Field LIKE '%image%'");
  console.log('Products Image Columns:', cols);
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
