import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthEntity } from '../../domain/entities/auth.entity';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { BcryptProvider } from '../../../security/application/providers/bcrypt.provider';
import { Repository } from '../../../common/domain/entities';
import { EmailService } from '../../../email/application/email.service';

@Injectable()
export class AuthService {

    constructor(
        private userRepository: Repository<UserEntity>,
        private emailService: EmailService,
        private config: ConfigService,
        private bcrypt: BcryptProvider,
        private jwt: JwtService
    ) {}

    public async login(credentials: Partial<UserEntity>): Promise<AuthEntity> {
        const { email, password } = credentials;
        const user: Partial<UserEntity> = await this.userRepository.findOne(null, email);
        
        if (!user) return undefined;

        const isValid: boolean = await this.bcrypt.compare(password, user.password);

        if (!isValid) return null;

        const tokens: AuthEntity = await this.getTokens(user);
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

    public async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepository.findOne(null, email);

        if (!user) return null;

        const token: string = await this.jwt.signAsync(
            { email: user.email },
            { secret: this.config.get('RESET_SECRET') }
        );
        const hashedToken: string = await this.bcrypt.hash(token);

        await this.userRepository.update(user.id, { reset_token: hashedToken });
        await this.emailService.sendResetPassword(user, token);
    }

    public async activateAccount(token: string): Promise<string> {
        const payload = await this.verifyToken(token, 'ACTIVATION_SECRET');
        const user = await this.userRepository.findOne(null, payload['email']);

        if (!user) return null;

        const isMatch: boolean = await this.bcrypt.compare(token, user.activation_token);

        if (!isMatch) return undefined;

        const res = await this.userRepository.update(user.id, {
            active: true,
            activation_token: null
        });

        return res ? 'Account activated successfully' : null;
    }

    public async resetPassword(token: string, password: string): Promise<string> {
        const payload = await this.verifyToken(token, 'RESET_SECRET');
        const user = await this.userRepository.findOne(null, payload['email']);

        if (!user) return null;

        const isMatch: boolean = await this.bcrypt.compare(token, user.reset_token);

        if (!isMatch) return undefined;

        const res = await this.userRepository.update(user.id, {
            password: await this.bcrypt.hash(password),
            refresh_token: null
        });

        return res ? 'Password reseted successfully' : null;
    }

    public async verifyToken(token: string, secretKey: string): Promise<unknown> {
        const payload = await this.jwt.verifyAsync(token, {secret: this.config.get(secretKey)});

        if (!payload) return null;

        return payload;
    }

    private async getTokens(user: Partial<UserEntity>): Promise<AuthEntity> {
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