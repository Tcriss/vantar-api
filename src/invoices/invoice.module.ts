import { Module } from "@nestjs/common";

import { InvoiceRepositoryToken } from "./domain/interfaces";
import { InvoiceRepository } from "./infrastructure/repositories/invoice.repository";
import { InvoiceService } from './application/services/invoice.service';
import { InvoiceController } from "./infrastructure/controllers/invoice.controller";
import { ProductModule } from "../products/product.module";

@Module({
    providers: [
        {
            provide: InvoiceRepositoryToken,
            useClass: InvoiceRepository
        },
        InvoiceService
    ],
    controllers: [InvoiceController],
    imports: [ProductModule]
})
export class InvoiceModule {}