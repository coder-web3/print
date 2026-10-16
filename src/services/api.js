// Production API Client for Fine Gift Studio (MySQL Backend with local fallback)

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL 
  : '/api';

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
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

// ── HEALTH & DB STATUS ────────────────────────────────────────────────
export async function getDbHealth() {
  const result = await safeFetch(`${API_BASE}/health`);
  return result?.database || { ok: false, message: 'Server not reachable' };
}

// ── PRODUCTS ──────────────────────────────────────────────────────────
export async function apiGetProducts() {
  const result = await safeFetch(`${API_BASE}/products`);
  return result?.success ? result.data : null;
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
