import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UserRepositoryI } from 'src/users/domain/interfaces';
import { UserEntity } from '../../domain/entities/user.entity';
import { Pagination } from '../../../common/domain/types';
import { Repository } from '../decorators/repository.decorator';
import { Role } from '../../../common/domain/enums';

@Injectable()
export class UserService {

    constructor(
        @Repository() private repository: UserRepositoryI,
        private config: ConfigService
    ) {}

    public async findAllUsers(page: string, query?: string): Promise<UserEntity[]> {
        const pagination: Pagination = {
            skip: +page.split(',')[0],
            take: +page.split(',')[1]
        };
        const users: UserEntity[] = await this.repository.findAllUsers(pagination, query);

        return users.map(user => (new UserEntity(user)));
    }

    public async findOneUser(id?: string, email?: string): Promise<UserEntity> {
        if (!id && !email) return null;

        const user: UserEntity = await this.repository.findOneUser({ id, email });

        if (!user) return undefined;

        return new UserEntity(user);
    }

    public async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
        user.password = await bcrypt.hash(user.password, this.config.get<string>('HASH'));

        const res = await this.repository.createUser(user);

        return new UserEntity(res);
    }

    public async updateUser(id: string, user: Partial<UserEntity>, role: Role): Promise<UserEntity> {
        const isExist: boolean = await this.findOneUser(id) ? true : false;

        if (!isExist) return null;
        if (user.password) {
            if (role === Role.CUSTOMER) {
                const originalUser: UserEntity = await this.findOneUser(id);
                const match: boolean = await bcrypt.compare(user.password, originalUser.password);

                if (!match) return null;
            };

            user.password = await bcrypt.hash(user.password, this.config.get<string>('HASH'));
        };

        const res: UserEntity = await this.repository.updateUser(id, user);

        return res ? new UserEntity(res) : undefined;
    }

    public async deleteUser(id: string): Promise<string> {
        const res: UserEntity = await this.repository.deleteUser(id);

        return new UserEntity(res) ? 'User deleted' : undefined;
    }
}
