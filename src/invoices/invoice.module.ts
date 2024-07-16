import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { InvoiceRepository } from "./infrastructure/repositories/invoice.repository";
import { InvoiceService } from './application/services/invoice.service';
import { InvoiceController } from "./infrastructure/controllers/invoice.controller";
import { ProductModule } from "../products/product.module";
import { Repository } from "../common/domain/entities";
import { InvoiceEntity } from "./domain/entities/invoice.entity";
import { DatabaseModule } from "../database/database.module";

@Module({
    providers: [
        {
            provide: Repository<InvoiceEntity>,
            useClass: InvoiceRepository
        },
        InvoiceService
    ],
    controllers: [InvoiceController],
    imports: [
        ProductModule.forFeatureAsync({
            imports: [
                DatabaseModule.forFeatureAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (config: ConfigService) => ({
                        mongoUri: config.get('MONGO_URI'),
                        databaseName: config.get('MONGO_DB_NAME'),
                        collectionName: 'product-history'
                    })
                })
            ]
        })
    ]
})
export class InvoiceModule {}