import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

import { UserService } from './user.service';
import { mockUserRepository, userMock, userMock1, userMock2, userMock3 } from '@users/domain/mocks';
import { UserEntity } from '@users/domain/entities';
import { emailServiceMock } from '@email/domain/mocks/email-provider.mock';
import { EmailService } from '@email/application/email.service';
import { Roles } from '@common/domain/enums';
import { Repository } from '@common/domain/entities';
import { CommonModule } from '@common/common.module';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let emailService: EmailService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: Repository<UserEntity>,
          useValue: mockUserRepository 
        },
        {
          provide: EmailService,
          useValue: emailServiceMock
        },
        ConfigService
      ],
      imports: [
        JwtModule.register({ secret: 'JWT-SECRET' }),
        CacheModule.register({ ttl: (60 ^ 2) * 1000 }),
        CommonModule.register({ saltRounds: 5 })
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(Repository<UserEntity>);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find All Users', () => {
    it('should fetch all users', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([ userMock, userMock1, userMock2, userMock3 ]);

      const res: Partial<UserEntity>[] = await service.findAllUsers({ take: 10, skip: 0 }, '0,10');

      expect(res).toEqual([ userMock, userMock1, userMock2, userMock3 ]);
    });

    it('should return users that match query search', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([ userMock, userMock1 ]);

      const q: string = 'A'
      const res: Partial<UserEntity>[] = await service.findAllUsers({ take: 10, skip: 0 }, q);

      expect(res).toEqual([ userMock, userMock1 ]);
      expect(res[0].name.includes(q) && res[1].name.includes(q)).toBeTruthy();
    });
  });

  describe('Find One User', () => {
    it('should find user by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(userMock3);

      const res: UserEntity = await service.findOneUser(userMock3.id);

      expect(res).toEqual(userMock3);
    });

    it('should find user by email', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(userMock3);

      const res: UserEntity = await service.findOneUser(null, userMock3.email);

      expect(res).toEqual(userMock3);
      expect(res.email).toBe(userMock3.email);
    });

    it('should return undefined if user was not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      const res: UserEntity = await service.findOneUser(randomUUID());

      expect(res).toBeUndefined;
    });

    it('should return null if id or email was not provided', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const res: UserEntity = await service.findOneUser();

      expect(res).toBeNull;
    });
  });

  describe('Create User', () => {
    const { name, email, password } = userMock1;

    it('should update user', async () => {
      jest.spyOn(emailService, 'sendWelcomeEmail');
      jest.spyOn(repository, 'create').mockResolvedValue(userMock1);

      const res: UserEntity = await service.createUser({ name, email, password });

      expect(res).toEqual(userMock1);
    });
  });

  describe('Update User', () => {
    it('should update user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(userMock2);
      jest.spyOn(repository, 'update').mockResolvedValue(userMock3);

      const { name } = userMock2;
      const res: UserEntity = await service.updateUser(userMock2.id, { name }, Roles.CUSTOMER);

      expect(res).toEqual(userMock3);
    });

    it('should return undefined if user was not updated', async () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(userMock2);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      const { name, password } = userMock2;
      const res: UserEntity = await service.updateUser(randomUUID(), { name, password}, Roles.CUSTOMER);

      expect(res).toBeUndefined;
    });

    it('should return null if user was not found', async () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(null);
      jest.spyOn(repository, 'update').mockResolvedValue(null);

      const { name, password } = userMock2;
      const res: UserEntity = await service.updateUser(randomUUID(), { name, password}, Roles.CUSTOMER);

      expect(res).toBeNull();
    });
  });

  describe('Delete User', () => {
    it('should delete user', async () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(userMock3);
      jest.spyOn(repository, 'delete').mockResolvedValue(userMock3);

      const res: string = await service.deleteUser(userMock3.id);

      expect(res).toBe('User deleted');
    });

    it('should return undefined if user was not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      const res: string = await service.deleteUser(randomUUID());

      expect(res).toBeUndefined;
    });
  });
});
