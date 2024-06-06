import { CustomerEntity } from "../entities/customer.entity";

export type CustomerResponse = {
    message: string,
    data?: Partial<CustomerEntity>
};