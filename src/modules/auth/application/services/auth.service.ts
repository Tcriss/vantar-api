import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../../../users/domain/entities/user.entity';
import { UserService } from '../../../users/application/services/user.service';
import { AuthEntity } from '../../domain/entities/auth.entity';

@Injectable()
export class AuthService {

    constructor(private config: ConfigService, private userService: UserService, private jwt: JwtService) {}

    public async validateUser(email: string, password: string): Promise<UserEntity> {
        const user: UserEntity = await this.userService.findUser(null, null, email);

        if (!user) return undefined;

        const isValid: boolean = await this.isPasswordValid(user.password);

        if (!isValid) return null;

        return user;
    }

    public async loginUser(user: UserEntity): Promise<AuthEntity> {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        return { access_token: this.jwt.sign(payload) };
    }

    public async decodeToken(token: string): Promise<Partial<UserEntity>> {
        return this.jwt.decode(token);
    }

    public async recoverPassword(): Promise<void> {}

    private async isPasswordValid(resource: string): Promise<boolean> {
        return bcrypt.compare(resource, this.config.get<string>('HASH'));
    }
}