import { Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';

import { SelectedFields } from '../../domain/types';
import { Pagination } from "../../../common/domain/types/pagination.type";
import { ProductEntity } from '../../domain/entities/product.entity';
import { Repository } from '../../../common/domain/entities';
import { Cached } from '../../../common/application/decorators';

@Injectable()
export class ProductService {

    constructor(
        @Cached() private cache: Cache,
        private productRepository: Repository<ProductEntity>
    ) { }

    public async findAll(page: string, userId: string, query?: string, selected?: string): Promise<Partial<ProductEntity>[]> {
        const pagination: Pagination = {
            skip: +page.split(',')[0],
            take: +page.split(',')[1]
        };
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: true,
            name: selected.includes('name') ? true : false,
            price: selected.includes('price') ? true : false
        } : null;
        await Promise.all([
            await this.cache.set('products-pagination', pagination),
            await this.cache.set('products-fields', fields)
        ]);
        const cachedPagination = await this.cache.get('products-pagination');
        const cachedFields = await this.cache.get('products-fields');
        const cachedProducts: Partial<ProductEntity>[] = await this.cache.get('products');

        if (cachedProducts && cachedFields == fields && cachedPagination == pagination) return cachedProducts;

        const products = await this.productRepository.findAll(userId, pagination, fields, query);
        await this.cache.set('products', products);

        return products;
    }

    public async findOne(id: string, userId: string, selected?: string): Promise<Partial<ProductEntity>> {
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: true,
            name: selected.includes('name'),
            price: selected.includes('price')
        } : null;
        await this.cache.set('product-fields', fields);
        const cachedProduct: ProductEntity = await this.cache.get('product');
        const cachedFields = await this.cache.get('product-fields');

        if (cachedProduct && cachedProduct.id === id && cachedFields === fields) return cachedProduct;
        
        const product: Partial<ProductEntity> = await this.productRepository.findOne(id, fields);

        if (!product) return null;
        if (!(product.user_id === userId)) return undefined;

        await this.cache.set('product', product);

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
        if (originalProduct.user_id !== userId) return undefined;
        
        return this.productRepository.update(id, product);
    }

    public async delete(id: string, userId: string): Promise<ProductEntity> {
        const product: Partial<ProductEntity> = await this.findOne(id, userId);
        
        if (!product) return null;
        if (product.user_id !== userId) return undefined;

        await Promise.all([
            await this.cache.del('product-fields'),
            await this.cache.del('product')
        ]);
        
        return this.productRepository.delete(id);
    }
}
