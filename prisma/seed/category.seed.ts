import { Category, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();
const categories: Category[] = [
    {
        id: randomUUID(),
        name: 'limpieza',
        description: 'Productos de limpieza del hogar',
    },
    {
        id: randomUUID(),
        name: 'Herramientas',
        description: 'Productos para reparar/arreglar'
    },
    {
        id: randomUUID(),
        name: 'Snacks',
        description: 'Chitos, platanitos, papitas...'
    },
    {
        id: randomUUID(),
        name: 'Lacteos',
        description: 'Yogurt, queso...'
    },
    {
        id: randomUUID(),
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