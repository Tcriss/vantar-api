import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';

import { UserService } from './user.service';
import { mockUserRepository } from '../../domain/mocks/user-providers.mock';
import { UserRepository } from '../repository/user.repository';
import { usersMock } from '../../domain/mocks/user.mocks';
import { PrismaModule } from '../../../prisma/prisma.module';

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
      jest.spyOn(repository, 'find').mockResolvedValue(usersMock[0]);

      const res: User = await service.findUser(usersMock[0].id);

      expect(res).toEqual(usersMock[0]);
    });

    it('should find user by name', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(usersMock[0]);

      const res: User = await service.findUser(null, usersMock[0].name);

      expect(res).toEqual(usersMock[0]);
    });

    it('should find user by email', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(usersMock[0]);

      const res: User = await service.findUser(null, usersMock[0].email);

      expect(res).toEqual(usersMock[0]);
    });

    it('should return undefined if user was not find', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(undefined);

      const res: User = await service.findUser(randomUUID());

      expect(res).toBeUndefined;
    });

    it('should return null if id is invalid', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(null);

      const res: User = await service.findUser('2332');

      expect(res).toBeNull;
    });
  });

  describe('Create User', () => {
    const { name, email, password } = usersMock[0];

    it('should update user', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(usersMock[0]);

      const res: User = await service.createUser({ name, email, password });

      expect(res).toEqual(usersMock[0]);
    });
  });

  describe('Update User', () => {
    const { name, password } = usersMock[1];

    it('should update user', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(usersMock[3]);

      const res: User = await service.updateUser(usersMock[2].id, { name, password });

      expect(res).toBeUndefined;
    });

    it('should return undefined if user was not find', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      const res: User = await service.updateUser(randomUUID(), { name, password});

      expect(res).toBeUndefined;
    });

    it('should return null if id is invalid', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(null);

      const res: User = await service.updateUser('2332', { name, password});

      expect(res).toBeNull;
    });
  });

  describe('Delete User', () => {
    it('should delete user', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(usersMock[1]);

      const res: string = await service.deleteUser(usersMock[1].id);

      expect(res).toBe('User deleted');
    });

    it('should return undefined if user was not find', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      const res: string = await service.deleteUser(randomUUID());

      expect(res).toBeUndefined;
    });

    it('should return null if id is invalid', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(null);

      const res: string = await service.deleteUser('2332');

      expect(res).toBeNull;
    });
  });
});
