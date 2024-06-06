export const prismaMock = {
    customer: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  
  export const mockCustomerRepository = {
    readMany: jest.fn(),
    read: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  
  export const mockCustomerService = {
    findAllCategories: jest.fn(),
    findOneCategory: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  };