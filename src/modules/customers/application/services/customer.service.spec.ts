import { Test, TestingModule } from '@nestjs/testing';

import { CustomerService } from './customer.service';
import { CustomerRepository } from '../repositories/customer.repository';
import { mockCustomerRepository } from '../../domain/mocks/customers-providers.mock';
import { mockCustomer1, mockCustomer2, mockCustomer3, mockCustomers, mockPartialCustomer1, mockPartialCustomer2, mockPartialCustomers, mockSearchedCustomers } from '../../domain/mocks/customers.mock';
import { CustomerEntity } from '../../domain/entities/customer.entity';
import { CustomerResponse } from '../../domain/types';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CustomerRepository,
          useValue: mockCustomerRepository
        }
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<CustomerRepository>(CustomerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find All Customers', () => {
    it('should fetch all customers', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue(mockCustomers);

      const res: Partial<CustomerEntity>[] = await service.findAllCustomers('be702a7b-13a3-4e03-93f6-65b2a82e1905', {skip: 0, take: 3});

      expect(res).toBe(mockCustomers);
    });

    it('should fetch some fields', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue(mockPartialCustomers);

      const res: Partial<CustomerEntity>[] = await service.findAllCustomers('be702a7b-13a3-4e03-93f6-65b2a82e1905', { skip: 0, take: 3 }, null, 'name, contact, userId');

      expect(res).toBe(mockPartialCustomers);
    });

    it('should fetch by search query', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue(mockSearchedCustomers);

      const res: Partial<CustomerEntity>[] = await service.findAllCustomers('be702a7b-13a3-4e03-93f6-65b2a82e1905', { skip: 0, take: 3 }, 'John');

      expect(res).toBe(mockSearchedCustomers);
    });
  });

  describe('Find One Customer', () => {
    it('should get a customer by its id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer1);

      const res: Partial<CustomerEntity> = await service.findOneCustomer(mockCustomer1.id);

      expect(res).toBe(mockCustomer1);
    });

    it('should get some fields', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPartialCustomer1);

      const res: Partial<CustomerEntity> = await service.findOneCustomer(mockPartialCustomer1.id, 'name, contact, userId');

      expect(res).toBe(mockPartialCustomer1);
    });

    it('should return undefined if customer were not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      const res: Partial<CustomerEntity> = await service.findOneCustomer('10c55da3-44c9-4a17-910c-6ae9235b993b');

      expect(res).toBe(undefined);
    });
  });

  describe('Create Customer', () => {
    it('should create a customer', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(mockCustomer1);

      const res: CustomerEntity = await service.createCustomer(mockCustomer1.user_id, mockCustomer1);

      expect(res).toBe(mockCustomer1);
    });
  });

  describe('Update Customer', () => {
    it('should update a customer', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer1);
      jest.spyOn(repository, 'update').mockResolvedValue(mockCustomer3);

      const { name, companies, contact } = mockCustomer2;
      const res: Partial<CustomerEntity> = await service.updateCustomer(mockCustomer1.user_id, mockCustomer1.id, { name, companies, contact});

      expect(res).toBe(mockCustomer3);
    });

    it('should return unfined if is not the owner', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer1);
      jest.spyOn(repository, 'update').mockResolvedValue(null);

      const { name, companies, contact } = mockCustomer2;
      const res: Partial<CustomerEntity> = await service.updateCustomer(mockCustomer2.user_id, mockCustomer1.id, { name, companies, contact});

      expect(res).toBe(null);
    });
  });

  describe('Delete Customer', () => {
    it('should delete a customer', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer3);
      jest.spyOn(repository, 'delete').mockResolvedValue(mockCustomer3);

      const res: CustomerEntity = await service.deleteCustomer(mockCustomer3.user_id, mockCustomer3.id);

      expect(res).toBe(mockCustomer3)
    });

    it('should not delete a customer if not the owner', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCustomer3);
      jest.spyOn(repository, 'delete').mockResolvedValue(null);

      const res: CustomerEntity = await service.deleteCustomer(mockCustomer2.user_id, mockCustomer3.id);

      expect(res).toBe(null)
    });
  });
});
