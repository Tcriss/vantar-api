import { Module } from '@nestjs/common';

import { InventoryService } from './application/services/inventory.service';
import { InventoryRepository } from './infrastructure/repositories/inventory.repository';
import { InventoryController } from './infrastructure/controllers/inventory.controller';
import { InventoryRepositoryToken } from './application/decorators';
import { ProductModule } from '../products/product.module';

@Module({
    providers: [
        {
            provide: InventoryRepositoryToken,
            useClass: InventoryRepository
        },
        InventoryService
    ],
    controllers: [InventoryController],
    imports: [ProductModule]
})
export class InventoryModule {}
