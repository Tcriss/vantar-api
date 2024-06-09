import { ProductEntity } from '../entities/product.entity';

export const productMock1: ProductEntity = {
  id: 'e2d3f5a2-d60b-4c8b-b5f5-6d84d2b9a5b6',
  inventory_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Cloro',
  stock: 5,
  price: 105.00,
  unit_measure: '1 galón',
  category_name: 'Limpieza',
  created_at: new Date('2024-01-01T00:00:00Z'),
  expiration: new Date('2025-01-01T00:00:00Z')
};

export const productMock2: ProductEntity = {
  id: 'd1e4f5a2-b60b-4c8b-b5f5-6d84d2b9a5b6',
  inventory_id: '2d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Detergente',
  stock: 10,
  price: 150.00,
  unit_measure: '2 litros',
  category_name: 'Limpieza',
  created_at: new Date('2024-02-01T00:00:00Z'),
  expiration: new Date('2025-02-01T00:00:00Z')
};

export const productMock3: ProductEntity = {
  id: 'f3a1e5a2-b70b-4c8b-b5f5-6d84d2b9a5b6',
  inventory_id: '3d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Jabón',
  stock: 20,
  price: 50.00,
  unit_measure: '500 ml',
  category_name: 'Higiene',
  created_at: new Date('2024-03-01T00:00:00Z'),
  expiration: new Date('2024-04-01T00:00:00Z')
};

export const productMock4: ProductEntity = {
  id: 'a3b5c2e4-f60b-4c8b-b5f5-6d84d2b9a5b6',
  inventory_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Suavizante',
  stock: 0,
  price: 75.00,
  unit_measure: '1 litro',
  category_name: 'Limpieza',
  created_at: new Date('2024-04-01T00:00:00Z'),
  expiration: new Date('2025-04-01T00:00:00Z')
};

export const productMock5: ProductEntity = {
  id: 'b4c2e5a3-a60b-4c8b-b5f5-6d84d2b9a5b6',
  inventory_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Arroz',
  stock: 50,
  price: 25.00,
  unit_measure: '1 kg',
  category_name: 'Alimentos',
  created_at: new Date('2024-05-01T00:00:00Z'),
  expiration: new Date('2024-12-01T00:00:00Z')
};

export const productMock6: ProductEntity = {
  id: 'e2d3f5a2-d60b-4c8b-b5f5-6d84d2b9a5b6',
  inventory_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Detergente',
  stock: 10,
  price: 150.00,
  unit_measure: '2 litros',
  category_name: 'Limpieza',
  created_at: new Date('2024-01-01T00:00:00Z'),
  expiration: new Date('2025-01-01T00:00:00Z')
};

export const partialProductMock1: Partial<ProductEntity> = {
  id: 'e2d3f5a2-d60b-4c8b-b5f5-6d84d2b9a5b6',
  inventory_id: '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Cloro',
};

export const partialProductMock2: Partial<ProductEntity> = {
  id: 'd1e4f5a2-b60b-4c8b-b5f5-6d84d2b9a5b6',
  inventory_id: '2d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Detergente',
};

export const partialProductMock3: Partial<ProductEntity> = {
  id: 'f3a1e5a2-b70b-4c8b-b5f5-6d84d2b9a5b6',
  inventory_id: '3d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a',
  name: 'Jabón',
};