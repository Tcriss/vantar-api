import { Body, Controller, Delete, Get, Param, Put, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Category } from '@prisma/client';

import { CategoryService } from '../../application/services/category.service';
import { CreateCategoryDTO } from '../dtos/create-category.dto';
import { EditCategoryDTO } from '../dtos/edit-category.dto';

@ApiTags('Categoies')
@Controller('categories')
export class CategoryController {

    constructor(private service: CategoryService) {}

    @Get()
    public async findAll(): Promise<Category[]> {
        return this.service.findAllCategories();
    }

    @Get(':id')
    public async findOne(@Param('id') id: string): Promise<Category> {
        const category: Category = await this.service.findOneCategory(id);
        
        if (!category) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

        return category;
    }

    @Post()
    public async create(@Body() category: CreateCategoryDTO): Promise<Category> {
        const result: Category = await this.service.createCategory(category);

        return result;
    }

    @Put(':id')
    public async update(@Param('id') id: string, @Body() category: EditCategoryDTO): Promise<Category> {
        return this.service.updateCategory(id, category);
    }

    @Delete(':id')
    public async delete(@Param('id') id: string): Promise<Category> {
        return this.service.deleteCategory(id);
    }
}
