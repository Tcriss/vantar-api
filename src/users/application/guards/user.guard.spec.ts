import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UserGuard } from './user.guard';

import { Roles } from '../../../common/domain/enums';
import { ROLE_KEY } from '../../../common/application/decorators';

describe('UserGuard', () => {
  let guard: UserGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn()
  };

  const mockRequest = {
    params: { id: '101' },
    user: { id: '101', role: Roles.CUSTOMER }
  };

  const mockExecutionContext: Partial<ExecutionContext> = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    }),
    getHandler: jest.fn(),
    getClass: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserGuard,
        { provide: Reflector, useValue: mockReflector }
      ],
    }).compile();

    guard = module.get<UserGuard>(UserGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if user is ADMIN', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(Roles.ADMIN);
    mockRequest.user.role = Roles.ADMIN;

    const result: boolean = await guard.canActivate(mockExecutionContext as ExecutionContext);

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLE_KEY, [
      mockExecutionContext.getHandler(),
      mockExecutionContext.getClass(),
    ]);
  });

  it('should allow access if user is the owner of the resource', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(Roles.CUSTOMER);
    mockRequest.user.id = '101';

    const result: boolean = await guard.canActivate(mockExecutionContext as ExecutionContext);

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLE_KEY, [
      mockExecutionContext.getHandler(),
      mockExecutionContext.getClass(),
    ]);
  });

  it('should deny access if user is neither ADMIN nor the owner', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(null);
    mockRequest.user.id = '33';

    const result: boolean = await guard.canActivate(mockExecutionContext as ExecutionContext);
    
    expect(result).toBe(false);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLE_KEY, [
      mockExecutionContext.getHandler(),
      mockExecutionContext.getClass(),
    ]);
  });
});
