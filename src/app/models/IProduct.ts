export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: {
    _id: string;
    title: string;
    description?: string;
  };
  stock: number;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}
