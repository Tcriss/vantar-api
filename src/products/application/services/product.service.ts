import { Injectable } from '@nestjs/common';

import { ProductRepository } from '../repositories/product.repository';
import { SelectedFields } from '../../domain/types';
import { Pagination } from "../../../common/domain/types/pagination.type";
import { SearchTerms } from '../../domain/types/search-terms.type';
import { ProductEntity } from '../../domain/entities/product.entity';

@Injectable()
export class ProductService {

    constructor(private repository: ProductRepository) { }

    public async findAllProducts(page: string, inventoryId?: string, query?: SearchTerms, selected?: string): Promise<Partial<ProductEntity>[]> {
        const pagination: Pagination = {
            skip: +page.split(',')[0],
            take: +page.split(',')[1]
        };
        const fields: SelectedFields = selected ? {
            id: true,
            inventory_id: selected.includes('inventory_id') ? true : false,
            name: selected.includes('name') ? true : false,
            stock: selected.includes('stock') ? true : false,
            price: selected.includes('price') ? true : false,
            unit_measure: selected.includes('unit_measure') ? true : false,
            category_name: selected.includes('category_name') ? true : false,
            created_at: selected.includes('created_at') ? true : false,
            expiration: selected.includes('expiration') ? true : false,
        } : null;

        return this.repository.findAllProducts(pagination, inventoryId, fields, query);
    }

    public async findOneProduct(id: string, selected?: string): Promise<Partial<ProductEntity>> {
        const fields: SelectedFields = selected ? {
            id: true,
            inventory_id: selected.includes('inventory_id') ? true : false,
            name: selected.includes('name') ? true : false,
            stock: selected.includes('stock') ? true : false,
            price: selected.includes('price') ? true : false,
            unit_measure: selected.includes('unit_measure') ? true : false,
            category_name: selected.includes('category_name') ? true : false,
            created_at: selected.includes('created_at') ? true : false,
            expiration: selected.includes('expiration') ? true : false,
        } : null;

        const product: Partial<ProductEntity> = await this.repository.findOneProduct(id, fields);

        if (!product) return undefined;

        return product;
    }

    public async createProduct(product: Partial<ProductEntity>): Promise<ProductEntity> {
        return this.repository.createProduct(product);
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
