import { Product } from "@prisma/client";

export const products: Product[] = [];

export const product: Product = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Cloro',
    amount: 5,
    price: 135,
    userId: '',
    unit_measure: '1 galon',
    category_name: 'Limpieza',
    expiration: new Date(),
};