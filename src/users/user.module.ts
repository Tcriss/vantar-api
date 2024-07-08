import { Module } from '@nestjs/common';

import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserService } from './application/services/user.service';
import { UserController } from './infrastructure/controllers/user.controller';
import { CommonModule } from '../common/common.module';
import { Repository } from 'src/common/domain/entities';
import { UserEntity } from './domain/entities/user.entity';

@Module({
    providers: [
        {
            provide: Repository<UserEntity>,
            useClass: UserRepository
        },
        UserService
    ],
    controllers: [UserController],
    imports: [CommonModule],
    exports: [Repository<UserEntity>]
})
export class UserModule { }