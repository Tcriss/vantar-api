import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './application/services/auth.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { jwtFactory } from './application/config/jwt.factory';
import { GoogleAuthStrategy } from './application/strategies/google.strategy';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../users/user.module';

@Module({
  providers: [
    AuthService,
    //GoogleAuthStrategy,
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtFactory
    }),
    CommonModule,
    UserModule
  ]
})
export class AuthModule {}
