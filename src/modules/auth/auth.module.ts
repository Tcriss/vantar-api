import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './application/services/auth.service';
import { UserModule } from '../users/user.module';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { LocalStrategy } from './application/strategies/local/local.strategy';
import { jwtFactory } from '../../dynamic-modules-config/jwt.factory';

@Module({
  providers: [AuthService, LocalStrategy],
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
