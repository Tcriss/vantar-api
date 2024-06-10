import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './users/user.module';
import { CategoryModule } from './categories/category.module';
import { CustomerModule } from './customers/customer.module';
import { CorrelationIdMiddleware } from './common/middlewares/correlation-id/correlation-id.middleware';
import { loggerFactory } from './common/config/logger.factory';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { ProductModule } from './products/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: loggerFactory
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CustomerModule,
    CategoryModule,
    InventoryModule,
    ProductModule
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
