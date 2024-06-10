import { Injectable } from '@nestjs/common';

import { InventoryRepository } from '../repositories/inventory.repository';
import { Pagination } from '../../../common/types';
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
            customer_id: true,
            products_amount: selected.includes('products_amount') ? true : false,
            capital: selected.includes('capital') ? true : false,
            company_name: selected.includes('company_name') ? true : false,
            created_at: selected.includes('created_at') ? true : false,
            service_charge: selected.includes('service_charge') ? true : false,
        } : null;

        return this.repository.findAll(customerId, pagination, fields, query);
    }

    public async findOneInventory(id: string, selected?: string): Promise<Partial<InventoryEntity>> {
        const fields: SelectedFields = selected ? {
            id: true,
            customer_id: true,
            products_amount: selected.includes('products_amount') ? true : false,
            capital: selected.includes('capital') ? true : false,
            company_name: selected.includes('company_name') ? true : false,
            created_at: selected.includes('created_at') ? true : false,
            service_charge: selected.includes('service_charge') ? true : false,
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
