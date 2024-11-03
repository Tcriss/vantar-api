import { productListMock, productListMock1, productListMock2 } from "@products/domain/mocks/product-list.mock";
import { InventoryEntity } from "@inventories/domain/entities";

export const mockInventory1: InventoryEntity = {
    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    cost: 3,
    subtotal: 3,
    total: 300,
    created_at: new Date('2024-05-01T14:30:00Z'),
    shop_id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905',
    products: [productListMock]
};

export const mockInventory2: InventoryEntity = {
    id: 'a8a7b9ec-7844-4c3b-932e-3db6be6e5e49',
    cost: 3000,
    subtotal: 23929,
    total: 3000,
    created_at: new Date('2024-05-01T14:30:00Z'),
    shop_id: '10c55da3-44c9-4a17-910c-6ae9235b993b',
    products: [productListMock1]
};

export const mockInventory3: InventoryEntity = {
    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    cost: 3,
    subtotal: 3,
    total: 4000,
    created_at: new Date('2024-05-01T14:30:00Z'),
    shop_id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905',
    products: [productListMock2]
};

export const mockPartialInventory1: Partial<InventoryEntity> = {
    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    cost: 3,
    total: 400,
    shop_id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905',
};

export const mockPartialInventory2: Partial<InventoryEntity> = {
    id: 'a8a7b9ec-7844-4c3b-932e-3db6be6e5e49',
    cost: 3,
    total: 500,
    shop_id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905',
};

export const mockPartialInventory3: Partial<InventoryEntity> = {
    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    total: 600,
    shop_id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905',
};