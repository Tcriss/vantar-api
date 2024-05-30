import { Body, Controller, Delete, Get, Param, Put, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiNoContentResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from '@prisma/client';

import { CategoryService } from '../../application/services/category.service';
import { CreateCategoryDTO } from '../dtos/create-category.dto';
import { EditCategoryDTO } from '../dtos/edit-category.dto';
import { categoryMock } from '../../domain/mocks/category.mock';
import { bad_req, not_found, server_error, success, success_array, uploaded } from '../config/swager-responses.config';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {

    constructor(private service: CategoryService) { }

    @ApiOperation({ summary: 'Gets all categories' })
    @ApiResponse(success_array)
    @ApiResponse(server_error)
    @Get()
    public async findAll(): Promise<Category[]> {
        return this.service.findAllCategories();
    }

    @ApiOperation({ summary: 'Gets a category' })
    @ApiResponse(success)
    @ApiResponse(bad_req)
    @ApiResponse(not_found)
    @ApiResponse(server_error)
    @Get(':id')
    public async findOne(@Param('id') id: string): Promise<Category> {
        const category: Category = await this.service.findOneCategory(id);

        if (!category) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

        return category;
    }

    @ApiOperation({ summary: 'Gets a category by its name' })
    @ApiResponse(success)
    @ApiResponse(bad_req)
    @ApiResponse(not_found)
    @ApiResponse(server_error)
    @Get(':name')
    public async findOneByName(@Param('name') name: string): Promise<Category> {
        const category: Category = await this.service.findOneCategory(null, name);
        
        if (!category) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

        return category;
    }

    @ApiOperation({ summary: 'Creates one category' })
    @ApiBody({ type: CreateCategoryDTO, schema: categoryMock })
    @ApiResponse(uploaded)
    @ApiResponse(bad_req)
    @ApiResponse(server_error)
    @Post()
    public async create(@Body() category: CreateCategoryDTO): Promise<Category> {
        return this.service.createCategory(category);
    }

    @ApiOperation({ summary: 'Edits a category' })
    @ApiResponse(success)
    @ApiResponse(bad_req)
    @ApiResponse(server_error)
    @ApiBody({ type: EditCategoryDTO })
    @Put(':id')
    public async update(@Param('id') id: string, @Body() category: EditCategoryDTO): Promise<Category> {
        const res: Category = await this.service.updateCategory(id, category);

        if (res === null) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

        return res;
    }

    @ApiOperation({ summary: 'Deletes a category' })
    @ApiNoContentResponse({description: 'Category deleted'})
    @ApiResponse(bad_req)
    @ApiResponse(not_found)
    @ApiResponse(server_error)
    @Delete(':id')
    public async delete(@Param('id') id: string): Promise<string> {
        const res: Category = await this.service.deleteCategory(id);
        
        if (!res) throw new HttpException('Category not deleted', HttpStatus.BAD_REQUEST);

        return 'Category deleted';
    }
}
