"use client"

import { Product, Image as PrismaImage } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ShoppingBag, Eye } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProductWithImages extends Product {
  images: PrismaImage[]
}

interface ProductCardProps {
  product: ProductWithImages
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const isOnSale = product.compareAtCents && product.compareAtCents > product.priceCents
  const salePercentage = isOnSale 
    ? Math.round(((product.compareAtCents - product.priceCents) / product.compareAtCents) * 100)
    : 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn("group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
          {/* Sale Badge */}
          {isOnSale && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                -{salePercentage}% OFF
              </div>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {product.inventory === 0 && (
            <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}

          {/* Product Image */}
          {product.images?.[0] && !imageError ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "object-cover transition-transform duration-500",
                isHovered && "scale-110"
              )}
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingBag className="h-12 w-12 mb-2" />
              <span className="text-sm">No image available</span>
            </div>
          )}

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-4 pointer-events-none"
          >
            <div className="flex gap-2">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Quick View</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-1">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs font-medium text-jade-600 uppercase tracking-wide">
              {product.brand}
            </p>
          )}

          {/* Title */}
          <h3 className="font-medium text-gray-900 group-hover:text-jade-600 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(product.priceCents)}
            </span>
            {product.compareAtCents && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{product.tags.length - 2}</span>
              )}
            </div>
          )}

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 mt-2">
            {product.inventory > 0 && product.inventory <= 5 && (
              <span className="text-xs text-orange-600 font-medium">
                Only {product.inventory} left
              </span>
            )}
            {product.inventory > 5 && (
              <span className="text-xs text-green-600 font-medium">
                In Stock
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}