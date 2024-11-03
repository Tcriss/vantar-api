import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { join } from 'path';

import { AuthModule } from '@auth/auth.module';
import { DatabaseModule } from '@database/database.module';
import { EmailModule } from '@email/email.module';
import { InventoryModule } from '@inventories/inventory.module';
import { InvoiceModule } from '@invoices/invoice.module';
import { ProductModule } from '@products/product.module';
import { ShopModule } from '@shops/shop.module';
import { UserModule } from '@users/user.module';
import { JwtExceptionsFilter } from '@auth/application/filters';
import { CorrelationIdMiddleware, LoggerMiddleware } from '@common/application/middlewares';
import { validationOptions, rateLimitConfig } from '@common/application/config';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: JwtExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe(validationOptions),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: (60 ^ 2) * 1000
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: rateLimitConfig
    }),
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
    AuthModule,
    UserModule,
    InventoryModule,
    ProductModule,
    InvoiceModule,
    ShopModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
