import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLE_KEY } from '../../../../common/application/decorators';
import { Roles } from '../../../../common/domain/enums';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const roles: Roles[] = this.reflector.getAllAndOverride<Roles[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;

    return this.isValid(req, roles);
  }

  private async isValid(req: Request, roles: Roles[]): Promise<boolean> {
    const userRole: Roles = req['user']['role'];

    return roles.includes(userRole);
  }
}
