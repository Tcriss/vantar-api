import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from '../../application/services/user.service';
import { mockUserService } from '../../domain/mocks/user-providers.mock';
import { usersMock } from '../../domain/mocks/user.mocks';
import { User } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
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

      const user: User = await controller.find(usersMock[1].id);

      expect(user).toEqual(usersMock[1]);
    });

    it('should throw an exception if id is invalid', async () => {
      jest.spyOn(service, 'findUser').mockRejectedValue(null);

      try {
        await controller.find('1113');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).rejects.toBe(400);
        expect(err.message).rejects.toBe('User not found, invalid id');
      }
    });

    it('should throw an exception if user was not found', async () => {
      jest.spyOn(service, 'findUser').mockRejectedValue(undefined);

      try {
        await controller.find(usersMock[2]);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).rejects.toBe(404);
        expect(err.message).rejects.toBe('User not found');
      };
    });
  });

  describe('Create User', () => {
    it('should find a user by id', async  () => {
      jest.spyOn(service, 'createUser').mockResolvedValue(usersMock[1]);

      const user: User = await controller.find(usersMock[1].id);

      expect(user).toEqual(usersMock[1])
    });

    it('should throw an exception if some fields are missing', async () => {
      jest.spyOn(service, 'createUser').mockRejectedValue(null);

      const { email, name} = usersMock[0];

      try {
        await controller.create({email, name});
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBeInstanceOf(Array);
        expect(err.message).toBe(['password should not be empty'])
        expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('Update User', () => {
    it('should update user', async  () => {
      jest.spyOn(service, 'updateUser').mockResolvedValue(usersMock[1]);

      const user: User = await controller.update(usersMock[1].id);

      expect(user).toBe(usersMock[1]);
    });

    it('should throw an exception if id is invalid', async () => {
      jest.spyOn(service, 'updateUser').mockRejectedValue(null);

      try {
        await controller.update('123');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('User not found, invalid id');
        expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an exception if user does not exist', async () => {
      jest.spyOn(service, 'updateUser').mockRejectedValue(undefined);

      try {
        await controller.update(usersMock[0].id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('User not found');
        expect(err.statusCode).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('Delete User', () => {
    it('should find a user by id', async  () => {
      jest.spyOn(service, 'deleteUser').mockResolvedValue('User deleted');

      const res: string = await controller.delete(usersMock[0].id);

      expect(res).toBe('User deleted');
    });

    it('should throw an exception if id is invalid', async () => {
      jest.spyOn(service, 'deleteUser').mockRejectedValue(null);

      try {
        await controller.delete('123');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('User not found, invalid id');
        expect(err.statusCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an exception if user does not exist', async () => {
      jest.spyOn(service, 'deleteUser').mockRejectedValue(undefined);

      try {
        await controller.delete(usersMock[0].id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('User not found');
        expect(err.statusCode).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
