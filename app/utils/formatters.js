export const generateProductUrl = (product) => {
  if (!product) return '#';
  if (product.slug) return `/product/${product.slug}`;
  if (product.uuid) return `/product/${product.uuid}`;
  return '#';
};
