import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ProductService } from '../../application/services/product.service';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductQueries } from '../../domain/types/product-queries.type';
import { ApiCreateProduct, ApiCreateProducts, ApiDeleteProduct, ApiGetProduct, ApiGetProducts, ApiUpdateProduct } from '../../application/decotators';
import { CreateProductDto, UpdateProductDto } from '../../domain/dtos';
import { RoleGuard } from '../../../auth/application/guards/role/role.guard';
import { Role } from '../../../common/application/decorators';
import { Roles } from '../../../common/domain/enums';

@ApiBearerAuth()
@ApiTags('Products')
@Role(Roles.CUSTOMER)
@UseGuards(RoleGuard)
@Controller('products')
export class ProductController {

    constructor(private readonly productService: ProductService) { }

    @ApiGetProducts()
    @Get()
    public async findAll(@Req() req: Request, @Query() queries: ProductQueries): Promise<Partial<ProductEntity>[]> {
        if (!queries.limit || !queries.page) throw new HttpException("'page' or 'limit' param missing", HttpStatus.BAD_REQUEST);

        const { page, limit, selected, q } = queries;

        return this.productService.findAll(
            {
                take: (page - 1) * limit,
                skip: +limit
            }, 
            req['user']['id'],
            q,
            selected
        );
    }

    @ApiGetProduct()    
    @Get(':id')
    public async findOne(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Req() req: Request,
        @Query('fields') selected?: string
    ): Promise<Partial<ProductEntity>> {
        const product: Partial<ProductEntity> = await this.productService.findOne(id, req['user']['id'], selected);

        if (!product) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return product;
    }

    @ApiCreateProducts()
    @Post('many')
    public async createMany(@Req() req: Request, @Body() products: CreateProductDto[]): Promise<unknown> {
        const res: number = await this.productService.createMany(req['user']['id'], products);

        return {
            message: 'Products created successfully',
            count: res
        };
    }

    @ApiCreateProduct()
    @Post()
    public async create(@Req() req: Request, @Body() product: CreateProductDto): Promise<unknown> {
        const res: ProductEntity = await this.productService.create(req['user']['id'], product);

        return {
            message: 'Product created successfully',
            product: res
        };

    }

    @ApiUpdateProduct()
    @Patch(':id')
    public async update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Req() req: Request,
        @Body() product: UpdateProductDto,
    ): Promise<unknown> {
        const res: ProductEntity = await this.productService.update(id, req['user']['id'], product);

        if (!res) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Product updated successfully',
            product: res
        };
    }

    @ApiDeleteProduct()
    @Delete(':id')
    public async delete(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: Request): Promise<unknown> {
        const res: ProductEntity = await this.productService.delete(id, req['user']['id']);

        if (!res) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return { message: 'Product deleted' };
    }
}
