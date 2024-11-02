import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './application/services/auth.service';
import { AuthController } from './infrastructure/auth.controller';
import { GoogleAuthStrategy } from './application/strategies/google.strategy';
import { UserModule } from '../users/user.module';
import { AccessTokenGuard } from './application/guards/access-token/access-token.guard';
import { CommonModule } from 'src/common/common.module';

@Module({
  providers: [
    AuthService,
    //GoogleAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.register({}),
    CommonModule.registerAsync({
      imports: [ConfigModule],
      Inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        saltRounds: +config.get('HASH')
      })
    }),
    UserModule.forFeature()
  ]
})
export class AuthModule {}
