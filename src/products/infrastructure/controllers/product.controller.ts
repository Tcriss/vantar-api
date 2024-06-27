import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ProductService } from '../../application/services/product.service';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductResponse } from '../../domain/types';
import { ProductQueries } from '../../domain/types/product-queries.type';
import { ReqUser } from '../../../common/domain/types';
import { ProductControllerI } from '../../domain/interfaces';
import { ApiCreateProduct, ApiCreateProducts, ApiDeleteProduct, ApiGetProduct, ApiGetProducts, ApiUpdateProduct } from '../../application/decotators';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { RoleGuard } from '../../../auth/application/guards/role/role.guard';
import { Role } from '../../../common/application/decorators';
import { Roles } from '../../../common/domain/enums';

@ApiBearerAuth()
@ApiTags('Products')
@Role(Roles.CUSTOMER)
@UseGuards(RoleGuard)
@Controller('products')
export class ProductController implements ProductControllerI {

    constructor(private service: ProductService) { }

    @ApiGetProducts()
    @Get()
    public async findAll(@Req() req: ReqUser, @Query() queries: ProductQueries): Promise<Partial<ProductEntity>[]> {
        if (!queries.page) throw new HttpException('page query param is missing', HttpStatus.BAD_REQUEST);

        return this.service.findAllProducts(queries.page, req.user.id, queries.q, queries.selected);
    }

    @ApiGetProduct()    
    @Get(':id')
    public async findOne(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Req() req: ReqUser,
        @Query('fields') selected?: string
    ): Promise<Partial<ProductEntity>> {
        const product: Partial<ProductEntity> = await this.service.findOneProduct(id, req.user.id, selected);

        if (product === undefined) throw new HttpException('Not enough permissions', HttpStatus.FORBIDDEN);
        if (product === null) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return product;
    }

    @ApiCreateProducts()
    @Post('many')
    public async createMany(@Req() req: ReqUser, @Body() products: CreateProductDto[]): Promise<ProductResponse> {
        const res: number = await this.service.createManyProducts(req.user.id, products);

        return {
            message: 'Products created successfully',
            count: res
        };
    }

    @ApiCreateProduct()
    @Post()
    public async createOne(@Req() req: ReqUser, @Body() product: CreateProductDto): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.createOneProduct(req.user.id, product);

        return {
            message: 'Product created successfully',
            product: res
        };

    }

    @ApiUpdateProduct()
    @Patch(':id')
    public async update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() product: UpdateProductDto,
        @Req() req: ReqUser
    ): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.updateProduct(id, product, req.user.id);

        if (res === undefined) throw new HttpException('Not enough permissions', HttpStatus.FORBIDDEN);
        if (res === null) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return {
            message: 'Product updated successfully',
            product: res
        };
    }

    @ApiDeleteProduct()
    @Delete(':id')
    public async delete(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: ReqUser): Promise<ProductResponse> {
        const res: ProductEntity = await this.service.deleteProduct(id, req.user.id);

        if (res === undefined) throw new HttpException('Not enough permissions', HttpStatus.FORBIDDEN);
        if (res === null) throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

        return { message: 'Product deleted' };
    }
}
