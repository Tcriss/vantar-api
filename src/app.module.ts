import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { PrismaModule } from './prisma/prisma.module';
import { MongoDbModule } from './mongo/mongo-db.module';
import { UserModule } from './users/user.module';
import { CorrelationIdMiddleware } from './common/application/middlewares/correlation-id/correlation-id.middleware';
import { loggerFactory } from './common/application/config/logger.factory';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventories/inventory.module';
import { ProductModule } from './products/product.module';
import { InvoiceModule } from './invoices/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: loggerFactory
    }),
    PrismaModule,
    MongoDbModule,
    AuthModule,
    UserModule,
    InventoryModule,
    ProductModule,
    InvoiceModule,
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
