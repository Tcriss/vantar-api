import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../../../users/domain/entities/user.entity';
import { UserService } from '../../../users/application/services/user.service';
import { Payload, Token } from '../../domain/types';

@Injectable()
export class AuthService {

    constructor(private config: ConfigService, private userService: UserService, private jwt: JwtService) {}

    public async logIn(credentials: Partial<UserEntity>): Promise<Token> {
        const { email, password } = credentials;
        const user: UserEntity = await this.userService.findUser(null, email);

        if (!user) return undefined;

        const isValid: boolean = await bcrypt.compare(password, user.password);

        if (!isValid) return null;

        return this.getToken(user);
    }

    private async getToken(user: Partial<UserEntity>): Promise<Token> {
        const payload: Payload = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        const [ access_token, refresh_token ] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: this.config.get<string>('SECRET'), 
                expiresIn: '24m'
            }),
            this.jwt.signAsync(payload, {
                secret: this.config.get<string>('SECRET'), 
                expiresIn: '24h'
            })
        ]);

        return {
            access_token: access_token,
            refresh_token: refresh_token
        };
    }
}