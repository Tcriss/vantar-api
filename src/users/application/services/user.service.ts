import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BcryptProvider } from '../../../common/application/providers/bcrypt.provider';
import { UserEntity } from '../../domain/entities/user.entity';
import { Pagination } from '../../../common/domain/types';
import { Roles } from '../../../common/domain/enums';
import { Repository } from '../../../common/domain/entities';
import { EmailService } from '../../../email/application/email.service';

@Injectable()
export class UserService {

    private logger = new Logger(UserService.name);

    constructor(
        private repository: Repository<UserEntity>,
        private emailService: EmailService,
        private bcrypt: BcryptProvider,
        private jwt: JwtService
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
        const [ password, activationToken ] = await Promise.all([
            this.bcrypt.hash(user.password),
            this.jwt.signAsync({ email: user.email })
        ]);
        user.password = password;
        user.activation_token = await this.bcrypt.hash(activationToken);
        const newUser = await this.repository.create(user);
        const emailResponse = await this.emailService.sendWelcomeEmail(newUser, activationToken);
        
        if (!emailResponse) this.logger.log('error: ', emailResponse);

        return newUser;
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
