import { Product } from "./Product";

export type FeaturedProduct = {
  _id?: string;
  order: number;
  quantity?: number;
  product: Product;
};

