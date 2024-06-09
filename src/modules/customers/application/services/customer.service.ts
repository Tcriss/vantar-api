import { Injectable } from '@nestjs/common';

import { CustomerRepository } from '../repositories/customer.repository';
import { Pagination, SelectedFields } from '../../domain/types';
import { CustomerEntity } from '../../domain/entities/customer.entity';

@Injectable()
export class CustomerService {

    constructor(private repository: CustomerRepository) {}

    public async findAllCustomers(ownerId: string, page: string, query?: string, selected?: string): Promise<Partial<CustomerEntity>[]> {
        const pagination: Pagination = {
            skip: +page.split(',')[0],
            take: +page.split(',')[1]
        };
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: selected.includes('userId') ? true : false,
            active: selected.includes('active') ? true : false,
            name: selected.includes('name') ? true : false,
            companies: selected.includes('companies') ? true : false,
            contact: selected.includes('contact') ? true : false,
            created_at: selected.includes('created') ? true : false,
        } : null;

        return this.repository.findAll(ownerId, pagination, query, fields);
    }

    public async findOneCustomer(id: string, selected?: string): Promise<Partial<CustomerEntity>> {
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: selected.includes('userId') ? true : false,
            active: selected.includes('active') ? true : false,
            name: selected.includes('name') ? true : false,
            companies: selected.includes('companies') ? true : false,
            contact: selected.includes('contact') ? true : false,
            created_at: selected.includes('created') ? true : false,
        } : null;
        const customer: Partial<CustomerEntity> = await this.repository.findOne(id, fields);

        if (!customer) return undefined;

        return customer;
    }

    public async createCustomer(ownerId, customer: Partial<CustomerEntity>): Promise<CustomerEntity> {
        customer.user_id = ownerId;
        customer.name = customer.name.charAt(0).toUpperCase() + customer.name.slice(1);
        const res: CustomerEntity = await this.repository.create(customer);

        return res;
    }

    public async updateCustomer(owner: string, id: string, customer: Partial<CustomerEntity>): Promise<Partial<CustomerEntity>> {
        const existin: Partial<CustomerEntity> = await this.findOneCustomer(id);

        if (owner !== existin.user_id) return null;
        
        customer.name = customer.name.charAt(0).toUpperCase() + customer.name.slice(1);
        const res: Partial<CustomerEntity> = await this.repository.update(id, customer);

        return res;
    }

    public async deleteCustomer(owner: string, id: string): Promise<CustomerEntity> {
        const existin: Partial<CustomerEntity> = await this.findOneCustomer(id);

        if (owner !== existin.user_id) return null;

        const res: CustomerEntity = await this.repository.delete(id);

        return res;
    }
}
