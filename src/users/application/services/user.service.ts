import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from '@nestjs/cache-manager';

import { UserEntity } from '../../domain/entities/user.entity';
import { UpdateUserDto } from '../../domain/dtos';
import { Pagination } from '../../../common/domain/types';
import { Roles } from '../../../common/domain/enums';
import { Repository } from '../../../common/domain/entities';
import { BcryptProvider } from '../../../security/application/providers/bcrypt.provider';
import { EmailService } from '../../../email/application/email.service';
import { Cached } from '../../../common/application/decorators';

@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);

    constructor(
        @Cached() private readonly cache: Cache,
        private readonly repository: Repository<UserEntity>,
        private readonly emailService: EmailService,
        private readonly bcrypt: BcryptProvider,
        private readonly jwt: JwtService
    ) {}

    public async findAllUsers(pagination: Pagination, query?: string): Promise<UserEntity[] | Partial<UserEntity>[]> {
        return this.repository.findAll(pagination, query);
    }

    public async findOneUser(id?: string, email?: string): Promise<UserEntity> {
        if (!id && !email) return null;

        const cachedUser: UserEntity = await this.cache.get('user');

        if (cachedUser) return cachedUser;

        const user: Partial<UserEntity> = await this.repository.findOne(id, email);

        if (!user) return undefined;

        await this.cache.set('user', user);

        return new UserEntity(user);
    }

    public async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
        const [ password, activationToken ] = await Promise.all([
            this.bcrypt.hash(user.password),
            this.jwt.signAsync({ email: user.email })
        ]);
        user.password = password;
        user.activation_token = await this.bcrypt.hash(activationToken);
        const newUser = await this.repository.create(user);
        const emailResponse = await this.emailService.sendWelcomeEmail(newUser, activationToken);
        
        if (!emailResponse) this.logger.log('error: ', emailResponse);

        await this.cache.set('user', newUser);

        return newUser;
    }

    public async updateUser(id: string, user: UpdateUserDto, role: Roles): Promise<UserEntity> {
        const originalUser = await this.findOneUser(id);

        if (!originalUser) return null;
        if (user.password && user.newPassword) {
            if (role === Roles.CUSTOMER) {
                const match: boolean = await this.bcrypt.compare(user.password, originalUser.password);

                if (!match) return null;
            };

            user.password = await this.bcrypt.hash(user.newPassword);
        };

        const { newPassword, ...userUpdate } = user
        const res: UserEntity = await this.repository.update(id, userUpdate);

        if (!res) return undefined;

        await this.cache.set('user', res);
        return res;
    }

    public async deleteUser(id: string): Promise<string> {
        const user = await this.findOneUser(id);

        if (!user) return null;
        
        const res: UserEntity = await this.repository.delete(id);
        await this.cache.del('user');
        
        return res ? 'User deleted' : undefined;
    }
}
