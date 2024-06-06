import { Test, TestingModule } from '@nestjs/testing';

import { CustomerController } from './customer.controller';
import { CustomerService } from '../../application/services/customer.service';
import { mockCustomerService } from '../../domain/mocks/customers-providers.mock';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { mockCustomer1, mockCustomer2, mockCustomer3, mockCustomers, mockPartialCustomer1, mockPartialCustomers, mockSearchedCustomers } from '../../domain/mocks/customers.mock';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomerResponse } from '../../domain/types';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService
        }
      ],
      controllers: [CustomerController],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find All Customers', () => {
    it('should fetch all customers', async () => {
      jest.spyOn(service, 'findAllCustomers').mockResolvedValue(mockCustomers);

      const res: Partial<CustomerEntity>[] = await controller.findAll({ user: { id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905', name: '', email: '' }}, {skip: 0, take: 3});

      expect(res).toBe(mockCustomers);
    });

    it('should fetch some fields', async () => {
      jest.spyOn(service, 'findAllCustomers').mockResolvedValue(mockPartialCustomers);

      const res: Partial<CustomerEntity>[] = await controller.findAll({ user: { id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905', name: '', email: '' }}, { skip: 0, take: 3 }, null, 'name, contact, userId');

      expect(res).toBe(mockPartialCustomers);
    });

    it('should fetch by search query', async () => {
      jest.spyOn(service, 'findAllCustomers').mockResolvedValue(mockSearchedCustomers);

      const res: Partial<CustomerEntity>[] = await controller.findAll({ user: { id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905', name: '', email: '' }}, { skip: 0, take: 3 }, 'John');

      expect(res).toBe(mockSearchedCustomers);
    });
  });

  describe('Find One Customer', () => {
    it('should get a customer by its id', async () => {
      jest.spyOn(service, 'findOneCustomer').mockResolvedValue(mockCustomer1);

      const res: Partial<CustomerEntity> = await controller.findOne(mockCustomer1.id);

      expect(res).toBe(mockCustomer1);
    });

    it('should get some fields', async () => {
      jest.spyOn(service, 'findOneCustomer').mockResolvedValue(mockPartialCustomer1);

      const res: Partial<CustomerEntity> = await controller.findOne(mockPartialCustomer1.id, 'name, contact, userId');

      expect(res).toBe(mockPartialCustomer1);
    });

    it('should return undefined if customer were not found', async () => {
      jest.spyOn(service, 'findOneCustomer').mockResolvedValue(undefined);

      try {
        await controller.findOne('10c55da3-44c9-4a17-910c-6ae9235b993b');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Customer not found');
      }
    });
  });

  describe('Create Customer', () => {
    it('should create a customer', async () => {
      jest.spyOn(service, 'createCustomer').mockResolvedValue(mockCustomer1);

      const { name, companies, contact } = mockCustomer1;
      const res: CustomerResponse = await controller.create({ user: { id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905', name: '', email: '' } }, { name, companies, contact });

      expect(res.message).toBe('Customer created succesfully');
      expect(res.data).toBe(mockCustomer1);
    });
  });

  describe('Update Customer', () => {
    it('should update a customer', async () => {
      jest.spyOn(service, 'findOneCustomer').mockResolvedValue(mockCustomer1);
      jest.spyOn(service, 'updateCustomer').mockResolvedValue(mockCustomer3);

      const { name, companies, contact } = mockCustomer2;
      const res: CustomerResponse = await controller.update({ user: { id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905', name: '', email: '' } }, mockCustomer1.id, { name, companies, contact});

      expect(res.message).toBe('Customer updated succesfully');
      expect(res.data).toBe(mockCustomer3);
    });

    it('should not update if is not the owner', async () => {
      jest.spyOn(service, 'findOneCustomer').mockResolvedValue(mockCustomer1);
      jest.spyOn(service, 'updateCustomer').mockResolvedValue(null);

      const { name, companies, contact } = mockCustomer2;

      try {
        await controller.update({ user: { id: '10c55da3-44c9-4a17-910c-6ae9235b993b', name: '', email: '' } }, mockCustomer1.id, { name, companies, contact});
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('You are not the owner of this resource');
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should return exception if customer not found', async () => {
      jest.spyOn(service, 'findOneCustomer').mockResolvedValue(mockCustomer1);
      jest.spyOn(service, 'updateCustomer').mockResolvedValue(undefined);

      const { name, companies, contact } = mockCustomer2;

      try {
        await controller.update({ user: { id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905', name: '', email: '' } }, mockCustomer2.id, { name, companies, contact});
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('Customer not found');
        expect(err.status).toBe(HttpStatus.NOT_FOUND)
      }
    });
  });

  describe('Delete Customer', () => {
    it('should delete a customer', async () => {
      jest.spyOn(service, 'findOneCustomer').mockResolvedValue(mockCustomer3);
      jest.spyOn(service, 'deleteCustomer').mockResolvedValue(mockCustomer3);

      const res: CustomerResponse = await controller.delete({ user: { id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905', name: '', email: '' } }, mockCustomer3.id);

      expect(res.message).toBe('Customer deleted succesfully');
    });

    it('should not delete a customer if not the owner', async () => {
      jest.spyOn(service, 'findOneCustomer').mockResolvedValue(mockCustomer3);
      jest.spyOn(service, 'deleteCustomer').mockResolvedValue(null);

      try {
        await controller.delete({ user: { id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905', name: '', email: '' } }, mockCustomer3.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe('You are not the owner of this resource');
      }
    });

    it('should return exception if customer not found', async () => {
      jest.spyOn(service, 'findOneCustomer').mockResolvedValue(mockCustomer3);
      jest.spyOn(service, 'deleteCustomer').mockResolvedValue(undefined);

      try {
        await controller.delete({ user: { id: 'be702a7b-13a3-4e03-93f6-65b2a82e1905', name: '', email: '' } }, mockCustomer1.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toBe('Customer not found');
        expect(err.status).toBe(HttpStatus.NOT_FOUND)
      }
    });
  });
});
