import { Category } from "@prisma/client";
import { randomUUID } from "crypto";

export const categoryMock: Partial<Category> = {
    name: 'Limpieza',
    description: 'Productos de limpieza del hogar',
};

export const categoryMock1: Partial<Category> = {
    id: randomUUID(),
    name: 'Categoria1',
    description: 'Categoria de test'
}