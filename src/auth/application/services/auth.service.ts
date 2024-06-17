import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../../../users/domain/entities/user.entity';
import { UserService } from '../../../users/application/services/user.service';
import { Token } from '../../domain/types';
import { PrismaProvider } from '../../../prisma/infrastructure/providers/prisma.provider';

@Injectable()
export class AuthService {

    constructor(
        private config: ConfigService,
        private prisma: PrismaProvider,
        private userService: UserService,
        private jwt: JwtService
    ) {}

    public async logIn(credentials: Partial<UserEntity>): Promise<Token> {
        const { email, password } = credentials;
        const user: UserEntity = await this.userService.findUser(null, email);

        if (!user) return undefined;

        const isValid: boolean = await bcrypt.compare(password, user.password);

        if (!isValid) return null;

        const tokens: Token = await this.getToken(user);

        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }

    public async logOut(userId: string): Promise<string> {
        const user: UserEntity = await this.userService.findUser(userId);

        if (user) return null;

        return 'User logout successfully';
    }

    private async getToken(user: Partial<UserEntity>): Promise<Token> {
        const { id, name, email } = user;
        const [ access_token, refresh_token ] = await Promise.all([
            this.jwt.signAsync({ id, name, email }, {
                secret: this.config.get<string>('SECRET'), 
                expiresIn: '15m'
            }),
            this.jwt.signAsync({ id }, {
                secret: this.config.get<string>('SECRET'), 
                expiresIn: '7d'
            })
        ]);

        return {
            access_token: access_token,
            refresh_token: refresh_token
        };
    }

    private async updateRefreshToken(userId: string, token: string): Promise<void> {
        this.prisma.user.update({
            where: { id: userId },
            data: { refresh_token: token }
        });
    }
}