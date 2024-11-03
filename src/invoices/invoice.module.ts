import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { InvoiceEntity } from "@invoices/domain/entities";
import { InvoiceService } from '@invoices/application/services';
import { InvoiceRepository } from "@invoices/infrastructure/repositories";
import { InvoiceController } from "@invoices/infrastructure/controllers";
import { Repository } from "@common/domain/entities";
import { ProductModule } from "@products/product.module";
import { DatabaseModule } from "@database/database.module";

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