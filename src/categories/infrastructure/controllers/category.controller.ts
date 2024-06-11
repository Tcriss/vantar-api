import { Controller, Get, Param, HttpException, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from '@prisma/client';

import { CategoryService } from '../../application/services/category.service';
import { uuidPipeOptions } from 'src/common/config/uuid-pipe.config';
import { CategoryEntity } from '../../domain/entities/category.entity';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class CategoryController {

    constructor(private service: CategoryService) { }

    @ApiOperation({ summary: 'Gets all categories' })
    @ApiResponse({ status: 200, type: CategoryEntity, isArray: true })
    @ApiResponse({ status: 500, description: 'Server error'})
    @Get()
    public async findAll(): Promise<Category[]> {
        return this.service.findAllCategories();
    }

    @ApiOperation({ summary: 'Gets a category' })
    @ApiResponse({ status: 200, type: CategoryEntity })
    @ApiResponse({ status: 400, description: 'Validations error'})
    @ApiResponse({ status: 404, description: 'Category not found' })
    @ApiResponse({ status: 500, description: 'Server error'})
    @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'The ID of the category'})
    @Get(':id')
    public async findOne(@Param('id', new ParseUUIDPipe(uuidPipeOptions)) id: string): Promise<Category> {
        const category: Category = await this.service.findOneCategory(id);

        if (!category) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

        return category;
    }

    @ApiOperation({ summary: 'Gets a category by its name' })
    @ApiResponse({ status: 200, type: CategoryEntity })
    @ApiResponse({ status: 400, description: 'Validations error'})
    @ApiResponse({ status: 404, description: 'Category not found' })
    @ApiResponse({ status: 500, description: 'Server error'})
    @ApiParam({ name: 'name', type: 'string', description: 'The name of the category'})
    @Get(':name')
    public async findOneByName(@Param('name') name: string): Promise<Category> {
        const category: Category = await this.service.findOneCategory(null, name);
        
        if (!category) throw new HttpException('Category not found', HttpStatus.NOT_FOUND);

        return category;
    }
}
