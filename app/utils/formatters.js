export const generateProductUrl = (product) => {
  if (!product || !product.uuid) return '#';
  
  // Create a slug from the product title
  const slug = (product.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/(^-|-$)+/g, '');   // Remove leading or trailing hyphens

  // Return the Zando-style URL: /product/slug-uuid
  return `/product/${slug ? slug + '-' : ''}${product.uuid}`;
};
