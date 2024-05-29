import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { CategoryRepository } from './application/repositories/category.repository';

@Module({
    providers: [CategoryRepository],
    imports: [PrismaModule]
})
export class CategoriesModule {}
