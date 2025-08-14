// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["warn", "error"], // keep logs minimal in prod
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// --- Optional middleware (disabled for build) ---
// If you want request timing/logging later, uncomment this block.
// prisma.$use(async (params, next) => {
//   const before = Date.now();
//   const result = await next(params);
//   const after = Date.now();
//   if (after - before > 200) {
//     console.warn(`[Prisma] ${params.model}.${params.action} took ${after - before}ms`);
//   }
//   return result;
// });
