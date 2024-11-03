export const prismaMock = {
    shop: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }
};

export const shopRepositoryMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

export const shopServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}

export const cacheProviderMock = {
    set: jest.fn(),
    get: jest.fn(),
    reset: jest.fn(),
    del: jest.fn()
}
