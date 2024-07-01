export const prismaMock = {
    invoice: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      createMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
};

export const mockInvoiceRepository = {
    findAllInvoices: jest.fn(),
    findOneInvoice: jest.fn(),
    createInvoice: jest.fn(),
    updateInvoice: jest.fn(),
    deleteInvoice: jest.fn(),
};

export const mockInvoiceService = {
    findAllInvoices: jest.fn(),
    findOneInvoice: jest.fn(),
    createInvoice: jest.fn(),
    updateInvoice: jest.fn(),
    deleteInvoice: jest.fn(),
};