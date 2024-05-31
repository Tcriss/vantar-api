import { Module } from '@nestjs/common';

import { CategoryRepository } from './application/repositories/category.repository';
import { CategoryController } from './infrastructure/controllers/category.controller';
import { CategoryService } from './application/services/category.service';

@Module({
    controllers: [CategoryController],
    providers: [CategoryService, CategoryRepository],
})
export class CategoriesModule {}
