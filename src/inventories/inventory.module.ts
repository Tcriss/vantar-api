import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { InventoryEntity } from '@inventories/domain/entities';
import { InventoryService } from '@inventories/application/services';
import { InventoryRepository } from '@inventories/infrastructure/repositories';
import { InventoryController } from '@inventories/infrastructure/controllers';
import { ProductModule } from '@products/product.module';
import { Repository } from '@common/domain/entities';
import { DatabaseModule } from '@database/database.module';

@Module({
    providers: [
        {
            provide: Repository<InventoryEntity>,
            useClass: InventoryRepository
        },
        InventoryService
    ],
    controllers: [InventoryController],
    imports: [
        ProductModule.forFeatureAsync({
            imports: [
                DatabaseModule.forFeatureAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (config: ConfigService) => ({
                        mongoUri: config.get('MONGO_URI'),
                        databaseName: config.get('MONGO_DB_NAME'),
                        collectionName: 'inventory-product-list'
                    })
                })
            ]
        })
    ]
})
export class InventoryModule {}
