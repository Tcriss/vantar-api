import { PrismaClient } from '@prisma/client';
import { hash, genSalt } from 'bcrypt';

import { Roles } from '../../../common/domain/enums';

const prisma = new PrismaClient();

async function seedUser() {
    const saltrounds = await genSalt(+process.env.HASH);
    const user = {
        name: process.env.USER_NAME,
        email: process.env.USER_MAIL,
        role: Roles.ADMIN,
        password: await hash(process.env.USER_PW, saltrounds)
    };

    await prisma.user.upsert({
        where: { email: user.email },
        update: user,
        create: user
    });
}

seedUser().catch(err => {
    console.error(`Error populating database ${err}`);
    process.exit(1);
}).finally(async () => {
    prisma.$disconnect()
});