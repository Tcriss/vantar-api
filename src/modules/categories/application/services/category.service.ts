import { Injectable, ParseUUIDPipe } from '@nestjs/common';
import { Category } from '@prisma/client';

import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {

    constructor(private repository: CategoryRepository) {}

    public async findAllCategories(): Promise<Category[]> {
        return this.repository.readMany();
    }

    public async findOneCategory(id?: string, name?: string): Promise<Category | undefined | null> {
        if (!id && !name) return null;

        const category: Category = await this.repository.read(id, name);

        if (!category) return undefined;

        return category;
    }

    public async createCategory(category: Partial<Category>): Promise<Category> {
        const name: string = category.name.charAt(0).toUpperCase() + category.name.slice(1);
        const description: string = category.description;

        return this.repository.create({ name, description});
    }

    public async updateCategory(id: string, category: Partial<Category>): Promise<Category | undefined | null> {
        if (!id) return null;

        const isExist: boolean = await this.repository.read(id) ? true : false;

        if (!isExist) return undefined;
        
        const name: string = category.name.charAt(0).toUpperCase() + category.name.slice(1);
        const description: string = category.description;

        return this.repository.update(id, { name, description});
    }

    public async deleteCategory(id: string): Promise<Category | undefined | null> {
        if (!id) return null;

        const isExist: boolean = await this.repository.read(id) ? true : false;

        if (!isExist) return undefined;

        return this.repository.delete(id);
    }
}