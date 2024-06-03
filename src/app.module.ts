import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { CategoryModule } from './modules/categories/category.module';
import { CorrelationIdMiddleware } from './middlewares/correlation-id/correlation-id.middleware';
import { loggerFactory } from './dynamic-modules-config/logger.factory';
import { AuthModule } from './modules/auth/auth.module';

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
    CategoryModule
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware)
  }
}
