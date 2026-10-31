import { PrismaClient } from '@prisma/client';
import { neon } from '@neondatabase/serverless';

// Cegah pembuatan instance PrismaClient berulang saat hot-reload di development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Helper untuk eksekusi SQL langsung via Neon Serverless driver (jika dibutuhkan)
export function getNeonSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
  if (!url) {
    throw new Error('DATABASE_URL or POSTGRES_URL is not defined in environment variables');
  }
  return neon(url);
}
