import { Injectable } from '@nestjs/common';

import { InventoryRepository } from '../repositories/inventory.repository';
import { Pagination } from '../../../common/domain/types';
import { SelectedFields } from '../../domain/types';
import { InventoryEntity } from '../../domain/entities/inventory.entity';

@Injectable()
export class InventoryService {

    constructor(private repository: InventoryRepository) { }

    public async findAllInventories(customerId: string, page: string, selected?: string, query?: string): Promise<Partial<InventoryEntity>[]> {
        const pagination: Pagination = {
            skip: +page.split(',')[0],
            take: +page.split(',')[1]
        };
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: selected.includes('user_id') ? true : false,
            cost: selected.includes('cost') ? true : false,
            subtotal: selected.includes('subtotal') ? true : false,
            total: selected.includes('total') ? true : false,
            created_at: selected.includes('created_at') ? true : false
        } : null;

        return this.repository.findAll(customerId, pagination, fields, query);
    }

    public async findOneInventory(id: string, selected?: string): Promise<Partial<InventoryEntity>> {
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: selected.includes('user_id') ? true : false,
            cost: selected.includes('cost') ? true : false,
            subtotal: selected.includes('subtotal') ? true : false,
            total: selected.includes('total') ? true : false,
            created_at: selected.includes('created_at') ? true : false
        } : null;

        const inventory: Partial<InventoryEntity> = await this.repository.findOne(id, fields);

        if (!inventory) return undefined;

        return inventory;
    }

    public async createInventory(inventory: Partial<InventoryEntity>): Promise<InventoryEntity> {
        return this.repository.create(inventory);
    }

    public async updateInventory(id: string, inventory: Partial<InventoryEntity>): Promise<InventoryEntity> {
        const isExist: boolean = await this.findOneInventory(id) ? true : false;

        if (!isExist) return null;
        
        return this.repository.update(id, inventory);
    }

    public async deleteInventory(id: string): Promise<InventoryEntity> {
        const isExist: boolean = await this.findOneInventory(id) ? true : false;

        if (!isExist) return null;
        
        return this.repository.delete(id);
    }
}
