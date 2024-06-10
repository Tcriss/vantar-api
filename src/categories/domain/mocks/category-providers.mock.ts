import { Category } from "@prisma/client";

export const prismaMock = {
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

export const mockCategoryRepository = {
  findAll: jest.fn(),
  findOne: jest.fn(),
};

export const mockCategoryService = {
  findAllCategories: jest.fn(),
  findOneCategory: jest.fn(),
};