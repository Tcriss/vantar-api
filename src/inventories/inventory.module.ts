import { Module } from '@nestjs/common';

import { InventoryService } from './application/services/inventory.service';
import { InventoryRepository } from './infrastructure/repositories/inventory.repository';
import { InventoryController } from './infrastructure/controllers/inventory.controller';
import { InventoryRepositoryToken } from './application/decorators';
import { ProductListRepositoryToken } from '../products/application/decotators';
import { ProductListRepository } from '../products/infrastructure/repositories/product-list/product-list.repositroy';

@Module({
    providers: [
        {
            provide: InventoryRepositoryToken,
            useClass: InventoryRepository
        },
        {
            provide: ProductListRepositoryToken,
            useClass: ProductListRepository
        },
        InventoryService
    ],
    controllers: [InventoryController]
})
export class InventoryModule {}
