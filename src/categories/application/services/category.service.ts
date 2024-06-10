import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';

import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {

    constructor(private repository: CategoryRepository) {}

    public async findAllCategories(): Promise<Category[]> {
        return this.repository.findAll();
    }

    public async findOneCategory(id?: string, name?: string): Promise<Category | undefined | null> {
        if (!id && !name) return null;

        const category: Category = await this.repository.findOne(id, name);

        if (!category) return undefined;

        return category;
    }
}