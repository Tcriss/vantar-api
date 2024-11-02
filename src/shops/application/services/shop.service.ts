import { Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';

import { ShopEntity } from '../../domain/entities';
import { SelectedFields } from '../../domain/types';
import { UpdateShopDto } from '../../domain/dtos';
import { Repository } from '../../../common/domain/entities';
import { Pagination } from '../../../common/domain/types';
import { Cached } from '../../../common/application/decorators';

@Injectable()
export class ShopService {

    constructor(
        private readonly repository: Repository<ShopEntity>,
        @Cached() private readonly cache: Cache
    ) {}

    public async findAll(userId: string, page: Pagination, selected?: string): Promise<Partial<ShopEntity>[]> {
        const selectedFields: SelectedFields = selected ? {
            products: selected.includes('products'),
            invoices: selected.includes('invoices'),
            inventories: selected.includes('inventories')
        } : null;

        const cachedPagination: Pagination = await this.cache.get('shops-pagination');
        const cachedFields = await this.cache.get('shops-fields');
        const cachedShop: Partial<ShopEntity>[] = await this.cache.get('shops');

        if (cachedShop && cachedFields == selectedFields && cachedPagination == page) return cachedShop;
        
        await Promise.all([
            await this.cache.set('shops-pagination', page),
            await this.cache.set('shops-fields', selectedFields)
        ]);

        const shops: Partial<ShopEntity>[] = await this.repository.findAll(userId, page, selected);
        await this.cache.set('shops', shops);

        return shops;
    }

    public async findOne(id: string, selected?: string): Promise<Partial<ShopEntity>> {
        const cachedShop: Partial<ShopEntity> = await this.cache.get('shop');

        if (cachedShop && cachedShop.id === id) return cachedShop;

        const fields: SelectedFields = selected ? {
            products: selected.includes('products'),
            invoices: selected.includes('invoices'),
            inventories: selected.includes('inventories')
        } : null;
        const shop: Partial<ShopEntity> = await this.repository.findOne(id, fields);

        if (!shop) return null;

        await this.cache.set('shop', shop);

        return shop;
    }

    public async create(shop: Partial<ShopEntity>, userId: string): Promise<Partial<ShopEntity>> {
        shop.user_id = userId;
        const newShop: Partial<ShopEntity> = await this.repository.create(shop);

        if (!newShop) return null;

        await this.cache.reset();

        return newShop;
    }

    public async update(id: string, shop: UpdateShopDto): Promise<Partial<ShopEntity>> {
        const originalShop: Partial<ShopEntity> = await this.findOne(id);

        if (!originalShop) return null;

        const updatedShop = await this.repository.update(id, shop);

        if (!updatedShop) return null;

        await this.cache.reset();

        return updatedShop;
    }

    public async delete(id: string): Promise<Partial<ShopEntity>> {
        const shop: Partial<ShopEntity> = await this.findOne(id);

        if (!shop) return null;

        await this.cache.reset();

        return this.repository.delete(id);
    }
}
