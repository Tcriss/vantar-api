import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

import { AccessTokenGuard } from './access-token.guard';
import { AuthService } from '@auth/application/services';

describe('AccessTokenGuard', () => {
  let guard: AccessTokenGuard;
  let reflector: Reflector;
  let authService: AuthService;

  const mockAuthService = {
    verifyToken: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockExecutionContext = (authHeader: string, getHandler: boolean, getClass: boolean): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization: authHeader,
        },
      }),
    }),
    getHandler: (): any => getHandler,
    getClass: (): any => getClass
  } as unknown as ExecutionContext);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    guard = module.get<AccessTokenGuard>(AccessTokenGuard);
    reflector = module.get<Reflector>(Reflector);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access to public routes', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const context = mockExecutionContext('', true, true);
    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });

  it('should throw an error if token is missing in headers', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const context = mockExecutionContext('Bearer', false, false);

    await expect(guard.canActivate(context)).rejects.toThrow(
      new HttpException('Token missing in headers', HttpStatus.UNAUTHORIZED),
    );
  });

  it('should return true if token is valid', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const validToken = { userId: 1, username: 'test' };

    jest.spyOn(authService, 'verifyToken').mockResolvedValue(validToken);

    const context = mockExecutionContext('Bearer valid-token', false, false);
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });
});
