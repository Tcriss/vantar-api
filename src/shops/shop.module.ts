import { Module } from "@nestjs/common";

import { ShopEntity } from "./domain/entities";
import { ShopService } from './application/services/shop.service';
import { ShopRepository } from './infrastructure/repositories/shop.repository';
import { ShopController } from './infrastructure/controllers/shop.controller';
import { Repository } from "../common/domain/entities";
import { DatabaseModule } from "../database/database.module";

@Module({
  providers: [
    {
      provide: Repository<ShopEntity>,
      useClass: ShopRepository
    },
    ShopService
  ],
  controllers: [ShopController],
  imports: [DatabaseModule]
})
export class ShopModule {}
