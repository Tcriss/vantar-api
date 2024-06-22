import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { ROLE_KEY } from '../../../../common/application/decorators';
import { Roles } from '../../../../common/domain/enums';

@Injectable()
export class OwnerGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const role: Roles = this.reflector.getAllAndOverride<Roles>(ROLE_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    const req: Request = context.switchToHttp().getRequest();

    return this.isOwner(req, role);
  }

  private async isOwner(req: Request, role: Roles): Promise<boolean> {
    const userId: string = req['user']['id'];
    const userRole: Roles = req['user']['role'];
    const resourceId: string = req.params.id;

    if ((role && userRole) === Roles.ADMIN) return true;

    return userId === resourceId;
  }
}
