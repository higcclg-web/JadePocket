// src/app/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Product, Image as PrismaImage } from "@prisma/client";
import prisma from "@/lib/db";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";          // do not prerender; fetch at request time
export const fetchCache = "force-no-store";      // avoid caching fetched data

export const metadata: Metadata = {
  title: "JadePocketShop — Small Luxury, Smart Prices",
  description:
    "Curated, designer-inspired products with a modern jade aesthetic. Powered by Next.js & Stripe.",
};

type ProductWithImages = Product & { images: PrismaImage[] };

async function getProducts(): Promise<ProductWithImages[]> {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
      take: 24,
    });
    return products as ProductWithImages[];
  } catch {
    // If DB is not reachable during build/deploy, fail soft and render an empty grid.
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-100 p-8 md:p-12 border border-emerald-200/60 shadow-sm">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">
            Elevated Everyday. <span className="text-emerald-700">JadePocketShop</span>
          </h1>
          <p className="mt-4 text-gray-700 md:text-lg">
            Luxurious, modern, high‑tech shopping for small, designer‑inspired products.
            New drops weekly. AI assistant on standby whenever you need help.
          </p>
          <div className="mt-6">
            <Link
              href="/shop"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-3 text-white font-medium hover:bg-emerald-700 transition"
            >
              Browse Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Latest Arrivals</h2>
          <Link href="/shop" className="text-emerald-700 hover:underline">
            View all
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mt-10 rounded-2xl border bg-white p-10 text-center">
            <p className="text-gray-700">
              Products are coming soon. Check back shortly or{" "}
              <Link href="/subscribe" className="text-emerald-700 underline">
                join the list
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Assurance */}
      <section className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5">
          <p className="font-medium text-gray-900">Secure Payments</p>
          <p className="text-sm text-gray-600 mt-1">Stripe‑powered checkout</p>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <p className="font-medium text-gray-900">Fast Shipping</p>
          <p className="text-sm text-gray-600 mt-1">Tracked worldwide delivery</p>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <p className="font-medium text-gray-900">AI Assistant</p>
          <p className="text-sm text-gray-600 mt-1">Get help 24/7 while you shop</p>
        </div>
      </section>
    </main>
  );
}
