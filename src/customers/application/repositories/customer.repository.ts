import { Injectable } from '@nestjs/common';

import { PrismaProvider } from '../../../prisma/providers/prisma.provider';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { SelectedFields } from '../../domain/types';
import { Pagination } from '../../../common/types/pagination.type';

@Injectable()
export class CustomerRepository {

    constructor(private prisma: PrismaProvider) {}

    public async findAll(ownerId: string, page: Pagination, query?: string, fields?: SelectedFields): Promise<Partial<CustomerEntity>[]> {
        return this.prisma.customer.findMany({
            skip: page.skip,
            take: page.take,
            where: { user_id: ownerId, name: { contains: query } },
            orderBy: { name: 'desc' },
            select: fields
        });
    }

    public async findOne(id: string, fields?: SelectedFields): Promise<Partial<CustomerEntity>> {
        return this.prisma.customer.findUnique({
            where: { id: id }, 
            select: fields
        });
    }

    public async create(customer: Partial<CustomerEntity>): Promise<CustomerEntity> {
        return this.prisma.customer.create({
            data: {
                name: customer.name,
                contact: customer.contact,
                companies: customer.companies,
                user_id: customer.user_id
            }
        });
    }

    public async update(id: string, customer: Partial<CustomerEntity>): Promise<Partial<CustomerEntity>> {
        return this.prisma.customer.update({
            data: customer,
            where: { id: id }
        });
    }

    public async delete(id: string): Promise<CustomerEntity> {
        return this.prisma.customer.delete({ where: { id: id }});
    }
}
