import { InvoiceEntity } from '@invoices/domain/entities';

export const invoiceMock = {
  id: 'e2d3f5a2-d60b-4c8b-b5f5-6d84d2b9a5b6',
  shop_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  created_at: new Date(2024, 1, 5, 14, 10),
  total: 400.0,
  date: new Date(),
};

export const invoiceMock1: InvoiceEntity = {
  id: 'd1e4f5a2-b60b-4c8b-b5f5-6d84d2b9a5b6',
  shop_id: '2d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  created_at: new Date(2024, 1, 5, 14, 10),
  total: 400.0,
  date: new Date(),
  products: [
    {
      id: '2',
      name: 'Detergent',
      unit_price: 50.0,
      amount: 4,
      total: 200.0,
    },
  ],
};

export const invoiceMock2: InvoiceEntity = {
  id: 'e2d3f5a2-d60b-4c8b-b5f5-6d84d2b9a5b6',
  shop_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  created_at: new Date(2024, 1, 5, 14, 10),
  total: 400.0,
  date: new Date(),
  products: [
    {
      id: '1',
      name: 'Cloro',
      unit_price: 80.0,
      amount: 3,
      total: 240.0,
    },
  ],
};

export const partialInvoiceMock = {
  id: 'e2d3f5a2-d60b-4c8b-b5f5-6d84d2b9a5b6',
  shop_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  created_at: new Date(2024, 1, 5, 14, 10),
};

export const partialInvoiceMock1 = {
  id: 'd1e4f5a2-b60b-4c8b-b5f5-6d84d2b9a5b6',
  shop_id: '2d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  created_at: new Date(2024, 1, 5, 14, 10),
};

export const partialInvoiceMock2 = {
  id: 'e2d3f5a2-d60b-4c8b-b5f5-6d84d2b9a5b6',
  shop_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  created_at: new Date(2024, 1, 5, 14, 10),
};
