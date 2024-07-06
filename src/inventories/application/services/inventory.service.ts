import { Injectable } from '@nestjs/common';

import { Pagination } from '../../../common/domain/types';
import { SelectedFields } from '../../domain/types';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { InventoryRepository } from '../decorators';
import { Repository } from '../../../common/domain/entities';
import { ProductListRepository } from '../../../products/application/decotators';
import { InventoryProductList } from '../../../inventories/domain/types/inventory-prodcut-list.type';
import { productListCreation } from '../../../common/application/utils';

@Injectable()
export class InventoryService {

    constructor(
        @InventoryRepository() private repository: Repository<InventoryEntity>,
        @ProductListRepository() private productListRepository: Repository<InventoryProductList>
    ) {
        this.productListRepository.setCollection('inventory-product-list');
    }

    public async findAllInventories(userId: string, page: string, selected?: string): Promise<Partial<InventoryEntity>[]> {
        const pagination: Pagination = {
            skip: +page.split(',')[0],
            take: +page.split(',')[1]
        };
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: true,
            cost: selected.includes('cost'),
            subtotal: selected.includes('subtotal'),
            total: selected.includes('total'),
            created_at: selected.includes('created_at')
        } : null;

        return this.repository.findAll(userId, pagination, fields);
    }

    public async findOneInventory(id: string, userId?: string, selected?: string): Promise<Partial<InventoryEntity>> {
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: true,
            cost: selected.includes('cost') ? true : false,
            subtotal: selected.includes('subtotal') ? true : false,
            total: selected.includes('total') ? true : false,
            created_at: selected.includes('created_at') ? true : false
        } : null;
        const inventory: Partial<InventoryEntity> = await this.repository.findOne(id, fields);

        if (!inventory) return null;
        if (userId && inventory.user_id !== userId) return undefined;

        const inventoryProductist = await this.productListRepository.findOne(inventory.id);
        inventory.products = inventoryProductist.products || [];

        return inventory;
    }

    public async createInventory(inventory: Partial<InventoryEntity>): Promise<InventoryEntity> {
        const { list, subtotal } = productListCreation(inventory.products, 0);

        inventory.subtotal = subtotal;
        inventory.total = inventory.subtotal + inventory.cost;

        const newInventory  = await this.repository.create(inventory);

        if (!newInventory) return null;

        const productsResult = await this.productListRepository.insert({
            id: newInventory.id,
            products: list
        });

        if (!productsResult) {
            await this.deleteInventory(newInventory.id, newInventory.user_id);

            return undefined;
        };

        newInventory.products = list;

        return newInventory;
    }

    public async updateInventory(id: string, inventory: Partial<InventoryEntity>, userId: string): Promise<InventoryEntity> {
        const resource: Partial<InventoryEntity> = await this.findOneInventory(id);
        const resourceList: Partial<InventoryProductList> = await this.productListRepository.findOne(id);

        if (!resource || !resourceList) return null;
        if (resource.user_id !== userId) return undefined;
        if (!inventory.products) {
            const updatedInventory = await this.repository.update(id, {
                cost: inventory.cost,
                total: inventory.cost + resource.subtotal
            });
            updatedInventory.products = resourceList.products;

            return updatedInventory;
        };

        const { list, subtotal } = productListCreation(inventory.products, 0);
            
        inventory.subtotal = subtotal;
        inventory.total = inventory.subtotal + inventory.cost;

        const [ updatedProductList, updatedInventory ] = await Promise.all([
            await this.productListRepository.updateDoc(id, { products: list, id: id }),
            await this.repository.update(id, {
                cost: inventory.cost,
                subtotal: inventory.subtotal,
                total: inventory.total
            })
        ]);

        if (!updatedInventory || !updatedProductList) return null;

        updatedInventory.products = list;
        return updatedInventory;
    }

    public async deleteInventory(id: string, userId: string): Promise<InventoryEntity> {
        const resource: Partial<InventoryEntity> = await this.findOneInventory(id);

        if (!resource) return null;
        if (resource.user_id !== userId) return undefined;

        const res = await this.productListRepository.deleteDoc(id);

        if (!res) return null;
        
        return this.repository.delete(id);
    }
}
