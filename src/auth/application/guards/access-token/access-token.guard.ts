import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { PUBLIC_KEY } from '../../../../common/application/decorators';

@Injectable()
export class AccessTokenGuard extends AuthGuard('access') { 

    constructor(private reflector: Reflector) {
        super()
    }

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;
          
        return super.canActivate(context);
    }
}