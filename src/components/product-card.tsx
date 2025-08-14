"use client";

import { Product, Image as PrismaImage } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import { useState } from "react";
import { cn, formatPrice } from "@/lib/utils";

interface ProductWithImages extends Product {
  images: PrismaImage[];
}

export function ProductCard({ product, className }: { product: ProductWithImages; className?: string }) {
  const [isHovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const compare = product.compareAtCents ?? undefined;
  const isOnSale = typeof compare === "number" && compare > product.priceCents;
  const salePct = isOnSale ? Math.round(((compare - product.priceCents) / compare) * 100) : 0;

  const img = product.images?.[0];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn("group", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
          {isOnSale && (
            <div className="absolute left-3 top-3 z-10">
              <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                -{salePct}% OFF
              </div>
            </div>
          )}

          {product.inventory === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
              <span className="text-lg font-semibold text-white">Out of Stock</span>
            </div>
          )}

          {img && !imageError ? (
            <Image
              src={img.url}
              alt={img.alt || product.title}
              fill
              className={cn("object-cover transition-transform duration-500", isHovered && "scale-110")}
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
              <ShoppingBag className="mb-2 h-12 w-12" />
              <span className="text-sm">No image available</span>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent pb-4"
          >
            <div className="flex gap-2">
              <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 backdrop-blur-sm">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Quick View</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-4 space-y-1">
          {product.brand && (
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">{product.brand}</p>
          )}
          <h3 className="line-clamp-2 font-medium text-gray-900 transition-colors group-hover:text-emerald-700">
            {product.title}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-gray-900">{formatPrice(product.priceCents)}</span>
            {typeof compare === "number" && (
              <span className="text-sm text-gray-500 line-through">{formatPrice(compare)}</span>
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((t, i) => (
                <span key={i} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {t}
                </span>
              ))}
              {product.tags.length > 2 && <span className="text-xs text-gray-500">+{product.tags.length - 2}</span>}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
