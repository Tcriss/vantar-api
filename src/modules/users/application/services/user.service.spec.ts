import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';

import { UserService } from './user.service';
import { mockUserRepository } from '../../domain/mocks/user-providers.mock';
import { UserRepository } from '../repository/user.repository';
import { usersMock } from '../../domain/mocks/user.mocks';
import { randomUUID } from 'crypto';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepository, useValue: mockUserRepository }],
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

      const res: User = await service.find(usersMock[0].id);

      expect(res).toEqual(usersMock[0]);
    });

    it('should find user by name', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(usersMock[0]);

      const res: User = await service.find(null, usersMock[0].name);

      expect(res).toEqual(usersMock[0]);
    });

    it('should find user by email', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(usersMock[0]);

      const res: User = await service.find(_, _, usersMock[0].email);

      expect(res).toEqual(usersMock[0]);
    });

    it('should return undefined if user was not find', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(undefined);

      const res: User = await service.find(randomUUID());

      expect(res).toBeUndefined;
    });

    it('should return null if id is invalid', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(null);

      const res: User = await service.find('2332');

      expect(res).toBeNull;
    });
  });

  describe('Create User', () => {
    const { name, email, password } = usersMock[0];

    it('should update user', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(usersMock[0]);

      const res: User = await service.create({ name, email, password });

      expect(res).toEqual(usersMock[0]);
    });
  });

  describe('Update User', () => {
    const { name, password } = usersMock[1];

    it('should update user', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(usersMock[3]);

      const res: User = await service.update(usersMock[2].id, { name, password });

      expect(res).toBeUndefined;
    });

    it('should return undefined if user was not find', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      const res: User = await service.update(randomUUID(), { name, password});

      expect(res).toBeUndefined;
    });

    it('should return null if id is invalid', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(null);

      const res: User = await service.update('2332', { name, password});

      expect(res).toBeNull;
    });
  });

  describe('Delete User', () => {
    it('should delete user', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(usersMock[1]);

      const res: User = await service.delete(usersMock[1]);

      expect(res).toBeUndefined;
    });

    it('should return undefined if user was not find', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      const res: User = await service.delete(randomUUID());

      expect(res).toBeUndefined;
    });

    it('should return null if id is invalid', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(null);

      const res: User = await service.delete('2332');

      expect(res).toBeNull;
    });
  });
});
