import { Module } from "@nestjs/common";

import { CustomerService } from "./application/services/customer.service";
import { CustomerRepository } from "./application/repositories/customer.repository";
import { CustomerController } from "./infrastructure/controllers/customer.controller";

@Module({
    providers: [CustomerService, CustomerRepository],
    controllers: [CustomerController]
})
export class CustomerModule { }