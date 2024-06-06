import { Injectable } from '@nestjs/common';

import { CustomerRepository } from '../repositories/customer.repository';
import { Pagination, SelectedFields } from '../../domain/types';
import { CustomerEntity } from '../../domain/entities/customer.entity';

@Injectable()
export class CustomerService {

    constructor(private repository: CustomerRepository) {}

    public async findAllCustomers(ownerId: string, page: Pagination, query?: string, fields?: SelectedFields): Promise<CustomerEntity[]> {
        return this.repository.findAll(ownerId, page, query, fields);
    }

    public async findOneCustomer(id: string, fields?: SelectedFields): Promise<CustomerEntity> {
        const customer: CustomerEntity = await this.repository.findOne(id, fields);

        if (!customer) return undefined;

        return customer;
    }

    public async createCustomer(customer: CustomerEntity): Promise<CustomerEntity> {
        customer.name = customer.name.charAt(0).toUpperCase() + customer.name.slice(1);
        const res: CustomerEntity = await this.repository.create(customer);

        return res;
    }

    public async updateCustomer(id: string, customer: Partial<CustomerEntity>): Promise<Partial<CustomerEntity>> {
        customer.name = customer.name.charAt(0).toUpperCase() + customer.name.slice(1);
        const res: Partial<CustomerEntity> = await this.repository.update(id, customer);

        return res;
    }

    public async deleteCustomer(id: string): Promise<unknown> {
        if (!id) return null;

        const res: CustomerEntity = await this.repository.delete(id);

        return res;
    }
}
