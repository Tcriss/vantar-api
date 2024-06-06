import { CustomerEntity } from "../entities/customer.entity";

export type Response = {
    message: string,
    data: Partial<CustomerEntity>
};