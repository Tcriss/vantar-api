import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenGuard implements CanActivate {

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();

        return await this.isValid(req);
    }

    private async isValid(req: Request): Promise<boolean> {
        if (!req.headers) throw new HttpException('No headers provided', HttpStatus.BAD_REQUEST);
        
        const token: string = await this.extractTokenFromHeader(req.headers);
        
        if (!token) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

        req['refresh'] = token;
        
        return true;
    }

    private async extractTokenFromHeader(headers: Headers): Promise<string> {
        const [type, token]: string[] = headers['Authorization']?.split(' ') ?? [];
    
        console.log(token)
        return type === 'Bearer' ? token : undefined;
    }
}