import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthService } from '@auth/application/services';
import { PUBLIC_KEY } from '@common/application/decorators';

@Injectable()
export class AccessTokenGuard implements CanActivate { 

    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;
          
        return this.isValid(context.switchToHttp().getRequest());
    }

    private async isValid(req: Request): Promise<boolean> {
        const token: string = await this.extractTokenFromHeader(req.headers);
        
        if (!token) throw new HttpException('Token missing in headers', HttpStatus.UNAUTHORIZED);

        const payload = await this.authService.verifyToken(token, 'SECRET');

        if (!payload) return false;

        req['user'] = payload;
        return true;
    }

    private async extractTokenFromHeader(headers: Headers): Promise<string> {
        const [type, token]: string[] = headers['authorization']?.split(' ') ?? [];
        
        return type === 'Bearer' ? token : undefined;
    }
}