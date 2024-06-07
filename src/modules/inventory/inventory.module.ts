import { Module } from '@nestjs/common';

import { InventoryService } from './application/services/inventory.service';
import { InventoryRepository } from './application/repositories/inventory.repository';
import { InventoryController } from './infrastructure/controllers/inventory.controller';

@Module({
    providers: [InventoryService, InventoryRepository],
    controllers: [InventoryController]
})
export class InventoryModule {}
