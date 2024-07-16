import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserService } from './application/services/user.service';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserEntity } from './domain/entities/user.entity';
import { CommonModule } from '../common/common.module';
import { Repository } from '../common/domain/entities';

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
        CommonModule, 
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get('ACTIVATION_SECRET')
            })
        })
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