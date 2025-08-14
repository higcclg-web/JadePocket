// src/app/product/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

// Next 15 may type `params` as a Promise—so we await it.
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true },
  });

  if (!product) {
    notFound();
  }

  const primaryImage = product.images?.[0];

  const isOnSale =
    product.compareAtCents != null && product.compareAtCents > product.priceCents;

  const salePct = isOnSale
    ? Math.round(
        ((product.compareAtCents! - product.priceCents) / product.compareAtCents!) * 100
      )
    : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
      >
        ← Back to shop
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              No image available
            </div>
          )}

          {isOnSale && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
              -{salePct}% OFF
            </span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{product.title}</h1>

          {product.brand && (
            <p className="mt-1 text-sm uppercase tracking-wide text-emerald-700">
              {product.brand}
            </p>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">
              {formatPrice(product.priceCents, product.currency || "USD")}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtCents!, product.currency || "USD")}
              </span>
            )}
          </div>

          {product.inventory != null && (
            <p className="mt-2 text-sm text-gray-600">
              {product.inventory > 0
                ? product.inventory <= 5
                  ? `Only ${product.inventory} left`
                  : "In stock"
                : "Out of stock"}
            </p>
          )}

          {product.description && (
            <div className="prose mt-6 max-w-none">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
