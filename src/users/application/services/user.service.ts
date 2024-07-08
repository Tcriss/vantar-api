import { Injectable } from '@nestjs/common';

import { BcryptProvider } from '../../../common/application/providers/bcrypt.provider';
import { UserEntity } from '../../domain/entities/user.entity';
import { Pagination } from '../../../common/domain/types';
import { Roles } from '../../../common/domain/enums';
import { Repository } from '../../../common/domain/entities';

@Injectable()
export class UserService {

    constructor(
        private repository: Repository<UserEntity>,
        private bcrypt: BcryptProvider
    ) {}

    public async findAllUsers(page: string, query?: string): Promise<UserEntity[] | Partial<UserEntity>[]> {
        const pagination: Pagination = {
            skip: +page.split(',')[0],
            take: +page.split(',')[1]
        };
        
        return this.repository.findAll(pagination, query);
    }

    public async findOneUser(id?: string, email?: string): Promise<UserEntity> {
        if (!id && !email) return null;

        const user: Partial<UserEntity> = await this.repository.findOne(id, email);

        if (!user) return undefined;

        return new UserEntity(user);
    }

    public async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
        user.password = await this.bcrypt.hash(user.password);

        return this.repository.create(user);;
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

        const res: UserEntity = await this.repository.update(id, user);

        return res ?? undefined;
    }

    public async deleteUser(id: string): Promise<string> {
        const res: UserEntity = await this.repository.delete(id);

        return res ? 'User deleted' : undefined;
    }
}
