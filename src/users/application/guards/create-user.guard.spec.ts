import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { CreateUserGuard } from './create-user.guard';

describe('CreateUserGuard', () => {
  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ ConfigModule, JwtModule ]
    }).compile();
    const config: ConfigService = module.get<ConfigService>(ConfigService);
    const jwt: JwtService = module.get<JwtService>(JwtService);

    expect(new CreateUserGuard(jwt, config)).toBeDefined();
  });
});
