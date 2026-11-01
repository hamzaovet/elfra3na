import "dotenv/config";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma?: PrismaClient; pool?: Pool };

function getPool(): Pool {
  if (!globalForPrisma.pool) {
    const rawUrl =
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_t9bkxH1KOCwv@ep-bitter-term-b9lxe3io-pooler.c-7.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

    globalForPrisma.pool = new Pool({
      connectionString: rawUrl,
      max: 10,
      connectionTimeoutMillis: 30000,
      ssl: { rejectUnauthorized: false },
    });
  }
  return globalForPrisma.pool;
}

function createPrismaClient(): PrismaClient {
  const pool = getPool();
  const adapter = new PrismaPg(pool, { schema: "public" });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
