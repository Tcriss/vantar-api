import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AuthService } from '../../services/auth.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {

    constructor(private authService: AuthService) {}

    public async canActivate(context: ExecutionContext, ): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();

        return this.isValid(req);
    }

    private async isValid(req: Request): Promise<boolean> {
        if (!req.headers) throw new HttpException('No headers provided', HttpStatus.BAD_REQUEST);
        
        const token: string = await this.extractTokenFromHeader(req.headers);
        
        if (!token) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED, { cause: 'Token missing in headers' });

        const payload: unknown = await this.authService.verifyToken(token, 'RT_SECRET');

        req['refresh_token'] = payload;
        return true;
    }

    private async extractTokenFromHeader(headers: Headers): Promise<string> {
        const [type, token]: string[] = headers['authorization']?.split(' ') ?? [];
        
        return type === 'Bearer' ? token : undefined;
    }
}