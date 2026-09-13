import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const getPrisma = () => new PrismaClient({ adapter });

const globalForUserDBPrismaClient = global as unknown as {
  db: ReturnType<typeof getPrisma>;
};

export const db = globalForUserDBPrismaClient.db || getPrisma();

if (process.env.NODE_ENV !== "production") globalForUserDBPrismaClient.db = db;
