import { Category } from "@prisma/client";

export const categoryList: Category[] = [
    {
        description: 'Yogurt, queso...',
        id: 'bbb326c1-747c-4846-a124-55fc3e155fdb',
        name: 'Lacteos',
    },
    {
        description: 'Productos de limpieza del hogar',
        id: '927aaab2-7f05-4cb2-80e4-d129a99aa825',
        name: 'limpieza',
    },
    {
        description: 'Productos para reparar/arreglar',
        id: 'dda764ce-f1ff-411e-ac85-85666ff76c5d',
        name: 'Herramientas',
    },
    {
        description: 'Chitos, platanitos, papitas...',
        id: '833b5819-c016-4caa-9c62-572f73ed2af8',
        name: 'Snacks',
    },
    {
        description: 'Pollo, chuletas, res, cerd, jamón, salami...',
        id: 'c617bf0b-b08c-4c5f-8a53-8331ba14a269',
        name: 'Carne',
    },
];