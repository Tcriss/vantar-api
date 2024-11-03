import { ProductEntity } from '@products/domain/entities';

export const productMock1: ProductEntity = {
  id: 'e2d3f5a2-d60b-4c8b-b5f5-6d84d2b9a5b6',
  created_at: new Date(2024, 1, 5, 14, 10),
  shop_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Cloro',
  price: 105.00
};

export const productMock2: ProductEntity = {
  id: 'd1e4f5a2-b60b-4c8b-b5f5-6d84d2b9a5b6',
  created_at: new Date(2024, 1, 5, 14, 10),
  shop_id: '2d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Detergente',
  price: 150.00
};

export const productMock3: ProductEntity = {
  id: 'f3a1e5a2-b70b-4c8b-b5f5-6d84d2b9a5b6',
  created_at: new Date(2024, 1, 5, 14, 10),
  shop_id: '3d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Jabón',
  price: 50.00
};

export const productMock4: ProductEntity = {
  id: 'a3b5c2e4-f60b-4c8b-b5f5-6d84d2b9a5b6',
  created_at: new Date(2024, 1, 5, 14, 10),
  shop_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Suavizante',
  price: 75.00
};

export const productMock5: ProductEntity = {
  id: 'b4c2e5a3-a60b-4c8b-b5f5-6d84d2b9a5b6',
  created_at: new Date(2024, 1, 5, 14, 10),
  shop_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Arroz',
  price: 25.00
};

export const productMock6: ProductEntity = {
  id: 'e2d3f5a2-d60b-4c8b-b5f5-6d84d2b9a5b6',
  created_at: new Date(2024, 1, 5, 14, 10),
  shop_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Detergente',
  price: 150.00
};

export const partialProductMock1: Partial<ProductEntity> = {
  id: 'e2d3f5a2-d60b-4c8b-b5f5-6d84d2b9a5b6',
  created_at: new Date(2024, 1, 5, 14, 10),
  shop_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Cloro',
};

export const partialProductMock2: Partial<ProductEntity> = {
  id: 'd1e4f5a2-b60b-4c8b-b5f5-6d84d2b9a5b6',
  created_at: new Date(2024, 1, 5, 14, 10),
  shop_id: '2d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Detergente',
};

export const partialProductMock3: Partial<ProductEntity> = {
  id: 'f3a1e5a2-b70b-4c8b-b5f5-6d84d2b9a5b6',
  created_at: new Date(2024, 1, 5, 14, 10),
  shop_id: '3d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Jabón',
};