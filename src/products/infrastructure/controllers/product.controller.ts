import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductService } from '../../application/services/product.service';
import { ProductEntity } from '../../domain/entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { ProductResponse } from '../../domain/types';
import { ProductQueries } from '../../domain/types/product-queries.type';
import { ReqUser } from '../../../common/domain/types';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductController {

    constructor(private service: ProductService) { }

    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, type: ProductEntity, isArray: true })
    @ApiResponse({ status: 400, description: 'page param missing' })
    @ApiQuery({ name: 'page', required: true, example: '0, 10' })
    @ApiQuery({ name: 'q', required: false, description: 'search param to filter results' })
    @ApiQuery({ name: 'selected', required: false, description: 'fields you want to select from response' })
    @Get()
    public async findAll(@Req() req: ReqUser, @Query() queries: ProductQueries ) {
        if (!queries.page) throw new HttpException('page query param is missing', HttpStatus.BAD_REQUEST);

        return this.service.findAllProducts(queries.page, req.user.id, queries.q, queries.selected);
    }

    @ApiOperation({ summary: 'Get one product' })
    @ApiResponse({ status: 200, type: ProductEntity })
    @ApiResponse({ status: 400, description: 'Invalid id' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @Get(':id')
    public async findOne(@Param('id', ParseUUIDPipe) id: string, @Query('fields') selected?: string): Promise<Partial<ProductEntity>> {
        const product: Partial<ProductEntity> = await this.service.findOneProduct(id, selected);

        if (!product) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return product;
    }

    @ApiOperation({ summary: 'Create product' })
    @ApiResponse({ status: 200, description: 'Product created succesfully', type: ProductEntity, })
    @ApiResponse({ status: 400, description: 'Validations error' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @Post()
    public async create(@Body() product: CreateProductDto): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.createProduct(product);

        return {
            message: 'Product created succesfully',
            product: res
        };

    }

    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({ status: 200, description: 'Product updated succesfully', type: ProductEntity })
    @ApiResponse({ status: 400, description: 'Validations error' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @Patch(':id')
    public async update(@Param('id', ParseUUIDPipe) id: string, @Body() product: UpdateProductDto): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.updateProduct(id, product);

        if (res === null) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Product updated succesfully',
            product: res
        };
    }

    @ApiOperation({ summary: 'Delete product' })
    @ApiResponse({ status: 200, description: 'Product deleted succesfully' })
    @ApiResponse({ status: 400, description: 'Id invalid' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @Delete(':id')
    public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.deleteProduct(id);

        if (res === null) throw new HttpException('', HttpStatus.NOT_FOUND);

        return { message: 'Product deleted' };
    }
}
