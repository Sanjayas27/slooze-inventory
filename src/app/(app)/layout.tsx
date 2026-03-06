"use client";

import AppLayout from "@/components/AppLayout";
import { ProductsProvider } from "@/context/ProductsContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProductsProvider>
      <AppLayout>{children}</AppLayout>
    </ProductsProvider>
  );
}
