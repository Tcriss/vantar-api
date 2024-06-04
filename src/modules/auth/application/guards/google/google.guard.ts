import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const activate: boolean = (await super.canActivate(context)) as boolean;
        const req: Request = context.switchToHttp().getRequest();
        await super.logIn(req);
        return activate;
    }
}