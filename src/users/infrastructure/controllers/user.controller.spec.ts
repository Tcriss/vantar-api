import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserController } from './user.controller';
import { UserService } from '../../application/services/user.service';
import { mockUserService } from '../../domain/mocks/user-providers.mock';
import { userMock, userMock1, userMock2, userMock3 } from '../../domain/mocks/user.mocks';
import { Roles } from '../../../common/domain/enums';
import { UserEntity } from '../../domain/entities';

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
      imports: [
        JwtModule.register({ secret: 'JWT-SECRET' }),
        ConfigModule
      ]
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
      }} as unknown as Request, { page: 1, limit: 10 })

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
        page: 1, limit: 10, q: q
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
        }} as unknown as Request, { page: 1, limit: 10 })
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

    it('should create an admin user when admin is logged in', async  () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(undefined);
      jest.spyOn(service, 'createUser').mockResolvedValue(userMock2);

      const { name, email, password } = userMock2;
      const user: User = await controller.create(
        {
          name,
          email,
          password,
          role: Roles.ADMIN
        },
        {
          user: {
            id: userMock.id,
            name: userMock.name,
            email: userMock.email,
            role: Roles.ADMIN
          }
        } as unknown as Request
      );

      expect(user).toEqual(userMock2)
    });

    it('should throw an exception if name has numbers', async () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(undefined);
      jest.spyOn(service, 'createUser').mockResolvedValue(userMock2);

      try {
        const { email, password } = userMock2;
        await controller.create({ name: 'Albert0 Rojas4', email, password, role: Roles.CUSTOMER });  
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe(['name must not contain numbers']);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an exception is customer is logged in', async () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(undefined);
      jest.spyOn(service, 'createUser').mockResolvedValue(userMock2);

      try {
        const { email, password } = userMock2;
        await controller.create(
          {
            name: 'Albert0 Rojas4',
            role: Roles.CUSTOMER,  
            email,
            password
          },
          {
            user: {
              id: userMock1.id,
              name: userMock1.name,
              email: userMock1.email,
              role: Roles.CUSTOMER
            }
          } as unknown as Request
        );
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('Cannot register when logged in');
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw an exception when creating admin by a no admin', async () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(undefined);

      try {
        const { email, password } = userMock2;
        await controller.create({
          name: 'Albert0 Rojas4',
          role: Roles.ADMIN,  
          email,
          password
        });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('Not enough permissions');
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('Update User', () => {
    it('should update user', async  () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(userMock2);
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

    it('should throw an exception if name has numbers', async () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(userMock);
      jest.spyOn(service, 'updateUser').mockResolvedValue(userMock3);

      try {
        await controller.update(userMock.id, {
          user: {
            id: userMock.id,
            email: '',
            name: '',
            role: Roles.CUSTOMER
        }} as unknown as Request, { name: 'R0nal2 Torres' });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe(['name must not contain numbers']);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('Delete User', () => {
    it('should delete a user by id', async  () => {
      jest.spyOn(service, 'deleteUser').mockResolvedValue('User deleted');

      const res = await controller.delete(userMock.id);

      expect(res).toStrictEqual({ message: 'User deleted' });
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
