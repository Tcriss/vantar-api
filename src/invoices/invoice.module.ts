import { Module } from "@nestjs/common";

import { InvoiceRepository } from "./infrastructure/repositories/invoice.repository";
import { InvoiceService } from './application/services/invoice.service';
import { InvoiceController } from "./infrastructure/controllers/invoice.controller";
import { ProductModule } from "../products/product.module";
import { Repository } from "../common/domain/entities";
import { InvoiceEntity } from "./domain/entities/invoice.entity";

@Module({
    providers: [
        {
            provide: Repository<InvoiceEntity>,
            useClass: InvoiceRepository
        },
        InvoiceService
    ],
    controllers: [InvoiceController],
    imports: [ProductModule]
})
export class InvoiceModule {}