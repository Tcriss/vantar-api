import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../../infrastructure/dtos/create-user.dto';
import { UpdateUserDto } from '../../infrastructure/dtos/update-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class UserService {

    constructor(private repository: UserRepository, private config: ConfigService) {}

    public async findUser(id?: string, email?: string): Promise<UserEntity> {
        if (!id && !email) return null;

        const user: UserEntity = await this.repository.find({ id, email });

        if (!user) return undefined;

        return new UserEntity(user);
    }

    public async createUser(user: CreateUserDto): Promise<UserEntity> {
        user.password = await bcrypt.hash(user.password, this.config.get<string>('HASH'));

        const res = await this.repository.create(user);

        return new UserEntity(res);
    }

    public async updateUser(id: string, user: UpdateUserDto): Promise<UserEntity> {
        if (!id) return null;
        if (user.password) user.password = await bcrypt.hash(user.password, this.config.get<string>('HASH'));

        const res: UserEntity = await this.repository.update(id, user);

        return res ? new UserEntity(user) : undefined;
    }

    public async deleteUser(id: string): Promise<string> {
        if (!id) return null;

        const res: UserEntity = await this.repository.delete(id);

        return new UserEntity(res) ? 'User deleted' : undefined;
    }
}
