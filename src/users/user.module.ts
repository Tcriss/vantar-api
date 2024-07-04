import { Module } from '@nestjs/common';

import { UserRepositoryToken } from './application/decorators/repository.decorator';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserService } from './application/services/user.service';
import { UserController } from './infrastructure/controllers/user.controller';
import { CommonModule } from '../common/common.module';

@Module({
    providers: [
        {
            provide: UserRepositoryToken,
            useClass: UserRepository
        },
        UserService
    ],
    controllers: [UserController],
    imports: [CommonModule]
})
export class UserModule { }