export type Role = "MANAGER" | "STORE_KEEPER";

export interface User {
  email: string;
  role: Role;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}