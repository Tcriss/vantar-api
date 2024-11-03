import { Module } from "@nestjs/common";

import { ShopEntity } from "@shops/domain/entities";
import { ShopService } from '@shops/application/services';
import { ShopRepository } from '@shops/infrastructure/repositories';
import { ShopController } from '@shops/infrastructure/controllers';
import { Repository } from "@common/domain/entities";
import { DatabaseModule } from "@database/database.module";

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
