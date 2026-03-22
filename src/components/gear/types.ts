export type Product = {
  description: [string, string];
  image: string;
  imageAlt: string;
  name: string;
  priceRange: string;
};

export type Category = {
  id: string;
  products: [Product, Product];
  title: string;
};