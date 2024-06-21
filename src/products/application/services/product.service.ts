import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { SelectedFields } from '../../domain/types';
import { Pagination } from "../../../common/domain/types/pagination.type";
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductRepositoryI } from '../../domain/interfaces/product-repository.interface';
import { ProductServiceI } from '../../domain/interfaces';
import { Repository } from '../decotators';

@Injectable()
export class ProductService implements ProductServiceI {

    constructor(@Repository() private repository: ProductRepositoryI) { }

    public async findAllProducts(page: string, userId: string, query?: string, selected?: string): Promise<Partial<ProductEntity>[]> {
        const pagination: Pagination = {
            skip: +page.split(',')[0],
            take: +page.split(',')[1]
        };
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: false,
            name: selected.includes('name') ? true : false,
            price: selected.includes('price') ? true : false
        } : null;

        return this.repository.findAllProducts(pagination, userId, fields, query);
    }

    public async findOneProduct(id: string, userId: string, selected?: string): Promise<Partial<ProductEntity>> {
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: false,
            name: selected.includes('name') ? true : false,
            price: selected.includes('price') ? true : false
        } : null;

        const product: Partial<ProductEntity> = await this.repository.findOneProduct(id, fields);
        const isOwner: boolean = product.user_id === userId;

        if (!isOwner) return undefined;
        if (!product) return null;

        return product;
    }

    public async createManyProducts(userId: string, products: Partial<ProductEntity>[]): Promise<number> {
        products.map(product => product.user_id = userId);
        const res: Prisma.BatchPayload = await this.repository.createManyProducts(products);

        return res.count
    }

    public async createOneProduct(userId: string, product: Partial<ProductEntity>): Promise<ProductEntity> {
        product.user_id = userId;
        return this.repository.createOneProduct(product);
    }

    public async updateProduct(id: string, product: Partial<ProductEntity>, userId: string): Promise<ProductEntity> {
        const originalProduct: Partial<ProductEntity> = await this.findOneProduct(id, userId);
        const isOwner: boolean = originalProduct.user_id === userId;
        const isExist: boolean = originalProduct  ? true : false;

        if (!isOwner) return undefined;
        if (!isExist) return null;
        
        return this.repository.updateProduct(id, product);
    }

    public async deleteProduct(id: string, userId: string): Promise<ProductEntity> {
        const product: Partial<ProductEntity> = await this.findOneProduct(id, userId);
        const isOwner: boolean = product.user_id === userId;
        const isExist: boolean = product  ? true : false;

        if (!isOwner) return undefined;
        if (!isExist) return null;
        
        return this.repository.deleteProduct(id);
    }
}
