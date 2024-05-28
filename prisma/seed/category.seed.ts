import { Category, PrismaClient } from "@prisma/client";
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();
const categories: Category[] = [
    {
        id: uuid(),
        name: 'limpieza',
        description: 'Productos de limpieza del hogar',
    },
    {
        id: uuid(),
        name: 'Herramientas',
        description: 'Productos para reparar/arreglar'
    },
    {
        id: uuid(),
        name: 'Snacks',
        description: 'Chitos, platanitos, papitas...'
    },
    {
        id: uuid(),
        name: 'Lacteos',
        description: 'Yogurt, queso...'
    },
    {
        id: uuid(),
        name: 'Carne',
        description: 'Pollo, chuletas, res, cerd, jamón, salami...'
    },
];

async function seedCategories(): Promise<void> {
    categories.map(async (category) => {
        const post = await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category
        });
        
        console.log(`category ${post.name} added`)
    });
}

seedCategories().catch(err => {
    console.error(err);

    process.exit(1);
}).finally(async () => {
    prisma.$disconnect();
})