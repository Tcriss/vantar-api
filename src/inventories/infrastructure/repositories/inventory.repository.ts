import { Injectable } from '@nestjs/common';

import { Pagination } from '../../../common/domain/types';
import { SelectedFields } from '../../domain/types';
import { PrismaProvider } from '../../../prisma/infrastructure/providers/prisma.provider';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { InventoryRepositoryI } from '../../domain/interfaces/inventory-repository.interface';

@Injectable()
export class InventoryRepository implements InventoryRepositoryI {

    constructor(private prisma: PrismaProvider) { }

    public async findAllInventories(customerId: string, page: Pagination, fields?: SelectedFields): Promise<Partial<InventoryEntity>[]> {
        return this.prisma.inventory.findMany({
            orderBy: { created_at: 'asc' },
            where: { user_id: customerId },
            select: fields,
            skip: page.skip,
            take: page.take
        });
    }

    public async findOneInventory(id: string, fields?: SelectedFields): Promise<Partial<InventoryEntity>> {
        return this.prisma.inventory.findUnique({
            where: { id: id },
            select: fields
        });
    }

    public async createInventory(newInventory: Partial<InventoryEntity>): Promise<InventoryEntity> {
        return this.prisma.inventory.create({
            data: {
                user_id: newInventory.user_id,
                cost: newInventory.cost,
                total: newInventory.total,
                subtotal: newInventory.subtotal,
            }
        })
    }

    public async updateInventory(id: string, inventory: Partial<InventoryEntity>): Promise<InventoryEntity> {
        return this.prisma.inventory.update({ 
            where: { id: id },
            data: inventory
        });
    }

    public async deleteInventory(id: string): Promise<InventoryEntity>  {
        return this.prisma.inventory.delete({ where: { id: id }})
    }
}
