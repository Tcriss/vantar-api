import { Module } from "@nestjs/common";

import { InvoiceRepositoryToken } from "./domain/interfaces";
import { InvoiceRepository } from "./infrastrcuture/repositories/invoice.repository";
import { InvoiceService } from './application/services/invoice.service';

@Module({
    providers: [
        {
            provide: InvoiceRepositoryToken,
            useClass: InvoiceRepository
        },
        InvoiceService
    ],
    controllers: []
})
export class InvoiceModule {}