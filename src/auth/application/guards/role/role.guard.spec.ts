import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleGuard } from './role.guard';
import { Roles } from '../../../../common/domain/enums';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RoleGuard(reflector);
  });

  const mockExecutionContext = (userRole: Roles, roles: Roles[]): ExecutionContext => ({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user: { role: userRole },
      }),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  }) as unknown as ExecutionContext;

  it('should allow access when no roles are specified', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = mockExecutionContext(Roles.ADMIN, []);
    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });

  it('should allow access when the user role matches one of the required roles', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Roles.ADMIN, Roles.CUSTOMER]);

    const context = mockExecutionContext(Roles.ADMIN, [Roles.ADMIN, Roles.CUSTOMER]);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should deny access when the user role does not match any of the required roles', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Roles.ADMIN]);

    const context = mockExecutionContext(Roles.CUSTOMER, [Roles.ADMIN]);
    const result = await guard.canActivate(context);

    expect(result).toBe(false);
  });
});
