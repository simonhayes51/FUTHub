import { PrismaClient } from '@prisma/client';

// Separate Prisma client for FUT Traders Hub players database
const playersDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PLAYERS_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

export { playersDb };
