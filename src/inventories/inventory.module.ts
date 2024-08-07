import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { InventoryService } from './application/services/inventory.service';
import { InventoryRepository } from './infrastructure/repositories/inventory.repository';
import { InventoryController } from './infrastructure/controllers/inventory.controller';
import { ProductModule } from '../products/product.module';
import { InventoryEntity } from './domain/entities/inventory.entity';
import { Repository } from '../common/domain/entities';
import { DatabaseModule } from '../database/database.module';

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
