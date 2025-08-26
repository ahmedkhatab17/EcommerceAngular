import { IProduct } from "./IProduct";

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IAddToCartRequest {
  productId: string;
  quantity: number;
}

export interface IUpdateCartRequest {
  productId: string;
  quantity: number;
}
