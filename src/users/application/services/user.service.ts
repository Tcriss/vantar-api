import { Injectable } from '@nestjs/common';

import { UserRepositoryI } from '../../../users/domain/interfaces';
import { BcryptProvider } from '../../../common/application/providers/bcrypt.provider';
import { UserEntity } from '../../domain/entities/user.entity';
import { Pagination } from '../../../common/domain/types';
import { Repository } from '../decorators/repository.decorator';
import { Roles } from '../../../common/domain/enums';

@Injectable()
export class UserService {

    constructor(
        @Repository() private repository: UserRepositoryI,
        private bcrypt: BcryptProvider
    ) {}

    public async findAllUsers(page: string, query?: string): Promise<UserEntity[]> {
        const pagination: Pagination = {
            skip: +page.split(',')[0],
            take: +page.split(',')[1]
        };
        
        return this.repository.findAllUsers(pagination, query);
    }

    public async findOneUser(id?: string, email?: string): Promise<UserEntity> {
        if (!id && !email) return null;

        const user: UserEntity = await this.repository.findOneUser({ id, email });

        if (!user) return undefined;

        return user;
    }

    public async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
        user.password = await this.bcrypt.hash(user.password);

        return this.repository.createUser(user);;
    }

    public async updateUser(id: string, user: Partial<UserEntity>, role: Roles): Promise<UserEntity> {
        const isExist: boolean = await this.findOneUser(id) ? true : false;

        if (!isExist) return null;
        if (user.password) {
            if (role === Roles.CUSTOMER) {
                const originalUser: UserEntity = await this.findOneUser(id);
                const match: boolean = await this.bcrypt.compare(user.password, originalUser.password);

                if (!match) return null;
            };

            user.password = await this.bcrypt.hash(user.password);
        };

        const res: UserEntity = await this.repository.updateUser(id, user);

        return res ?? undefined;
    }

    public async deleteUser(id: string): Promise<string> {
        const res: UserEntity = await this.repository.deleteUser(id);

        return res ? 'User deleted' : undefined;
    }
}
