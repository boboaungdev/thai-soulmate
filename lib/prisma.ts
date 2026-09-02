import { PrismaClient } from "@/lib/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { env } from "./env"

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL,
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    adapter,
  })
}

export const prisma = (() => {
  if (
    globalForPrisma.prisma &&
    "trackingFolder" in globalForPrisma.prisma &&
    "trackingFile" in globalForPrisma.prisma &&
    "trackingStatusHistory" in globalForPrisma.prisma
  ) {
    return globalForPrisma.prisma
  }
  const client = createPrismaClient()
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client
  }
  return client
})()
