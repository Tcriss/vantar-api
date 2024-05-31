import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../../infrastructure/dtos/create-user.dto';
import { UpdateUserDto } from '../../infrastructure/dtos/update-user.dto';

@Injectable()
export class UserService {

    constructor(private repository: UserRepository, private config: ConfigService) {}

    public async findUser(id?: string, name?: string, email?: string): Promise<User> {
        if (!id && !name && !email) return null;

        const user: User = await this.repository.find(id, name, email);

        if (!user) return undefined;

        return user;
    }

    public async createUser(user: CreateUserDto): Promise<User> {
        user.password = await bcrypt.hash(user.password, this.config.get<string>('HASH'));

        return this.repository.create({ id: null, ...user });
    }

    public async updateUser(id: string, user: UpdateUserDto): Promise<User> {
        if (!id) return null;
        if (user.password) user.password = await bcrypt.hash(user.password, this.config.get<string>('HASH'));

        const res: User = await this.repository.update(id, { id: id, ...user});

        return res ? res : undefined;
    }

    public async deleteUser(id: string): Promise<string> {
        if (!id) return null;

        const res: User = await this.repository.delete(id);

        return res ? 'User deleted' : undefined;
    }
}
