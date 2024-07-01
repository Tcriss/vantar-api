import { Module } from "@nestjs/common";

import { InvoiceRepositoryToken } from "./domain/interfaces";
import { InvoiceRepository } from "./infrastrcuture/repositories/invoice.repository";

@Module({
    providers: [
        {
            provide: InvoiceRepositoryToken,
            useClass: InvoiceRepository
        }
    ],
    controllers: []
})
export class InvoiceModule {}