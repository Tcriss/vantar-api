import { Category } from "@prisma/client";

// prisma.mock.ts
export const prismaMock = {
    category: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  