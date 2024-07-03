import { Module } from "@nestjs/common";

import { InvoiceRepositoryToken } from "./domain/interfaces";
import { InvoiceRepository } from "./infrastructure/repositories/invoice.repository";
import { InvoiceService } from './application/services/invoice.service';
import { InvoiceController } from "./infrastructure/controllers/invoice.controller";
import { ProductListRepositoryToken } from "./application/decorators/product-list-repository.decorator";
import { ProductListRepository } from "../products/infrastructure/repositories/product-list/product-list.repositroy";

@Module({
    providers: [
        {
            provide: InvoiceRepositoryToken,
            useClass: InvoiceRepository
        },
        {
            provide: ProductListRepositoryToken,
            useClass: ProductListRepository
        },
        InvoiceService
    ],
    controllers: [InvoiceController]
})
export class InvoiceModule {}