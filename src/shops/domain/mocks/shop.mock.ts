import { ShopEntity } from "../entities";

export const shopMocks: ShopEntity[] = [
    {
        created_at: new Date('2023-01-01'),
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Vantar',
        user_id: '123e4567-e89b-12d3-a456-426614174000'
    },
    {
        created_at: new Date('2023-02-15'),
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Tech Haven',
        user_id: '123e4567-e89b-12d3-a456-426614174001'
    },
    {
        created_at: new Date('2023-03-20'),
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Gadget World',
        user_id: '123e4567-e89b-12d3-a456-426614174002'
    }
];

