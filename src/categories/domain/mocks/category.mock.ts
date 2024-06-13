import { Category } from "@prisma/client";

export const categories: Category[] = [
    { 
        id: '1',
        name: 'Test',
        description: 'Test'
    }
];

export const category: Category = { 
    id: '1',
    name: 'Test',
    description: 'Test'
};

export const categoryMock: Partial<Category> = {
    name: 'Categoría',
    description: 'Productos utiles para repararación.'
};