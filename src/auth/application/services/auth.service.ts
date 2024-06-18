import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaProvider } from '../../../prisma/infrastructure/providers/prisma.provider';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { UserService } from '../../../users/application/services/user.service';
import { Token } from '../../domain/types';

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
        const user: UserEntity = await this.userService.findOneUser(null, email);

        if (!user) return undefined;

        const isValid: boolean = await bcrypt.compare(password, user.password);

        if (!isValid) return null;

        const tokens: Token = await this.getTokens(user);

        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }

    public async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.userService.findOneUser(userId);

        if (!user || !user.refresh_token) return null;

        const match: boolean = await bcrypt.compare(user.refresh_token, refreshToken);

        if (!match) return undefined;

        const tokens: Token = await this.getTokens(user);

        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }      

    public async logOut(userId: string): Promise<string> {
        const user: UserEntity = await this.userService.findOneUser(userId);

        if (user) return null;

        return 'User logout successfully';
    }

    private async getTokens(user: Partial<UserEntity>): Promise<Token> {
        const { id, name, email } = user;
        const [ accessToken, refreshToken ] = await Promise.all([
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
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }

    private async updateRefreshToken(userId: string, token: string): Promise<void> {
        const hashedToken = await bcrypt.hash(token, this.config.get<string>('HASH'));

        this.prisma.user.update({
            where: { id: userId },
            data: { refresh_token: hashedToken }
        });
    }
}