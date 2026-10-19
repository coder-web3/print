// Production API Client for Fine Gift Studio (MySQL Backend with local fallback)

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL 
  : '/api';

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || errBody.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API Warning: ${url}]:`, err.message);
    return null;
  }
}

// ── SAFE LOCALSTORAGE CACHING (Avoids QuotaExceededError with base64 images) ──
export function safeSaveProductsCache(products) {
  if (!Array.isArray(products) || products.length === 0) return;
  try {
    localStorage.setItem('finegift_admin_products', JSON.stringify(products));
  } catch (quotaErr) {
    // If quota exceeded due to heavy base64 images, store a lightweight cache
    try {
      const lightweight = products.map((p) => {
        if (p.image_url && typeof p.image_url === 'string' && p.image_url.startsWith('data:image/') && p.image_url.length > 500) {
          return {
            ...p,
            image_url: p.fallback_image_url || '/assets/images/cups-product.avif'
          };
        }
        return p;
      });
      localStorage.setItem('finegift_admin_products', JSON.stringify(lightweight));
    } catch (fallbackErr) {
      console.warn('LocalStorage cache full, skipping offline products backup:', fallbackErr);
    }
  }
}

// ── HEALTH & DB STATUS ────────────────────────────────────────────────
export async function getDbHealth() {
  const result = await safeFetch(`${API_BASE}/health?_t=${Date.now()}`);
  return result?.database || { ok: false, message: 'Server not reachable' };
}

// ── PRODUCTS ──────────────────────────────────────────────────────────
export async function apiGetProducts() {
  const result = await safeFetch(`${API_BASE}/products?_t=${Date.now()}`);
  if (result?.success && Array.isArray(result.data)) {
    return result.data.map((p) => ({
      ...p,
      price: Number(p.price) || 0,
      old_price: Number(p.old_price) || 0,
      rating: Number(p.rating) || 4.8,
      reviews_count: Number(p.reviews_count) || 12,
      in_stock: p.in_stock === 1 || p.in_stock === true || p.in_stock === '1',
      show_on_home: p.show_on_home === 1 || p.show_on_home === true || p.show_on_home === '1',
      is_customizable: p.is_customizable !== undefined ? Boolean(p.is_customizable) : true,
      is_bestseller: Boolean(p.is_bestseller),
      is_new: p.is_new !== undefined ? Boolean(p.is_new) : true,
      fast_delivery: p.fast_delivery !== undefined ? Boolean(p.fast_delivery) : true,
      occasions: Array.isArray(p.occasions)
        ? p.occasions
        : (typeof p.occasions === 'string' && p.occasions.trim()
            ? (p.occasions.startsWith('[') ? JSON.parse(p.occasions) : p.occasions.split(',').map(s => s.trim()))
            : (p.badge ? [p.badge] : []))
    }));
  }
  return null;
}

export async function apiSaveProduct(product) {
  return await safeFetch(`${API_BASE}/products`, {
    method: 'POST',
    body: JSON.stringify(product)
  });
}

export async function apiUpdateProduct(id, product) {
  return await safeFetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  });
}

export async function apiDeleteProduct(id) {
  return await safeFetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  });
}

// ── CATEGORIES ────────────────────────────────────────────────────────
export async function apiGetCategories() {
  const result = await safeFetch(`${API_BASE}/categories`);
  return result?.success ? result.data : null;
}

export async function apiSaveCategory(category) {
  return await safeFetch(`${API_BASE}/categories`, {
    method: 'POST',
    body: JSON.stringify(category)
  });
}

export async function apiUpdateCategory(id, category) {
  return await safeFetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(category)
  });
}

export async function apiDeleteCategory(id) {
  return await safeFetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE'
  });
}

// ── USERS & AUTH ──────────────────────────────────────────────────────
export async function apiGetUsers() {
  const result = await safeFetch(`${API_BASE}/users`);
  return result?.success ? result.data : null;
}

export async function apiLogin(email, password) {
  const result = await safeFetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return result;
}

export async function apiSaveUser(user) {
  return await safeFetch(`${API_BASE}/users`, {
    method: 'POST',
    body: JSON.stringify(user)
  });
}

export async function apiUpdateUser(id, user) {
  return await safeFetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user)
  });
}

export async function apiDeleteUser(id) {
  return await safeFetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE'
  });
}

// ── ORDERS ────────────────────────────────────────────────────────────
export async function apiGetOrders() {
  const result = await safeFetch(`${API_BASE}/orders`);
  return result?.success ? result.data : null;
}

export async function apiCreateOrder(order) {
  return await safeFetch(`${API_BASE}/orders`, {
    method: 'POST',
    body: JSON.stringify(order)
  });
}

export async function apiUpdateOrderStatus(id, statusData) {
  return await safeFetch(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(statusData)
  });
}

// ── COUPONS ───────────────────────────────────────────────────────────
export async function apiGetCoupons() {
  const result = await safeFetch(`${API_BASE}/coupons`);
  return result?.success ? result.data : null;
}

export async function apiSaveCoupon(coupon) {
  return await safeFetch(`${API_BASE}/coupons`, {
    method: 'POST',
    body: JSON.stringify(coupon)
  });
}

export async function apiUpdateCoupon(id, coupon) {
  return await safeFetch(`${API_BASE}/coupons/${id}`, {
    method: 'PUT',
    body: JSON.stringify(coupon)
  });
}

export async function apiDeleteCoupon(id) {
  return await safeFetch(`${API_BASE}/coupons/${id}`, {
    method: 'DELETE'
  });
}

// ── CMS AUDIT LOGS ────────────────────────────────────────────────────
export async function apiGetAuditLogs() {
  const result = await safeFetch(`${API_BASE}/audit`);
  return result?.success ? result.data : null;
}

export async function apiLogAudit(action, detail, userName = 'Studio Admin') {
  return await safeFetch(`${API_BASE}/audit`, {
    method: 'POST',
    body: JSON.stringify({ action, detail, user_name: userName })
  });
}

// ── MEDIA LIBRARY ─────────────────────────────────────────────────────
export async function apiGetMedia() {
  const result = await safeFetch(`${API_BASE}/media?_t=${Date.now()}`);
  return result?.success && Array.isArray(result.data) ? result.data : null;
}

export async function apiSaveMedia(mediaItem) {
  return await safeFetch(`${API_BASE}/media`, {
    method: 'POST',
    body: JSON.stringify(mediaItem)
  });
}

export async function apiDeleteMedia(id) {
  return await safeFetch(`${API_BASE}/media/${id}`, {
    method: 'DELETE'
  });
}

// ── CMS CONTENT (Home, About, Contact, Legal) ──────────────────────────
export async function apiGetCmsContent(key) {
  const result = await safeFetch(`${API_BASE}/cms/${key}?_t=${Date.now()}`);
  return result?.success ? result.data : null;
}

export async function apiSaveCmsContent(key, data) {
  return await safeFetch(`${API_BASE}/cms/${key}`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
