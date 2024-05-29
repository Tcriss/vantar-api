import { Category } from "@prisma/client";
import { v4 as uuid } from 'uuid';

export const categoryMock: Partial<Category> = {
    name: 'Limpieza',
    description: 'Productos de limpieza del hogar',
};

export const categoryMock1: Partial<Category> = {
    id: uuid(),
    name: 'Categoria1',
    description: 'Categoria de test'
}