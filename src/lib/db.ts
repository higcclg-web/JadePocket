import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  })
}

// Prevent multiple instances of Prisma Client in development
export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Optional: Add middleware for soft deletes, logging, etc.
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  
  // Log slow queries in development
  if (process.env.NODE_ENV === 'development') {
    const duration = after - before
    if (duration > 100) {
      console.log(`Query ${params.model}.${params.action} took ${duration}ms`)
    }
  }
  
  return result
})

// Export types for use in components
export type { 
  Product, 
  Image, 
  Order, 
  OrderLine, 
  BrandAuthorization,
  ProductStatus,
  OrderStatus 
} from '@prisma/client'