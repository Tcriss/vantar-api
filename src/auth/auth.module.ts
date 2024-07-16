import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './application/services/auth.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
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
    JwtModule.register({}),
    UserModule.forFeature(),
    CommonModule
  ]
})
export class AuthModule {}
