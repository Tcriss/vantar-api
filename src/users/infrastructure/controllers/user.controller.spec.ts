import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from '../../application/services/user.service';
import { mockUserService } from '../../domain/mocks/user-providers.mock';
import { userMock, userMock1, userMock2, userMock3 } from '../../domain/mocks/user.mocks';
import { Roles } from '../../../common/domain/enums';
import { UserEntity } from '../../domain/entities/user.entity';

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

  describe('Find All Users', () => {
    it('should fetch all users if you are admin', async () => {
      jest.spyOn(service, 'findAllUsers').mockResolvedValue([ userMock, userMock1, userMock2, userMock3 ]);

      const users: UserEntity[] | Partial<UserEntity>[] = await controller.findAll({
        user: {
          id: userMock.id,
          email: userMock.email,
          name: userMock.name,
          role: Roles.ADMIN
      }} as unknown as Request, { page: '0,10' })

      expect(users).toStrictEqual([ userMock, userMock1, userMock2, userMock3 ]);
    });

    it('should fetxh only users wich contains query search', async () => {
      jest.spyOn(service, 'findAllUsers').mockResolvedValue([ userMock, userMock1 ]);

      const q: string = 'a';
      const users: UserEntity[] | Partial<UserEntity>[] = await controller.findAll({
        user: {
          id: userMock.id,
          email: userMock.email,
          name: userMock.name,
          role: Roles.ADMIN
      }} as unknown as Request, {
        page: '0,10',
        q: q
      });

      expect(users).toStrictEqual([ userMock, userMock1 ]);
      expect(users[0].name.toLowerCase() && users[1].name.toLowerCase()).toContain(q);
    });

    it('should throw an exception if user is not admin', async () => {
      try {
        await controller.findAll({
          user: {
            id: userMock.id,
            email: userMock.email,
            name: userMock.name,
            role: Roles.ADMIN
        }} as unknown as Request, { page: '0,10' })
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe('Without enough permissions');
      }
    });
  });

  describe('Find User', () => {
    it('should find a user by id', async  () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(userMock);

      const user: User = await controller.findOne(userMock.id);

      expect(user).toEqual(userMock);
    });

    it('should throw an exception if id is invalid', async () => {
      try {
        await controller.findOne('113');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Validation failed (uuid  is expected)');
      }
    });

    it('should throw an exception if user was not found', async () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(undefined);

      try {
        await controller.findOne(userMock.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('User not found');
      };
    });
  });

  describe('Create User', () => {
    it('should create user', async  () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(undefined);
      jest.spyOn(service, 'createUser').mockResolvedValue(userMock2);

      const { name, email, password } = userMock2;
      const user: User = await controller.create({ name, email, password, role: Roles.CUSTOMER });

      expect(user).toEqual(userMock2)
    });
  });

  describe('Update User', () => {
    it('should update user', async  () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(userMock2)
      jest.spyOn(service, 'updateUser').mockResolvedValue(userMock3);

      const { name } = userMock2;
      const user: User = await controller.update(userMock2.id, {
        user: {
          id: userMock2.id,
          email: userMock2.email,
          name: userMock2.name,
          role: Roles.CUSTOMER
        }} as unknown as Request, { name });

      expect(user).toBe(userMock3);
    });

    it('should throw an exception if id is invalid', async () => {
      try {
        await controller.update('133', { user: {
          id: '133',
          email: '',
          name: '',
          role: Roles.CUSTOMER
        }} as unknown as Request, userMock);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Validation failed (uuid  is expected)');
      }
    });

    it('should throw an exception if user does not exist', async () => {
      jest.spyOn(service, 'updateUser').mockResolvedValue(undefined);

      try {
        await controller.update(userMock.id, {
          user: {
            id: userMock.id,
            email: '',
            name: '',
            role: Roles.CUSTOMER
        }} as unknown as Request, userMock);
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

      const res: string = await controller.delete(userMock.id);

      expect(res).toBe('User deleted');
    });

    it('should throw an exception if id is invalid', async () => {
      jest.spyOn(service, 'deleteUser').mockResolvedValue(null);

      try {
        await controller.delete('122');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('User not found, invalid id');
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an exception if user does not exist', async () => {
      jest.spyOn(service, 'deleteUser').mockResolvedValue(undefined);

      try {
        await controller.delete(userMock.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('User not found');
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
