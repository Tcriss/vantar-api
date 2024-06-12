import { Test, TestingModule } from '@nestjs/testing';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-google-oauth20';

import { GoogleAuthStrategy } from './google.strategy';
import { UserService } from '../../../../users/application/services/user.service';
import { mockUserService } from '../../../../users/domain/mocks/user-providers.mock';

describe('GoogleAuthStrategy', () => {
  let strategy: GoogleAuthStrategy;
  let configService: ConfigService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleAuthStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'CLIENT_ID':
                  return 'test-client-id';
                case 'CLIENT_SECRET':
                  return 'test-client-secret';
                case 'CB_URL':
                  return 'test-callback-url';
                default:
                  return null;
              }
            }),
          },
        },
        {
            provide: UserService, 
            useValue: mockUserService
        }
      ],
    }).compile();

    strategy = module.get<GoogleAuthStrategy>(GoogleAuthStrategy);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should be an instance of PassportStrategy', () => {
    expect(strategy).toBeInstanceOf(PassportStrategy(Strategy, 'google'));
  });

  it('should configure strategy correctly', () => {
    expect(configService.get).toHaveBeenCalledWith('CLIENT_ID');
    expect(configService.get).toHaveBeenCalledWith('CLIENT_SECRET');
    expect(configService.get).toHaveBeenCalledWith('CB_URL');

    expect(strategy).toMatchObject({
      _oauth2: expect.objectContaining({
        _clientId: 'test-client-id',
        _clientSecret: 'test-client-secret',
        _callbackURL: 'test-callback-url',
      }),
    });
  });

  it('should validate and return user', async () => {
    const mockProfile = {
      id: 'test-id',
      given_name: 'John',
      family_name: 'Doe',
      email: 'john.doe@example.com',
    };
    const done = jest.fn();

    await strategy.validate('test-access-token', 'test-refresh-token', mockProfile as any, done);

    expect(done).toHaveBeenCalledWith(null, {
      id: 'test-id',
      email: 'john.doe@example.com',
      name: 'John Doe',
    });
  });
});