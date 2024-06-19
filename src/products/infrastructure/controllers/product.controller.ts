import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ProductService } from '../../application/services/product.service';
import { ProductEntity } from '../../domain/entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { ProductResponse } from '../../domain/types';
import { ProductQueries } from '../../domain/types/product-queries.type';
import { ReqUser } from '../../../common/domain/types';
import { ApiCreateProduct, ApiDeleteProduct, ApiGetProduct, ApiGetProducts, ApiUpdateProduct } from '../../application/decotators/open-api.decorator';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class ProductController {

    constructor(private service: ProductService) { }

    @ApiGetProducts()
    @Get()
    public async findAll(@Req() req: ReqUser, @Query() queries: ProductQueries ) {
        if (!queries.page) throw new HttpException('page query param is missing', HttpStatus.BAD_REQUEST);

        return this.service.findAllProducts(queries.page, req.user.id, queries.q, queries.selected);
    }

    @ApiGetProduct()    
    @Get(':id')
    public async findOne(@Param('id', ParseUUIDPipe) id: string, @Query('fields') selected?: string): Promise<Partial<ProductEntity>> {
        const product: Partial<ProductEntity> = await this.service.findOneProduct(id, selected);

        if (!product) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return product;
    }

    @ApiCreateProduct()
    @Post()
    public async create(@Body() product: CreateProductDto): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.createProduct(product);

        return {
            message: 'Product created succesfully',
            product: res
        };

    }

    @ApiUpdateProduct()
    @Patch(':id')
    public async update(@Param('id', ParseUUIDPipe) id: string, @Body() product: UpdateProductDto): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.updateProduct(id, product);

        if (res === null) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Product updated succesfully',
            product: res
        };
    }

    @ApiDeleteProduct()
    @Delete(':id')
    public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.deleteProduct(id);

        if (res === null) throw new HttpException('', HttpStatus.NOT_FOUND);

        return { message: 'Product deleted' };
    }
}
