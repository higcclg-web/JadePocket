// src/app/page.tsx
import Link from "next/link";
import { Product, Image as PrismaImage } from "@prisma/client";
import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";       // Prisma needs Node runtime on Vercel
export const dynamic = "force-dynamic"; // fetch at request time (no prerender)

type ProductWithImages = Product & { images: PrismaImage[] };

async function getProducts(): Promise<ProductWithImages[]> {
  try {
    const rows = await prisma.product.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });
    return rows as ProductWithImages[];
  } catch {
    // fail-safe: render empty state if DB isn't reachable
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-100 p-8 md:p-12 border border-emerald-200/60 shadow-sm">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            JadePocketShop
          </h1>
          <p className="mt-3 text-gray-700">
            Affordable designer‑inspired finds, updated often.
          </p>
          <div className="mt-6">
            <Link
              href="/shop"
              className="inline-block rounded-full bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700"
            >
              Shop now
            </Link>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">New arrivals</h2>
          <Link href="/shop" className="text-emerald-700 hover:underline">
            View all
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center text-gray-600">
            No products yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
