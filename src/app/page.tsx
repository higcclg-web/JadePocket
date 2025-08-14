"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "../components/product-card";

type Product = {
  id: string;
  title: string;
  slug: string;
  brand: string | null;
  priceCents: number | null;
  compareAtCents: number | null;
  inventory: number;
  tags: string[] | null;
  images: { id: string; url: string; alt: string | null }[];
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const hasProducts = products.length > 0;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-100 p-8 md:p-12 border border-emerald-200/60 shadow-sm">
        <div className="max-w-2xl">
          <h1 className="text
