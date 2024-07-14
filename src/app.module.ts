import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
        authUrl: config.get('AUTH_URL'),
        resetPasswordUrl: config.get('RESET_URL'),
        host: config.get('HOST')
        //deafultSenderEmail: config.get('DEFAULT_EMAIL')
      })
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public'), }),
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
