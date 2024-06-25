import { Module } from '@nestjs/common';

import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserService } from './application/services/user.service';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserRepositoryToken } from './domain/interfaces';

@Module({
    providers: [
        {
            provide: UserRepositoryToken,
            useClass: UserRepository
        },
        UserService
    ],
    controllers: [UserController]
})
export class UserModule { }