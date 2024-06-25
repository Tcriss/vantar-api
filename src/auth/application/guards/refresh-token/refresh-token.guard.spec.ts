import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

import { RefreshTokenGuard } from './refresh-token.guard';

describe('RefreshTokenGuard', () => {
  let guard: RefreshTokenGuard;

  beforeEach(() => {
    guard = new RefreshTokenGuard();
  });

  const mockExecutionContext = (headers: Headers | unknown): ExecutionContext => ({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers,
      }),
    }),
  }) as unknown as ExecutionContext;

  it('should throw an exception when no headers are provided', async () => {
    const context = mockExecutionContext(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(guard.canActivate(context)).rejects.toMatchObject({
      response: 'No headers provided',
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('should throw an exception when the token is invalid', async () => {
    const context = mockExecutionContext({ authorization: 'Invalid token' });

    await expect(guard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(guard.canActivate(context)).rejects.toMatchObject({
      response: 'Invalid token',
      status: HttpStatus.UNAUTHORIZED,
      cause: 'Token not found in headers',
    });
  });

  it('should allow access and set the refresh token when a valid token is provided', async () => {
    const validToken = 'some-valid-token';
    const context = mockExecutionContext({ authorization: `Bearer ${validToken}` });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(context.switchToHttp().getRequest().refresh).toBe(validToken);
  });
});
