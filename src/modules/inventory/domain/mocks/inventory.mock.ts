import { InventoryEntity } from "../entities/inventory.entity";

export const mockInventory1: InventoryEntity = {
    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    products_amount: 3,
    capital: 3,
    company_name: 'Bodega la dulsura',
    created_at: new Date('2024-05-01T14:30:00Z'),
    service_charge: 5000.00,
    customer_id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905',
};

export const mockInventory2: InventoryEntity = {
    id: 'a8a7b9ec-7844-4c3b-932e-3db6be6e5e49',
    products_amount: 3,
    capital: 3,
    company_name: 'Salón Irene',
    created_at: new Date('2024-05-01T14:30:00Z'),
    service_charge: 10000.00,
    customer_id: '10c55da3-44c9-4a17-910c-6ae9235b993b',
};

export const mockInventory3: InventoryEntity = {
    id: 'a8a7b9ec-7844-4c3b-932e-3db6be6e5e49',
    products_amount: 3,
    capital: 3,
    company_name: 'Bodega la dulsura',
    created_at: new Date('2024-05-01T14:30:00Z'),
    service_charge: 5000,
    customer_id: '10c55da3-44c9-4a17-910c-6ae9235b993b',
};