import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CreateUserGuard implements CanActivate {

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    return this.verify(req);
  }

  private async verify(req: Request): Promise<boolean> {
    if (await this.isLoggedIn(req) === false) return true;

    return this.getUserInfo(req);
  }

  private async isLoggedIn(req: Request): Promise<boolean> {
    return !!req.headers['authorization'];
  }

  private async getUserInfo(req: Request): Promise<boolean> {
    const token: string = await this.extractTokenFromHeader(req.headers);
    const payload = await this.jwt.verifyAsync(token, { secret: this.config.get('SECRET') });

    if (!payload) return false;

    req['user'] = payload;
    return true;
  }

  private async extractTokenFromHeader(headers: Headers): Promise<string> {
    const [type, token]: string[] = headers['authorization']?.split(' ') ?? [];
    
    return type === 'Bearer' ? token : undefined;
  } 
}
