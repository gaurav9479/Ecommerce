export const generateSampleProducts = (count = 12) => {
  return Array.from({ length: count }).map((_, index) => ({
    title: `Product ${index + 1}`,
    price: Math.floor(Math.random() * 10000) + 500,
    image: '', // Will update with image later
  }));
};