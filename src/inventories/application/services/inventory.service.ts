import { Injectable } from '@nestjs/common';

import { Pagination } from '../../../common/domain/types';
import { SelectedFields } from '../../domain/types';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { InventoryRepositoryI } from '../../domain/interfaces/inventory-repository.interface';
import { Repository } from '../decorators/repository.decorator';

@Injectable()
export class InventoryService {

    constructor(@Repository() private repository: InventoryRepositoryI) { }

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

        return this.repository.findAllInventories(userId, pagination, fields);
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
        const inventory: Partial<InventoryEntity> = await this.repository.findOneInventory(id, fields);

        if (!inventory) return undefined;
        if (userId && inventory.user_id !== userId) return null;

        return inventory;
    }

    public async createInventory(inventory: Partial<InventoryEntity>): Promise<InventoryEntity> {
        return this.repository.createInventory(inventory);
    }

    public async updateInventory(id: string, inventory: Partial<InventoryEntity>, userId: string): Promise<InventoryEntity> {
        const resource: Partial<InventoryEntity> = await this.findOneInventory(id);

        if (!resource) return undefined;
        if (resource.user_id !== userId) return null;
        
        return this.repository.updateInventory(id, inventory);
    }

    public async deleteInventory(id: string, userId: string): Promise<InventoryEntity> {
        const resource: Partial<InventoryEntity> = await this.findOneInventory(id);

        if (!resource) return undefined;
        if (resource.user_id !== userId) return null;
        
        return this.repository.deleteInventory(id);
    }
}
