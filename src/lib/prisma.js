import "dotenv/config";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = pkg;
const globalForPrisma = globalThis;
const connectionString = process.env.DATABASE_URL;
const prismaOptions = connectionString
  ? { adapter: new PrismaPg({ connectionString }) }
  : {};

const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
