import { PrismaClient } from '@prisma/client'

// Global function to get or create Prisma client
const globalForPrisma = globalThis

// Use global.prisma in development (set by dev-server.js) or create new client
const prisma = global.prisma ?? globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }