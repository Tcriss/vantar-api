import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './application/services/auth.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { GoogleAuthStrategy } from './application/strategies/google.strategy';
import { UserModule } from '../users/user.module';
import { AccessTokenGuard } from './application/guards/access-token/access-token.guard';
import { SecurityModule } from 'src/security/security.module';

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
    SecurityModule.registerAsync({
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
