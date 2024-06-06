import { Injectable } from '@nestjs/common';

import { PrismaProvider } from '../../../prisma/providers/prisma.provider';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { Pagination, SelectedFields } from '../../domain/types';

@Injectable()
export class CustomerRepository {

    constructor(private prisma: PrismaProvider) {}

    public async findAll(ownerId: string, page: Pagination, query?: string, fields?: SelectedFields): Promise<CustomerEntity[]> {
        return this.prisma.customer.findMany({
            skip: page.skip,
            take: page.take,
            where: { user_id: ownerId, name: { contains: query } },
            orderBy: { name: 'desc' },
            select: fields
        });
    }

    public async findOne(id: string, fields?: SelectedFields): Promise<CustomerEntity> {
        return this.prisma.customer.findUnique({
            where: { id: id }, 
            select: fields
        });
    }

    public async create(customer: CustomerEntity): Promise<CustomerEntity> {
        return this.prisma.customer.create({
            data: customer,
            include: { inventories: false, user: false }
        });
    }

    public async update(id: string, customer: Partial<CustomerEntity>): Promise<Partial<CustomerEntity>> {
        return this.prisma.customer.update({
            data: customer,
            where: { id: id },
            select: { companies: true, contact: true, active: true, name: true },
        });
    }

    public async delete(id: string): Promise<CustomerEntity> {
        return this.prisma.customer.delete({ where: { id: id }});
    }
}
