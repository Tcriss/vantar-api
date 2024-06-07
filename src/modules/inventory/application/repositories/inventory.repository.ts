import { Injectable } from '@nestjs/common';

import { PrismaProvider } from '../../../prisma/providers/prisma.provider';
import { Pagination } from '../../../../common/types';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { SelectedFields } from '../../domain/types';

@Injectable()
export class InventoryRepository {

    constructor(private prisma: PrismaProvider) { }

    public async findAll(customerId: string, page: Pagination, fields?: SelectedFields, query?: string): Promise<InventoryEntity[]> {
        return this.prisma.inventory.findMany({
            orderBy: { created_at: 'asc' },
            where: {
                customer_id: customerId,
                company_name: { contains: query }
            },
            select: fields,
            skip: page.skip,
            take: page.take
        });
    }

    public async findOne(id: string, fields?: SelectedFields): Promise<Partial<InventoryEntity>> {
        return this.prisma.inventory.findUnique({
            where: { id: id },
            select: fields
        });
    }

    public async create(newInventory: Partial<InventoryEntity>): Promise<InventoryEntity> {
        return this.prisma.inventory.create({
            data: {
                company_name: newInventory.company_name,
                capital: newInventory.capital,
                customer_id: newInventory.customer_id,
                service_charge: newInventory.service_charge
            }
        })
    }

    public async update(id: string, inventory: Partial<InventoryEntity>): Promise<InventoryEntity> {
        return this.prisma.inventory.update({ 
            where: { id: id },
            data: inventory
        });
    }

    public async delete(id: string): Promise<InventoryEntity>  {
        return this.prisma.inventory.delete({ where: { id: id }})
    }
}
