import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ProductService } from '../../application/services/product.service';
import { ProductEntity } from '../../domain/entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { ProductResponse } from '../../domain/types';
import { ProductQueries } from '../../domain/types/product-queries.type';
import { AccessTokenGuard } from '../../../auth/application/guards/access-token/access-token.guard';

@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductController {

    constructor(private service: ProductService) { }

    @ApiOperation({ summary: 'Get all products' })
    @ApiQuery({ name: 'page', required: true, example: '0, 10' })
    //@ApiQuery({ name: 'q', required: false, description: 'search param to filter results' })
    @ApiQuery({ name: 'selected', required: false, description: 'fields you want to select from response' })
    @Get('all/:inventory_id')
    public async findAll(@Param('inventory_id') inventory_id: string, @Query() queries?: ProductQueries ) {
        if (!queries.page) throw new HttpException('page query param is missing', HttpStatus.BAD_REQUEST);

        return this.service.findAllProducts(queries.page, inventory_id, queries.q, queries.selected);
    }

    @ApiOperation({ summary: 'Get one product' })
    @Get(':id')
    public async findOne(@Param('id', ParseUUIDPipe) id: string, @Query('fields') selected?: string): Promise<Partial<ProductEntity>> {
        const product: Partial<ProductEntity> = await this.service.findOneProduct(id, selected);

        if (!product) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return product;
    }

    @ApiOperation({ summary: 'Create product' })
    @Post()
    public async create(@Body() product: CreateProductDto): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.createProduct(product);

        return {
            message: 'Product created succesfully',
            product: res
        };

    }

    @ApiOperation({ summary: 'Update product' })
    @Patch(':id')
    public async update(@Param('id', ParseUUIDPipe) id: string, @Body() product: UpdateProductDto): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.updateProdcut(id, product);

        if (res === null) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Product updated succesfully',
            product: res
        };
    }

    @ApiOperation({ summary: 'Delete product' })
    @Delete(':id')
    public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.deleteProduct(id);

        if (res === null) throw new HttpException('', HttpStatus.NOT_FOUND);

        return { message: 'Product deleted' };
    }
}
