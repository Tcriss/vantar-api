import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from '../../application/services/auth.service';
import { mockAuthService } from '../../domain/mocks/auth-providers.mock';
import { userMock } from '../../../users/domain/mocks/user.mocks';
import { UserService } from '../../../users/application/services/user.service';
import { mockUserService } from '../../../users/domain/mocks/user-providers.mock';
import { jwtFactory } from '../../application/config/jwt.factory';

describe('AuthController', () => {
  let userService: UserService;
  let service: AuthService;
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: UserService,
          useValue: mockUserService
        }
      ],
      controllers: [AuthController],
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: jwtFactory
        }),
        ConfigModule
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('Login User', () => {
    it('should log user in', async () => {
      jest.spyOn(userService, 'findUser').mockResolvedValue(userMock);
      jest.spyOn(service, 'logIn').mockResolvedValue({ access_token: '123456' });

      const { email, password } = userMock;
      const res: { message: string, access_token: string } = await controller.login({ email, password });

      expect(res.message).toBe('Login successful');
      expect(res.access_token).toBe('123456');
    });

    it('should throw exception if credentials are wrong', async () => {
      jest.spyOn(userService, 'findUser').mockResolvedValue(userMock);
      jest.spyOn(service, 'logIn').mockResolvedValue(null);

      const { email, password } = userMock;

      try {
        await controller.login({ email, password });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_ACCEPTABLE);
        expect(err.message).toBe('Wrong credentials');
      }
    });

    it('should throw exception if user not found', async () => {
      jest.spyOn(userService, 'findUser').mockResolvedValue(undefined);
      jest.spyOn(service, 'logIn').mockResolvedValue(undefined);

      const { email, password } = userMock;

      try {
        await controller.login({ email, password });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('User not found');
      }
    });
  });
});
