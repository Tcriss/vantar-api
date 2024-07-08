import { Module } from '@nestjs/common';

import { InventoryService } from './application/services/inventory.service';
import { InventoryRepository } from './infrastructure/repositories/inventory.repository';
import { InventoryController } from './infrastructure/controllers/inventory.controller';
import { ProductModule } from '../products/product.module';
import { InventoryEntity } from './domain/entities/inventory.entity';
import { Repository } from '../common/domain/entities';

@Module({
    providers: [
        {
            provide: Repository<InventoryEntity>,
            useClass: InventoryRepository
        },
        InventoryService
    ],
    controllers: [InventoryController],
    imports: [ProductModule]
})
export class InventoryModule {}
