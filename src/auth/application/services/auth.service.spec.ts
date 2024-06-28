import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { jwtFactory } from '../config/jwt.factory';
import { mockUserRepository } from '../../../users/domain/mocks/user-providers.mock';
import { UserRepositoryI, UserRepositoryToken } from '../../../users/domain/interfaces';
import { userMock1, userMock2 } from '../../../users/domain/mocks/user.mocks';
import { Token } from '../../domain/types';
import { BcryptProvider } from '../../../common/application/providers/bcrypt.provider';

describe('AuthService', () => {
  let userRepository: UserRepositoryI;
  let service: AuthService;
  const tokenMock: Token = {
    access_token: 'new_access_token',
    refresh_token: 'new_refresh_token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        BcryptProvider,
        {
          provide: UserRepositoryToken,
          useValue: mockUserRepository
        }
      ],
      imports: [
        ConfigModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: jwtFactory
        })
      ]
    }).compile();

    userRepository = module.get<UserRepositoryI>(UserRepositoryToken);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Login', () => {
    it('should login user', async () => {
      jest.spyOn(userRepository, 'findOneUser').mockResolvedValue(userMock2);

      const res: Token = await service.login({
        email: userMock2.email,
        password: userMock2.password
      });

      expect(res).toBeDefined();
    });

    it('should return undefined if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneUser').mockResolvedValue(null);

      const res: Token = await service.login({
        email: userMock2.email,
        password: userMock2.password
      });

      expect(res).toBeUndefined();
    });

    it('should return null if password does not match', async () => {
      jest.spyOn(userRepository, 'findOneUser').mockResolvedValue(userMock2);

      const res: Token = await service.login({
        email: userMock2.email,
        password: userMock1.password
      });

      expect(res).toBeNull();
    })
  });

  describe('Refresh Tokens', () => {
    it('should return null if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneUser').mockResolvedValue(null);

      const res: Token = await service.refreshTokens(userMock2.id, userMock2.refresh_token);

      expect(res).toBeNull();
    });

    it('should return null if access token does not exist', async () => {
      jest.spyOn(userRepository, 'findOneUser').mockResolvedValue(userMock1);

      const res: Token = await service.refreshTokens(userMock2.id, userMock2.refresh_token);

      expect(res).toBeUndefined();
    });

    it('should return undefined if refresh token does not match', async () => {
      jest.spyOn(userRepository, 'findOneUser').mockResolvedValue(userMock1);

      const res: Token = await service.refreshTokens(userMock2.id, userMock2.refresh_token);

      expect(res).toBeUndefined();
    });
  });

  describe('Logout', () => {
    it('should logout user', async () => {
      jest.spyOn(userRepository, 'findOneUser').mockResolvedValue(userMock2);

      let { refresh_token, ...rest } = userMock2;
      refresh_token = null;

      jest.spyOn(userRepository, 'updateUser').mockResolvedValue({ refresh_token, ...rest});

      const res = await service.logOut(userMock2.id);

      expect(res).toBeDefined();
      expect(res).toBe('User logout successfully');
    });

    it('should return null if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOneUser').mockResolvedValue(null);

      const res = await service.logOut(userMock2.id);

      expect(res).toBeNull();
    });
  });
});
