import { IProduct } from "./IProduct";
import { IUser } from "./IUser";

export interface IOrderItem {
  product: IProduct;
  quantity: number;
}

export interface IOrder {
  _id: string;
  user: IUser;
  products: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'done';
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateOrderRequest {
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  totalAmount: number;
}
