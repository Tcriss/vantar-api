import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PUBLIC_KEY, ROLE_KEY } from '../../../../common/application/decorators';
import { Role } from '../../../../common/domain/enums';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const roles: Role[] = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return this.isValid(req, roles);
  }

  private async isValid(req: Request, roles: Role[]): Promise<boolean> {
    const userRole: Role = req['user']['role'];

    return roles.includes(userRole);
  }
}
