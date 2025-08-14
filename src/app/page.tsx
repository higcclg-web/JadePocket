// src/app/page.tsx
export const dynamic = "force-dynamic"; // run at request time, not at build
export const revalidate = 0;             // no ISR cache

import Link from "next/link";
import { prisma } from "../lib/db";
import { ProductCard } from "../components/product-card";

export default async function Home() {
  // Fetch latest products (safe if DB is down)
  let products:
    | Array<
        Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
          images: Awaited<
            ReturnType<typeof prisma.image.findMany>
          >;
        }
      >
    | [] = [];

  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 24,
      include: { images: true },
    });
  } catch (e) {
    console.warn("[home] DB unavailable, rendering empty state:", e);
    products = [];
  }

  const hasProducts = products.length > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-10">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-100 p-8 md:p-12 border border-emerald-200/60 shadow-sm">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">
            JadePocketShop
          </h1>
          <p className="mt-4 text-gray-700 md:text-lg">
            Luxurious, modern, high‑tech essentials — curated, affordable, and updated
            constantly.
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
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            New Arrivals
          </h2>
          <Link
            href="/shop"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            View all →
          </Link>
        </div>

        {hasProducts ? (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              // @ts-expect-error — product includes images via include above
              <ProductCard key={product.id} product={product} />
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
