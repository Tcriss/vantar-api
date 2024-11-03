import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from '@auth/application/services';
import { AuthController } from '@auth/infrastructure/auth.controller';
import { AccessTokenGuard } from '@auth/application/guards';
import { CommonModule } from '@common/common.module';
import { UserModule } from '@users/user.module';

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
