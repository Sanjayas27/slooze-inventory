"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockProducts } from "@/lib/mockData";

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface ProductsContextValue {
  products: Product[];
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────
const ProductsContext = createContext<ProductsContextValue | null>(null);

const STORAGE_KEY = "slooze-products";

// ─── Provider ──────────────────────────────────────────────────────────────────
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount (falls back to mockProducts)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        } else {
          setProducts(mockProducts as Product[]);
        }
      } else {
        setProducts(mockProducts as Product[]);
      }
    } catch {
      setProducts(mockProducts as Product[]);
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products, hydrated]);

  const addProduct = (p: Omit<Product, "id">) => {
    const newProduct: Product = { ...p, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Don't render children until hydrated to avoid SSR mismatch
  if (!hydrated) return null;

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
}
