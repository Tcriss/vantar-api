import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { AuthService } from './application/services/auth.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { GoogleAuthStrategy } from './application/strategies/google.strategy';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../users/user.module';
import { AccessTokenGuard } from './application/guards/access-token/access-token.guard';

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
    UserModule.forFeature(),
    CommonModule
  ]
})
export class AuthModule {}
