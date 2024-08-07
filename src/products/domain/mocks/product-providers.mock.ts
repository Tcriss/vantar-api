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

export const mongoMock = {
  db: jest.fn(),
};

export const collectionMock = {
  collection: {
    findOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn()
  }
}

export const mockProductRepository = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  createMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const mockProductListRepository = {
  findOne: jest.fn(),
  insert: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn()
}

export const mockProductService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  createMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
