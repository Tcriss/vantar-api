export const prismaMock = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      createMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  
  export const mockProductRepository = {
    findAllProducts: jest.fn(),
    findOneProduct: jest.fn(),
    createManyProducts: jest.fn(),
    createOneProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };
  
  export const mockProductService = {
    findAllProducts: jest.fn(),
    findOneProduct: jest.fn(),
    createManyProducts: jest.fn(),
    createOneProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };