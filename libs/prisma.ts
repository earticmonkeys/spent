import { PrismaClient } from "@prisma/client";
// Import the specific adapter
import { PrismaPg } from "@prisma/adapter-pg";

// Instantiate the adapter with your connection string
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

// Pass the adapter to the PrismaClient constructor
export const prisma = new PrismaClient({ adapter });
