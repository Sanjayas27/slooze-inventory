import { Product, User } from "@/types";

export const mockUsers: User[] = [
  {
    email: "manager@slooze.com",
    role: "MANAGER",
  },
  {
    email: "store@slooze.com",
    role: "STORE_KEEPER",
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wheat",
    category: "Grain",
    price: 120,
    stock: 50,
  },
  {
    id: "2",
    name: "Rice",
    category: "Grain",
    price: 80,
    stock: 10,
  },
  {
    id: "3",
    name: "Sugar",
    category: "Grocery",
    price: 60,
    stock: 35,
  },
  {
    id: "4",
    name: "Salt",
    category: "Grocery",
    price: 20,
    stock: 100,
  },
];