// src/store/index.js
// All data lives in localStorage. Keys: waspe_products, waspe_orders

export const STORAGE_KEYS = {
  PRODUCTS: 'waspe_products',
  ORDERS: 'waspe_orders',
};

// ─── Products ────────────────────────────────────────────────────────────────

export function getProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
  } catch {
    return [];
  }
}

export function saveProducts(products) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  window.dispatchEvent(new Event('waspe_update'));
}

export function addProduct(product) {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    variants: product.variants || [],
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id, updates) {
  const products = getProducts().map(p => p.id === id ? { ...p, ...updates } : p);
  saveProducts(products);
}

export function deleteProduct(id) {
  saveProducts(getProducts().filter(p => p.id !== id));
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
  } catch {
    return [];
  }
}

export function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  window.dispatchEvent(new Event('waspe_update'));
}

export function addOrder(order) {
  const orders = getOrders();
  const newOrder = {
    ...order,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  orders.push(newOrder);
  // Deduct stock
  const products = getProducts();
  order.items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;
    const variant = product.variants.find(v => v.id === item.variantId);
    if (variant) variant.stock = Math.max(0, (variant.stock || 0) - item.qty);
  });
  saveProducts(products);
  saveOrders(orders);
  return newOrder;
}

export function updateOrderStatus(id, status) {
  const orders = getOrders().map(o => o.id === id ? { ...o, status } : o);
  saveOrders(orders);
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export function getStats() {
  const orders = getOrders().filter(o => o.status !== 'cancelled');
  const products = getProducts();

  let totalRevenue = 0;
  let totalCost = 0;
  const salesByProduct = {};
  const salesByFlavor = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      totalRevenue += item.salePrice * item.qty;
      totalCost += item.costPrice * item.qty;

      salesByProduct[item.productName] = (salesByProduct[item.productName] || 0) + item.qty;
      salesByFlavor[item.flavorName] = (salesByFlavor[item.flavorName] || 0) + item.qty;
    });
  });

  const topProducts = Object.entries(salesByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topFlavors = Object.entries(salesByFlavor)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Expected profit (all remaining stock)
  let expectedProfit = 0;
  products.forEach(p => {
    p.variants?.forEach(v => {
      expectedProfit += ((v.salePrice || 0) - (v.costPrice || 0)) * (v.stock || 0);
    });
  });

  return {
    totalRevenue,
    totalCost,
    profit: totalRevenue - totalCost,
    orderCount: orders.length,
    topProducts,
    topFlavors,
    expectedProfit,
  };
}
