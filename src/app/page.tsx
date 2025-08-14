import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@prisma/client";

export const dynamic = "force-dynamic"; // fetch at request time

export default async function Home() {
  // Only show published, in-stock products
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED", inventory: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: { images: true },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section className="rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-100 p-8 shadow-sm md:p-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            JadePocketShop
          </h1>
          <p className="mt-3 text-gray-700">
            Affordable designer-inspired finds, updated often.
          </p>
          <Link
            href="#new"
            className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
          >
            Shop now
          </Link>
        </div>
      </section>

      {/* New arrivals */}
      <section id="new" className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">New arrivals</h2>
          <Link href="#" className="text-sm text-emerald-700 hover:underline">
            View all
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 py-16 text-center text-gray-500">
            No products yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p as Product & { images: any[] }} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
