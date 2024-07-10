import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './users/user.module';
import { CorrelationIdMiddleware } from './common/application/middlewares/correlation-id/correlation-id.middleware';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventories/inventory.module';
import { ProductModule } from './products/product.module';
import { InvoiceModule } from './invoices/invoice.module';
import { LoggerMiddleware } from './common/application/middlewares/logger/logger.middleware';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        apiKey: config.get('EMAIL_KEY'),
        activatationUrl: config.get('ACTIVATION_URL'),
        resetPasswordUrl: config.get('RESET_URL'),
        //deafultSenderEmail: config.get('DEFAULT_EMAIL')
      })
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    InventoryModule,
    ProductModule,
    InvoiceModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
