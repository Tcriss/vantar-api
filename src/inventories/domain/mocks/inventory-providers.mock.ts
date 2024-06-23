export const prismaMock = {
    inventory: {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

export const mockInventoryRepository = {
    findAllInventories: jest.fn(),
    findOneInventory: jest.fn(),
    createInventory: jest.fn(),
    updateInventory: jest.fn(),
    deleteInventory: jest.fn(),
};

export const mockInventoryService = {
    findAllInventories: jest.fn(),
    findOneInventory: jest.fn(),
    createInventory: jest.fn(),
    updateInventory: jest.fn(),
    deleteInventory: jest.fn(),
};