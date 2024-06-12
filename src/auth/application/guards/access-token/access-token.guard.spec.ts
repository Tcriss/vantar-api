import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { of } from 'rxjs';

import { AccessTokenGuard } from './access-token.guard';

describe('AccessTokenGuard', () => {
  let guard: AccessTokenGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new AccessTokenGuard(reflector);
  });

  it('should return true if the route is public', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    
    const context: ExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });
});
