import { Injectable } from '@nestjs/common';

import { SelectedFields } from '../../domain/types';
import { Pagination } from "../../../common/domain/types/pagination.type";
import { ProductEntity } from '../../domain/entities/product.entity';
import { Repository } from '../../../common/domain/entities';

@Injectable()
export class ProductService {

    constructor(private productRepository: Repository<ProductEntity>) { }

    public async findAll(page: string, userId: string, query?: string, selected?: string): Promise<Partial<ProductEntity>[]> {
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

        return this.productRepository.findAll(userId, pagination, fields, query);
    }

    public async findOne(id: string, userId: string, selected?: string): Promise<Partial<ProductEntity>> {
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: false,
            name: selected.includes('name') ? true : false,
            price: selected.includes('price') ? true : false
        } : null;
        const product: Partial<ProductEntity> = await this.productRepository.findOne(id, fields);

        if (!product) return null;
        if (!(product.user_id === userId)) return undefined;

        return product;
    }

    public async createMany(userId: string, products: Partial<ProductEntity>[]): Promise<number> {
        products.map(product => product.user_id = userId);
        const res = await this.productRepository.createMany(products);

        return res['count'];
    }

    public async create(userId: string, product: Partial<ProductEntity>): Promise<ProductEntity> {
        product.user_id = userId;
        const res = await this.productRepository.create(product);

        return res as ProductEntity;
    }

    public async update(id: string, userId: string, product: Partial<ProductEntity>): Promise<ProductEntity> {
        const originalProduct: Partial<ProductEntity> = await this.findOne(id, userId);
        
        if (!originalProduct) return null;
        if (!(originalProduct.user_id === userId)) return undefined;
        
        return this.productRepository.update(id, product);
    }

    public async delete(id: string, userId: string): Promise<ProductEntity> {
        const product: Partial<ProductEntity> = await this.findOne(id, userId);
        
        if (!product) return null;
        if ((product.user_id === userId) === false) return undefined;
        
        return this.productRepository.delete(id);
    }
}
