import { Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';

import { SelectedFields } from '@products/domain/types';
import { ProductEntity } from '@products/domain/entities';
import { Pagination } from "@common/domain/types";
import { Repository } from '@common/domain/entities';
import { Cached } from '@common/application/decorators';

@Injectable()
export class ProductService {

    constructor(
        @Cached() private readonly cache: Cache,
        private readonly productRepository: Repository<ProductEntity>
    ) { }

    public async findAll(shopId: string, page: Pagination, query?: string, selected?: string): Promise<Partial<ProductEntity>[]> {
        const { take, skip } = page;
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: true,
            name: !!selected.includes('name'),
            price: !!selected.includes('price')
        } : null;
        await Promise.all([
            await this.cache.set('products-pagination', page),
            await this.cache.set('products-fields', fields)
        ]);
        const cachedPagination: Pagination = await this.cache.get('products-pagination');
        const cachedFields = await this.cache.get('products-fields');
        const cachedProducts: Partial<ProductEntity>[] = await this.cache.get('products');

        if (cachedProducts && cachedFields == fields && cachedPagination == page) return cachedProducts;

        const products = await this.productRepository.findAll(shopId, { take, skip }, fields, query);
        await this.cache.set('products', products);

        return products;
    }

    public async findOne(id: string, selected?: string): Promise<Partial<ProductEntity>> {
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

        await this.cache.set('product', product);

        return product;
    }

    public async createMany(products: Partial<ProductEntity>[]): Promise<number> {
        const res = await this.productRepository.createMany(products);

        return res['count'];
    }

    public async create(product: Partial<ProductEntity>): Promise<ProductEntity> {
        const res = await this.productRepository.create(product);

        return res;
    }

    public async update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity> {
        const originalProduct: Partial<ProductEntity> = await this.findOne(id);
        
        if (!originalProduct) return null;
        
        return this.productRepository.update(id, product);
    }

    public async delete(id: string): Promise<ProductEntity> {
        const product: Partial<ProductEntity> = await this.findOne(id);
        
        if (!product) return null;

        await Promise.all([
            await this.cache.del('product-fields'),
            await this.cache.del('product')
        ]);
        
        return this.productRepository.delete(id);
    }
}
