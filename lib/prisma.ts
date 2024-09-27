import { PrismaClient } from "@prisma/client";

// Declare global type to avoid unsafe assignments in development
declare global {
  // Define a global variable with an explicit type
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Assign a type to the Prisma instance
const prisma: PrismaClient = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
