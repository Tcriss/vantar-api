import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';

import { UserService } from './user.service';
import { mockUserRepository } from '../../domain/mocks/user-providers.mock';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { usersMock } from '../../domain/mocks/user.mocks';
import { PrismaModule } from '../../../prisma/prisma.module';
import { Role } from '../enums';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository }
      ],
      imports: [ConfigModule, PrismaModule]
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find User', () => {
    it('should find user by id', async () => {
      jest.spyOn(repository, 'findOneUser').mockResolvedValue(usersMock[0]);

      const res: User = await service.findOneUser(usersMock[0].id);

      expect(res).toEqual(usersMock[0]);
    });

    it('should find user by name', async () => {
      jest.spyOn(repository, 'findOneUser').mockResolvedValue(usersMock[0]);

      const res: User = await service.findOneUser(null, usersMock[0].name);

      expect(res).toEqual(usersMock[0]);
    });

    it('should find user by email', async () => {
      jest.spyOn(repository, 'findOneUser').mockResolvedValue(usersMock[0]);

      const res: User = await service.findOneUser(null, usersMock[0].email);

      expect(res).toEqual(usersMock[0]);
    });

    it('should return undefined if user was not find', async () => {
      jest.spyOn(repository, 'findOneUser').mockResolvedValue(undefined);

      const res: User = await service.findOneUser(randomUUID());

      expect(res).toBeUndefined;
    });

    it('should return null if id is invalid', async () => {
      jest.spyOn(repository, 'findOneUser').mockResolvedValue(null);

      const res: User = await service.findOneUser('2332');

      expect(res).toBeNull;
    });
  });

  describe('Create User', () => {
    const { name, email, password } = usersMock[0];

    it('should update user', async () => {
      jest.spyOn(repository, 'createUser').mockResolvedValue(usersMock[0]);

      const res: User = await service.createUser({ name, email, password });

      expect(res).toEqual(usersMock[0]);
    });
  });

  describe('Update User', () => {
    const { name, password } = usersMock[1];

    it('should update user', async () => {
      jest.spyOn(repository, 'updateUser').mockResolvedValue(usersMock[3]);

      const res: User = await service.updateUser(usersMock[2].id, { name, password }, Role.CUSTOMER);

      expect(res).toBeUndefined;
    });

    it('should return undefined if user was not find', async () => {
      jest.spyOn(repository, 'updateUser').mockResolvedValue(undefined);

      const res: User = await service.updateUser(randomUUID(), { name, password}, Role.CUSTOMER);

      expect(res).toBeUndefined;
    });

    it('should return null if id is invalid', async () => {
      jest.spyOn(repository, 'updateUser').mockResolvedValue(null);

      const res: User = await service.updateUser('2332', { name, password}, Role.CUSTOMER);

      expect(res).toBeNull;
    });
  });

  describe('Delete User', () => {
    it('should delete user', async () => {
      jest.spyOn(repository, 'deleteUser').mockResolvedValue(usersMock[1]);

      const res: string = await service.deleteUser(usersMock[1].id);

      expect(res).toBe('User deleted');
    });

    it('should return undefined if user was not find', async () => {
      jest.spyOn(repository, 'deleteUser').mockResolvedValue(undefined);

      const res: string = await service.deleteUser(randomUUID());

      expect(res).toBeUndefined;
    });

    it('should return null if id is invalid', async () => {
      jest.spyOn(repository, 'deleteUser').mockResolvedValue(null);

      const res: string = await service.deleteUser('2332');

      expect(res).toBeNull;
    });
  });
});
