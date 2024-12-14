import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const db = globalForPrisma.prisma ?? new PrismaClient({
    transactionOptions: {
        maxWait: 25000, /// default 2000
        timeout: 25000 /// default 5000
    },
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"]
});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}