import { Module } from '@nestjs/common';

import { InventoryService } from './application/services/inventory.service';
import { InventoryRepository } from './infrastructure/repositories/inventory.repository';
import { InventoryController } from './infrastructure/controllers/inventory.controller';
import { InventoryRepositoryToken } from './domain/interfaces/inventory-repository.interface';

@Module({
    providers: [
        {
            provide: InventoryRepositoryToken,
            useClass: InventoryRepository
        },
        InventoryService
    ],
    controllers: [InventoryController]
})
export class InventoryModule {}