import { Injectable } from '@nestjs/common';

import { Pagination } from '../../../common/domain/types';
import { SelectedFields } from '../../domain/types';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { InventoryRepositoryI } from 'src/inventory/domain/interfaces/inventory-repository.interface';
import { Repository } from '../decorators/repository.decorator';

@Injectable()
export class InventoryService {

    constructor(@Repository() private repository: InventoryRepositoryI) { }

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

        return this.repository.findAllInventories(customerId, pagination, fields, query);
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

        const inventory: Partial<InventoryEntity> = await this.repository.findOneInventory(id, fields);

        if (!inventory) return undefined;

        return inventory;
    }

    public async createInventory(inventory: Partial<InventoryEntity>): Promise<InventoryEntity> {
        return this.repository.createInventory(inventory);
    }

    public async updateInventory(id: string, inventory: Partial<InventoryEntity>): Promise<InventoryEntity> {
        const isExist: boolean = await this.findOneInventory(id) ? true : false;

        if (!isExist) return null;
        
        return this.repository.updateInventory(id, inventory);
    }

    public async deleteInventory(id: string): Promise<InventoryEntity> {
        const isExist: boolean = await this.findOneInventory(id) ? true : false;

        if (!isExist) return null;
        
        return this.repository.deleteInventory(id);
    }
}
