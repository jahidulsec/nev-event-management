import { PrismaClient } from "@/lib/generated/prisma";

const getPrisma = () => new PrismaClient();

const globalForUserDBPrismaClient = global as unknown as {
    db: ReturnType<typeof getPrisma>;
};

export const db =
    globalForUserDBPrismaClient.db || getPrisma();

if (process.env.NODE_ENV !== "production")
    globalForUserDBPrismaClient.db = db;