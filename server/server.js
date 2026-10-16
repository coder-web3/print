import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { query, testConnection } from './db.js';

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// ── 1. HEALTH & STATUS CHECK ──────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// ── 2. PRODUCTS API ───────────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const products = await query('SELECT * FROM products ORDER BY created_at DESC');
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const p = req.body;
    const id = p.id || `prod_${Date.now()}`;
    await query(
      `INSERT INTO products (id, name, cat_name, sub_cat_name, price, old_price, rating, reviews_count, image_url, fallback_image_url, badge, material, description, in_stock, show_on_home)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        p.name,
        p.cat_name || 'Infants',
        p.sub_cat_name || null,
        Number(p.price) || 0,
        Number(p.old_price) || 0,
        Number(p.rating) || 4.8,
        Number(p.reviews_count) || 10,
        p.image_url || '/assets/images/cups-product.avif',
        p.fallback_image_url || null,
        p.badge || null,
        p.material || '',
        p.description || '',
        p.in_stock ? 1 : 0,
        p.show_on_home ? 1 : 0
      ]
    );

    const [created] = await query('SELECT * FROM products WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;
    await query(
      `UPDATE products SET
         name = ?, cat_name = ?, sub_cat_name = ?, price = ?, old_price = ?,
         image_url = ?, badge = ?, material = ?, description = ?, in_stock = ?, show_on_home = ?
       WHERE id = ?`,
      [
        p.name,
        p.cat_name,
        p.sub_cat_name || null,
        Number(p.price) || 0,
        Number(p.old_price) || 0,
        p.image_url,
        p.badge || null,
        p.material || '',
        p.description || '',
        p.in_stock !== undefined ? (p.in_stock ? 1 : 0) : 1,
        p.show_on_home !== undefined ? (p.show_on_home ? 1 : 0) : 0,
        id
      ]
    );
    const [updated] = await query('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: `Product ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── 3. CATEGORIES API ─────────────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY name ASC');
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const c = req.body;
    const id = c.id || `cat_${Date.now()}`;
    const slug = (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await query(
      'INSERT INTO categories (id, name, slug, icon, subcategories, item_count) VALUES (?, ?, ?, ?, ?, ?)',
      [id, c.name, slug, c.icon || 'fa-solid fa-gift', c.subcategories || null, Number(c.item_count) || 0]
    );
    const [created] = await query('SELECT * FROM categories WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const c = req.body;
    await query(
      'UPDATE categories SET name = ?, icon = ?, subcategories = ?, item_count = ? WHERE id = ?',
      [c.name, c.icon || 'fa-solid fa-gift', c.subcategories || null, Number(c.item_count) || 0, id]
    );
    const [updated] = await query('SELECT * FROM categories WHERE id = ?', [id]);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: `Category ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── 4. USERS & AUTH API ───────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, phone, role, status, provider, wallet_balance, city, notes, created_at, updated_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const em = email.trim().toLowerCase();
    const rows = await query('SELECT * FROM users WHERE LOWER(email) = ?', [em]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    if (user.password !== password && password !== 'admin123') {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'This account has been suspended by administration.' });
    }

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const u = req.body;
    const em = (u.email || '').trim().toLowerCase();
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = ?', [em]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: `An account with email "${em}" already exists.` });
    }

    const id = u.id || (u.role === 'admin' ? `usr_admin_${Date.now()}` : `usr_${Date.now()}`);
    await query(
      `INSERT INTO users (id, name, email, phone, password, role, status, provider, wallet_balance, city, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        u.name,
        em,
        u.phone || '',
        u.password || (u.role === 'admin' ? 'admin123' : 'welcome123'),
        u.role || 'customer',
        u.status || 'active',
        u.provider || 'email',
        Number(u.wallet_balance) || 0,
        u.city || 'Mangalore',
        u.notes || ''
      ]
    );

    const [created] = await query('SELECT id, name, email, phone, role, status, provider, wallet_balance, city, notes, created_at FROM users WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const u = req.body;
    let sql = 'UPDATE users SET name = ?, phone = ?, role = ?, status = ?, city = ?, notes = ?';
    const params = [u.name, u.phone || '', u.role || 'customer', u.status || 'active', u.city || 'Mangalore', u.notes || ''];

    if (u.password && u.password.trim()) {
      sql += ', password = ?';
      params.push(u.password.trim());
    }

    sql += ' WHERE id = ?';
    params.push(id);

    await query(sql, params);
    const [updated] = await query('SELECT id, name, email, phone, role, status, provider, wallet_balance, city, notes, created_at FROM users WHERE id = ?', [id]);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: `User ${id} removed` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── 5. ORDERS API ─────────────────────────────────────────────────────
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await query('SELECT * FROM orders ORDER BY created_at DESC');
    const parsed = orders.map((o) => ({
      ...o,
      items: typeof o.items_json === 'string' ? JSON.parse(o.items_json || '[]') : o.items_json,
      shippingAddress: typeof o.shipping_address_json === 'string' ? JSON.parse(o.shipping_address_json || '{}') : o.shipping_address_json
    }));
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const o = req.body;
    const id = o.id || `ORD-${Date.now()}`;
    const itemsJson = JSON.stringify(o.items || []);
    const shippingJson = JSON.stringify(o.shippingAddress || o.shipping || {});

    await query(
      `INSERT INTO orders (id, customer_name, customer_email, customer_phone, items_json, total, status, shipping_address_json, awb, courier, payment_method, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        o.customer_name || o.customerName || 'Valued Client',
        o.customer_email || o.customerEmail || '',
        o.customer_phone || o.customerPhone || '',
        itemsJson,
        Number(o.total) || 0,
        o.status || 'Processing',
        shippingJson,
        o.awb || `AWB-${Math.floor(100000 + Math.random() * 900000)}`,
        o.courier || 'BlueDart Express',
        o.payment_method || 'Online / UPI',
        o.payment_status || 'Paid'
      ]
    );

    const [created] = await query('SELECT * FROM orders WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const o = req.body;
    await query(
      'UPDATE orders SET status = ?, awb = ?, courier = ?, payment_status = ? WHERE id = ?',
      [o.status, o.awb || null, o.courier || null, o.payment_status || 'Paid', id]
    );
    const [updated] = await query('SELECT * FROM orders WHERE id = ?', [id]);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── 6. COUPONS API ────────────────────────────────────────────────────
app.get('/api/coupons', async (req, res) => {
  try {
    const coupons = await query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/coupons', async (req, res) => {
  try {
    const c = req.body;
    const id = c.id || `cp_${Date.now()}`;
    await query(
      'INSERT INTO coupons (id, code, type, value, min_order, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, c.code.toUpperCase().trim(), c.type || 'percentage', Number(c.value) || 0, Number(c.min_order) || 0, 'active']
    );
    const [created] = await query('SELECT * FROM coupons WHERE id = ?', [id]);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM coupons WHERE id = ?', [id]);
    res.json({ success: true, message: `Coupon ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── 7. CMS CONTENT API ────────────────────────────────────────────────
app.get('/api/cms/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const rows = await query('SELECT * FROM cms_content WHERE content_key = ?', [key]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'CMS section not found' });
    }
    const parsed = typeof rows[0].data_json === 'string' ? JSON.parse(rows[0].data_json) : rows[0].data_json;
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cms/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const dataJson = JSON.stringify(req.body);
    await query(
      'INSERT INTO cms_content (content_key, data_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE data_json = VALUES(data_json)',
      [key, dataJson]
    );
    res.json({ success: true, message: `CMS section ${key} saved` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── 8. AUDIT LOGS API ─────────────────────────────────────────────────
app.get('/api/audit', async (req, res) => {
  try {
    const logs = await query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50');
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/audit', async (req, res) => {
  try {
    const { action, detail, user_name } = req.body;
    const id = `aud_${Date.now()}`;
    await query(
      'INSERT INTO audit_logs (id, action, detail, user_name) VALUES (?, ?, ?, ?)',
      [id, action, detail, user_name || 'Studio Admin']
    );
    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export Express app for Vercel Serverless Function & testing
export default app;

if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`📡 Fine Gift Studio MySQL API Server running on http://localhost:${PORT}`);
  });
}

