import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';

import { RefreshTokenGuard } from './refresh-token.guard';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '../../../../common/common.module';
import { UserModule } from '../../../../users/user.module';
import { DatabaseModule } from '../../../../database/database.module';
import { EmailModule } from '../../../../email/email.module';

describe('RefreshTokenGuard', () => {
  let guard: RefreshTokenGuard;
  let auth: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ AuthService ],
      imports: [
        JwtModule.register({}),
        CommonModule.register({ saltRounds: 5 }),
        UserModule.forFeature(),
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule.forRoot({ isGlobal: true }),
        CacheModule.register({
          isGlobal: true,
          ttl: (60 ^ 2) * 1000
        }),
        EmailModule.register({
          isGlobal: true,
          options: {
            apiKey: 'API_KEY',
            authUrl: 'AUTH_URL',
            resetPasswordUrl: 'RESET',
            host: 'HOST'
          }
        })
      ]
    }).compile();
    auth = module.get<AuthService>(AuthService);

    guard = new RefreshTokenGuard(auth);
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
      cause: 'Token missing in headers'
    });
  });
});
