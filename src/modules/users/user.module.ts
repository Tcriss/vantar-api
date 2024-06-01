import { Module } from '@nestjs/common';

import { UserRepository } from './application/repository/user.repository';
import { UserService } from './application/services/user.service';
import { UserController } from './infrastructure/controllers/user.controller';

@Module({
    providers: [UserRepository, UserService],
    controllers: [UserController]
})
export class UserModule { }