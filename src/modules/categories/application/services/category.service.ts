import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';

import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {

    constructor(private readonly repository: CategoryRepository) {}

    public async findAllCategories(): Promise<Category[]> {
        return this.repository.readMany();
    }

    public async findOneCategory(id?: string, name?: string): Promise<Category | undefined> {
        const category: Category | undefined = await this.repository.read(id, name);

        if (!category) null;

        return category;
    }

    public async createCategory(category: Partial<Category>): Promise<Category> {
        return this.repository.create(category);
    }

    public async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
        return this.repository.update(id, category);
    }

    public async deleteCategory(id: string): Promise<Category> {
        return this.repository.delete(id);
    }
}