import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Token } from '../../domain/types';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { Repository } from '../../../users/application/decorators/repository.decorator';
import { UserRepositoryI } from '../../../users/domain/interfaces';

@Injectable()
export class AuthService {

    constructor(
        @Repository() private userRepository: UserRepositoryI,
        private config: ConfigService,
        private jwt: JwtService
    ) {}

    public async login(credentials: Partial<UserEntity>): Promise<Token> {
        const { email, password } = credentials;
        const user: UserEntity = await this.userRepository.findOneUser({ email: email });

        if (!user) return undefined;

        const isValid: boolean = await bcrypt.compare(password, user.password);

        if (!isValid) return null;

        const tokens: Token = await this.getTokens(user);
        const updatedTokens = await this.updateRefreshToken(user.id, tokens.refresh_token);

        return updatedTokens ? tokens : undefined;
    }

    public async refreshTokens(userId: string, refreshToken: string): Promise<Token> {
        const user: UserEntity = await this.userRepository.findOneUser({ id: userId });

        if (!user || user.refresh_token === null) return null;

        const match: boolean = await bcrypt.compare(refreshToken, user.refresh_token);

        if (!match) return undefined;

        const tokens: Token = await this.getTokens(user);
        const updatedTokens: string = await this.updateRefreshToken(user.id, tokens.refresh_token);

        return updatedTokens ? tokens : undefined;
    }

    public async logOut(userId: string): Promise<string> {
        const user: UserEntity = await this.userRepository.findOneUser({ id: userId });

        if (!user) return null;

        const res = await this.userRepository.updateUser(userId, { refresh_token: null })

        return res ? 'User logout successfully' : undefined;
    }

    private async getTokens(user: Partial<UserEntity>): Promise<Token> {
        const { id, name, email, role } = user;
        const [ accessToken, refreshToken ] = await Promise.all([
            this.jwt.signAsync({ id, name, email, role }, {
                secret: this.config.get<string>('SECRET'), 
                expiresIn: this.config.get<string>('AT_TIME')
            }),
            this.jwt.signAsync({ id }, {
                secret: this.config.get<string>('SECRET'), 
                expiresIn: this.config.get<string>('RT_TIME')
            })
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }

    private async updateRefreshToken(userId: string, token: string): Promise<string> {
        const hashedToken = await bcrypt.hash(token, this.config.get<string>('HASH'));
        const res = await this.userRepository.updateUser(userId, {
            refresh_token: hashedToken
        });

        return res ? 'Token refreshed' : undefined;
    }
}