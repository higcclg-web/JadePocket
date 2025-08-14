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
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">
            JadePocketShop
          </h1>
          <p className="mt-4 text-gray-700 md:text-lg">
            Luxurious, modern, high-tech essentials — curated, affordable, and updated constantly.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Product grid or empty state */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">New Arrivals</h2>
          <Link href="/shop" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
            View all →
          </Link>
        </div>

        {hasProducts ? (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
            <p className="mt-2 text-gray-600">
              We’re stocking the shelves. Check back shortly or visit{" "}
              <Link href="/admin" className="text-emerald-700 underline">
                the admin panel
              </Link>{" "}
              to import products.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
