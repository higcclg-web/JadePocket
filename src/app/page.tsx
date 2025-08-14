import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic"; // fetch data at request time

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="p-8 bg-green-50 rounded-lg mb-8">
        <h1 className="text-4xl font-bold">JadePocketShop</h1>
        <p className="mt-2 text-gray-700">
          Affordable designer-inspired finds, updated often.
        </p>
        <Link
          href="#"
          className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded"
        >
          Shop now
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">New arrivals</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>No products yet. Check back soon.</p>
        )}
      </section>
    </div>
  );
}
