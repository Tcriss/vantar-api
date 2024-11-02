import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ProductService } from '../../application/services/product.service';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductQueries } from '../../domain/types/product-queries.type';
import { ApiCreateProduct, ApiCreateProducts, ApiDeleteProduct, ApiGetProduct, ApiGetProducts, ApiUpdateProduct } from '../../application/decotators';
import { CreateProductDto, UpdateProductDto } from '../../domain/dtos';
import { RoleGuard } from '../../../auth/application/guards/role/role.guard';
import { Role } from '../../../common/application/decorators';
import { Roles } from '../../../common/domain/enums';
import { OwnerGuard } from '../../../auth/application/guards/owner/owner.guard';

@ApiBearerAuth()
@ApiTags('Products')
@Role(Roles.CUSTOMER)
@UseGuards(RoleGuard)
@Controller('products')
export class ProductController {

    constructor(private readonly productService: ProductService) { }

    @ApiGetProducts()
    @UseGuards(OwnerGuard)
    @Get()
    public async findAll(@Query() queries: ProductQueries): Promise<Partial<ProductEntity>[]> {
        if (!queries.limit || !queries.page) throw new HttpException("'page' or 'limit' param missing", HttpStatus.BAD_REQUEST);

        const { page, limit, selected, q, shop } = queries;

        return this.productService.findAll(
            shop,
            {
                skip: (page - 1) * limit,
                take: +limit
            },
            q,
            selected
        );
    }

    @ApiGetProduct()    
    @UseGuards(OwnerGuard)
    @Get(':id')
    public async findOne(@Param('id', new ParseUUIDPipe()) id: string, @Query('fields') selected?: string): Promise<Partial<ProductEntity>> {
        const product: Partial<ProductEntity> = await this.productService.findOne(id, selected);

        if (!product) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return product;
    }

    @ApiCreateProducts()
    @Post('many')
    public async createMany(@Body() products: CreateProductDto[]): Promise<unknown> {
        const res: number = await this.productService.createMany(products);

        return {
            message: 'Products created successfully',
            count: res
        };
    }

    @ApiCreateProduct()
    @Post()
    public async create(@Body() product: CreateProductDto): Promise<unknown> {
        const res: ProductEntity = await this.productService.create(product);

        return {
            message: 'Product created successfully',
            product: res
        };

    }

    @ApiUpdateProduct()
    @UseGuards(OwnerGuard)
    @Patch(':id')
    public async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() product: UpdateProductDto): Promise<unknown> {
        const res: ProductEntity = await this.productService.update(id, product);

        if (!res) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Product updated successfully',
            product: res
        };
    }

    @ApiDeleteProduct()
    @UseGuards(OwnerGuard)
    @Delete(':id')
    public async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<unknown> {
        const res: ProductEntity = await this.productService.delete(id);

        if (!res) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return { message: 'Product deleted' };
    }
}
