import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './application/services/auth.service';
import { UserModule } from '../users/user.module';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { jwtFactory } from './application/config/jwt.factory';
import { AccessTokenStrategy } from './application/strategies/access-token/access-token.strategy';
import { GoogleAuthStrategy } from './application/strategies/google/google.strategy';
import { RefreshTokenStrategy } from './application/strategies/refresh-token/refresh-token.strategy';

@Module({
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    //GoogleAuthStrategy,
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtFactory
    }),
    UserModule
  ]
})
export class AuthModule {}
