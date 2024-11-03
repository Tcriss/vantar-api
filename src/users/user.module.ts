import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserEntity } from '@users/domain/entities';
import { UserService } from '@users/application/services';
import { UserRepository } from '@users/infrastructure/repositories';
import { UserController } from '@users/infrastructure/controllers';
import { Repository } from '@common/domain/entities';
import { CommonModule } from '@common/common.module';

@Module({
    providers: [
        {
            provide: Repository<UserEntity>,
            useClass: UserRepository
        },
        UserService
    ],
    controllers: [UserController],
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get('ACTIVATION_SECRET')
            })
        }),
        CommonModule.registerAsync({
            imports: [ConfigModule],
            Inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              saltRounds: +config.get('HASH')
            })
        }),
    ]
})
export class UserModule {
    public static forFeature(): DynamicModule {
        return {
            module: UserModule,
            providers: [
                {
                    provide: Repository<UserEntity>,
                    useClass: UserRepository
                }
            ],
            exports: [Repository<UserEntity>]
        }
    }
}