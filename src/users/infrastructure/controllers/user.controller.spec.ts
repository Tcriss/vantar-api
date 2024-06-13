import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from '../../application/services/user.service';
import { mockUserService } from '../../domain/mocks/user-providers.mock';
import { usersMock } from '../../domain/mocks/user.mocks';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ 
        provide: UserService, 
        useValue: mockUserService
      }],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find User', () => {
    it('should find a user by id', async  () => {
      jest.spyOn(service, 'findUser').mockResolvedValue(usersMock[1]);

      const user: User = await controller.find({ user: { id: usersMock[1].id, email: '', name: '' }});

      expect(user).toEqual(usersMock[1]);
    });

    it('should throw an exception if id is invalid', async () => {
      jest.spyOn(service, 'findUser').mockResolvedValue(null);

      try {
        await controller.find({ user: { id: '113', email: '', name: '' }});
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        expect(err.message).toBe('User not found, invalid id');
      }
    });

    it('should throw an exception if user was not found', async () => {
      jest.spyOn(service, 'findUser').mockResolvedValue(undefined);

      try {
        await controller.find({ user: { id: usersMock[2].id, email: '', name: '' }});
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('User not found');
      };
    });
  });

  describe('Create User', () => {
    it('should create user', async  () => {
      jest.spyOn(service, 'findUser').mockResolvedValue(undefined);
      jest.spyOn(service, 'createUser').mockResolvedValue(usersMock[1]);

      const user: User = await controller.create(usersMock[1]);

      expect(user).toEqual(usersMock[1])
    });
  });

  describe('Update User', () => {
    it('should update user', async  () => {
      jest.spyOn(service, 'updateUser').mockResolvedValue(usersMock[3]);

      const { name, password } = usersMock[1];
      const user: User = await controller.update({ user: { id: usersMock[2].id, email: '', name: '' }}, { name, password });

      expect(user).toBe(usersMock[3]);
    });

    it('should throw an exception if id is invalid', async () => {
      jest.spyOn(service, 'updateUser').mockResolvedValue(null);

      try {
        await controller.update({ user: { id: '133', email: '', name: '' }}, usersMock[0]);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('User not found, invalid id');
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an exception if user does not exist', async () => {
      jest.spyOn(service, 'updateUser').mockResolvedValue(undefined);

      try {
        await controller.update({ user: { id: usersMock[0].id, email: '', name: '' }}, usersMock[0]);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('User not found');
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('Delete User', () => {
    it('should find a user by id', async  () => {
      jest.spyOn(service, 'deleteUser').mockResolvedValue('User deleted');

      const res: string = await controller.delete({ user: { id: usersMock[0].id, email: '', name: '' }});

      expect(res).toBe('User deleted');
    });

    it('should throw an exception if id is invalid', async () => {
      jest.spyOn(service, 'deleteUser').mockResolvedValue(null);

      try {
        await controller.delete({ user: { id: '122', email: '', name: '' }});
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('User not found, invalid id');
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an exception if user does not exist', async () => {
      jest.spyOn(service, 'deleteUser').mockResolvedValue(undefined);

      try {
        await controller.delete({ user: { id: usersMock[0].id, email: '', name: '' }});
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('User not found');
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
