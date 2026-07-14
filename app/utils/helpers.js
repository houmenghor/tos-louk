/**
 * Calculate pricing and discount badge for a product from API data.
 * Auto-imported by Nuxt 3 from utils/helpers.js.
 * 
 * @param {Object} item - Product item from backend API
 * @returns {{ price: number, oldPrice: number|null, badge: string }}
 */
export const getProductPricing = (item) => {
  if (!item) return { price: 0, oldPrice: null, badge: '' };

  const basePrice = Number(item.sell_price !== undefined ? item.sell_price : (item.unit_price || 0));
  const unitPrice = Number(item.unit_price || 0);

  let finalPrice = basePrice;
  let oldPrice = unitPrice > basePrice ? unitPrice : null;
  let badge = '';

  if (item.discount && item.discount.value) {
    const discountValue = Number(item.discount.value);
    const discountType = item.discount.type; // 'percent' or 'fixed'

    // If there is a discount relationship, oldPrice is the price before discount
    oldPrice = oldPrice || basePrice;

    if (discountType === 'percent') {
      finalPrice = Math.max(0, basePrice - (basePrice * (discountValue / 100)));
      badge = `-${discountValue}%`;
    } else {
      finalPrice = Math.max(0, basePrice - discountValue);
      badge = `-$${discountValue}`;
    }
  } else if (oldPrice) {
    badge = 'Sale';
  }

  finalPrice = Number(finalPrice.toFixed(2));
  if (oldPrice !== null) {
    oldPrice = Number(oldPrice.toFixed(2));
    if (oldPrice <= finalPrice) {
      oldPrice = null;
    }
  }

  return { price: finalPrice, oldPrice, badge };
};

/**
 * Resolve the Main Thumbnail image URL cleanly, with fallback to gallery image or placeholder.
 * 
 * @param {Object} item - Product item from backend API
 * @param {string} [placeholderText='Product'] - Text to show on placeholder if no image exists
 * @returns {string} Image URL
 */
export const getProductImage = (item, placeholderText = 'Product') => {
  if (!item) return `https://placehold.co/400x400/png?text=${encodeURIComponent(placeholderText)}`;
  return item.thumbnail || item.images?.[0]?.image_url || `https://placehold.co/400x400/png?text=${encodeURIComponent(placeholderText)}`;
};

/**
 * Normalize a raw API product object into a standardized structure for UI cards.
 * 
 * @param {Object} item - Raw product object
 * @param {Object} [options={}] - Override parameters (e.g. custom badge or default text)
 * @returns {Object} Standardized UI product card object
 */
export const normalizeProductCard = (item, options = {}) => {
  if (!item) return {};

  const { price, oldPrice, badge } = getProductPricing(item);
  const imgUrl = getProductImage(item, options.placeholderText || item.title || 'Item');

  return {
    id: item.id,
    uuid: item.uuid,
    title: item.title || 'Untitled Product',
    desc: item.description || 'Premium quality product.',
    category: item.category?.name || options.defaultCategory || 'PREMIUM COLLECTION',
    categorySlug: item.category?.slug || item.category?.name?.toLowerCase() || 'electronics',
    brand: item.brand || 'Nike',
    sku: item.sku || null,
    price,
    oldPrice,
    badge: options.badge !== undefined ? options.badge : badge,
    thumbnail: imgUrl,
    image: imgUrl,
    images: item.images || [],
    stock: item.stock !== undefined ? item.stock : null,
    stockWarning: item.stock_warning !== undefined ? item.stock_warning : 10,
    discountObj: item.discount || null,
    endsAt: item.discount?.ends_at || null,
    ...options.extra
  };
};
