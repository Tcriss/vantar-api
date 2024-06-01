import { Category } from "@prisma/client";

export const prismaMock = {
  category: {
    findMany: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

export const mockCategoryRepository = {
  readMany: jest.fn(),
  read: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const mockCategoryService = {
  findAllCategories: jest.fn(),
  findOneCategory: jest.fn(),
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
};