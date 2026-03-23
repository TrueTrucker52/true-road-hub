export type Product = {
  affiliateUrl?: string;
  bestFor: string;
  slug: string;
  comparisonBadge?: string;
  description: string[];
  image: string;
  imageAlt: string;
  name: string;
  priceRange: string;
  pros: string[];
  specs: string[];
};

export type Category = {
  id: string;
  products: Product[];
  title: string;
};