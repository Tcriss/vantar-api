import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { jwtFactory } from '../config/jwt.factory';
import { UserService } from '../../../users/application/services/user.service';
import { mockUserService } from '../../../users/domain/mocks/user-providers.mock';

describe('AuthService', () => {
  let userService: UserService;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService
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

    userService = module.get<UserService>(UserService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
