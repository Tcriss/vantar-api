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

    public async findAllProducts(page: string, inventoryId?: string, query?: string, selected?: string): Promise<Partial<ProductEntity>[]> {
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

        return this.repository.findAllProducts(pagination, inventoryId, fields, query);
    }

    public async findOneProduct(id: string, selected?: string): Promise<Partial<ProductEntity>> {
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: false,
            name: selected.includes('name') ? true : false,
            price: selected.includes('price') ? true : false
        } : null;

        const product: Partial<ProductEntity> = await this.repository.findOneProduct(id, fields);

        if (!product) return undefined;

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

    public async updateProduct(id: string, product: Partial<ProductEntity>): Promise<ProductEntity> {
        const isExist: boolean = await this.findOneProduct(id) ? true : false;

        if (!isExist) return null;
        
        return this.repository.updateProduct(id, product);
    }

    public async deleteProduct(id: string): Promise<ProductEntity> {
        const isExist: boolean = await this.findOneProduct(id) ? true : false;

        if (!isExist) return null;
        
        return this.repository.deleteProduct(id);
    }
}
