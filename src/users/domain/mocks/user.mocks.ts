import { User } from "@prisma/client";

import { Role } from "../../application/enums";

export const userMock: User = {
    id: "a4b1c2d3-4567-890a-bcde-fghij1234567",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    active: true,
    refresh_token: '',
    role: 'ADMIN',
    password: "$2b$12$KIX8H7JypTzRa7B5F5qWpu1bOCtYX5bHCQJ4L2g7hAl4oEGd6Xb92",
    created_at: new Date('2024-06-05T10:00:00Z')
};
export const usersMock: User[] = [
    {
        id: "a4b1c2d3-4567-890a-bcde-fghij1234567",
        name: "Alice Smith",
        email: "alice.smith@example.com",
        active: true,
        refresh_token: '',
        role: 'ADMIN',
        password: "$2b$12$KIX8H7JypTzRa7B5F5qWpu1bOCtYX5bHCQJ4L2g7hAl4oEGd6Xb92",
        created_at: new Date('2024-06-05T10:00:00Z')
    },
    {
        id: "b5c2d3e4-5678-901a-bcde-fghij2345678",
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        active: true,
        refresh_token: '',
        role: Role.CUSTOMER,
        password: "$2b$12$QmS1K/X7I5H7/CB5V7P9u.eRtPfX6s6JFF9CJYy3FZ5QABw0cN3mK",
        created_at: new Date('2024-06-05T10:00:00Z')
    },
    {
        id: "c6d3e4f5-6789-012a-bcde-fghij3456789",
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        active: true,
        refresh_token: '',
        role: 'CUSTOMER',
        password: "$2b$12$gTIcY9qCXVJ/X3FP6QH7vuQm8Ra8JzY4PxTnSy1F3CwK3EZoL6mVi",
        created_at: new Date('2024-06-05T10:00:00Z')
    },
    {
        id: "c6d3e4f5-6789-012a-bcde-fghij3456789",
        name: "Bob Johnson",
        email: "charlie.brown@example.com",
        active: true,
        refresh_token: '',
        role: 'CUSTOMER',
        password: "$2b$12$QmS1K/X7I5H7/CB5V7P9u.eRtPfX6s6JFF9CJYy3FZ5QABw0cN3mK",
        created_at: new Date('2024-06-05T10:00:00Z')
    },
];
