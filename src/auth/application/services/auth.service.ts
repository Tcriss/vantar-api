import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Token } from '../../domain/types';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { BcryptProvider } from '../../../common/application/providers/bcrypt.provider';
import { Repository } from '../../../common/domain/entities';

@Injectable()
export class AuthService {

    constructor(
        private userRepository: Repository<UserEntity>,
        private config: ConfigService,
        private bcrypt: BcryptProvider,
        private jwt: JwtService
    ) {}

    public async login(credentials: Partial<UserEntity>): Promise<Token> {
        const { email, password } = credentials;
        const user: Partial<UserEntity> = await this.userRepository.findOne(null, email);

        if (!user) return undefined;

        const isValid: boolean = await this.bcrypt.compare(password, user.password);

        if (!isValid) return null;

        const tokens: Token = await this.getTokens(user);
        const updatedTokens = await this.updateRefreshToken(user.id, tokens.refresh_token);

        return updatedTokens ? tokens : undefined;
    }

    public async refreshTokens(userId: string, refreshToken: string): Promise<string> {
        const user: Partial<UserEntity> = await this.userRepository.findOne(userId);

        if (!user || user.refresh_token === null) return null;

        const match: boolean = await this.bcrypt.compare(refreshToken, user.refresh_token);

        if (!match) return undefined;

        const token: string = await this.getAccessToken(user);

        return token || undefined;
    }

    public async logOut(userId: string): Promise<string> {
        const user: Partial<UserEntity> = await this.userRepository.findOne(userId);

        if (!user) return null;

        const res = await this.userRepository.update(userId, { refresh_token: null })

        return res ? 'User logout successfully' : undefined;
    }

    public async verifyToken(token: string, secretKey: string): Promise<unknown> {
        const payload = await this.jwt.verifyAsync(token, {secret: this.config.get(secretKey)});

        if (!payload) return null;

        return payload;
    }

    public async activateAccount(token: string): Promise<string> {
        const payload = await this.verifyToken(token, 'ACTIVATION_SECRET');
        const user = await this.userRepository.findOne(null, payload['email']);

        if (!user) return null;
        console.log('storaged token: ', user.activation_token)
        if (await this.bcrypt.compare(token, user.activation_token)) return undefined;

        const res = await this.userRepository.update(user.id, {
            active: true,
            activation_token: null
        });

        return res ? 'Account activated succesfully' : null;
    }

    private async getTokens(user: Partial<UserEntity>): Promise<Token> {
        const { id, name, email, role } = user;
        const [ accessToken, refreshToken ] = await Promise.all([
            this.jwt.signAsync({ id, name, email, role }, {
                secret: this.config.get<string>('SECRET'), 
                expiresIn: this.config.get<string>('AT_TIME')
            }),
            this.jwt.signAsync({ id }, {
                secret: this.config.get<string>('RT_SECRET'), 
                expiresIn: this.config.get<string>('RT_TIME')
            })
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }

    private async getAccessToken(user: Partial<UserEntity>): Promise<string> {
        const { id, name, email, role } = user;

        return this.jwt.signAsync({ id, name, email, role }, {
            secret: this.config.get<string>('SECRET'), 
            expiresIn: this.config.get<string>('AT_TIME')
        });
    }

    private async updateRefreshToken(userId: string, token: string): Promise<string> {
        const hashedToken = await this.bcrypt.hash(token);

        const res = await this.userRepository.update(userId, {
            refresh_token: hashedToken
        });

        return res ? 'Token refreshed' : undefined;
    }
}