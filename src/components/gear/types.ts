export type Product = {
  affiliateUrl?: string;
  bestFor: string;
  comparisonBadge?: string;
  description: [string, string];
  image: string;
  imageAlt: string;
  name: string;
  priceRange: string;
  pros: [string, string, string];
  specs: [string, string, string];
};

export type Category = {
  id: string;
  products: [Product, Product];
  title: string;
};