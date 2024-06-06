import { Test, TestingModule } from '@nestjs/testing';

import { CustomerRepository } from './customer.repository';
import { PrismaProvider } from '../../../prisma/providers/prisma.provider';
import { prismaMock } from '../../domain/mocks/customers-providers.mock';
import { mockCustomer1, mockCustomer2, mockCustomers } from '../../domain/mocks/customers.mock';
import { CustomerEntity } from '../../domain/entities/customer.entity';

describe('Customer', () => {
  let repository: CustomerRepository;
  let prisma: PrismaProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRepository,
        {
          provide: PrismaProvider,
          useValue: prismaMock
        }
      ],
    }).compile();

    prisma = module.get<PrismaProvider>(PrismaProvider);
    repository = module.get<CustomerRepository>(CustomerRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Find All Customers', () => {
    it('should find all customers', async () => {
      jest.spyOn(prisma.customer, 'findMany').mockRejectedValue([mockCustomers[0], mockCustomers[1]]);

      const res: Partial<CustomerEntity>[] = await repository.findAll(mockCustomers[0].user_id, { skip: 0, take: 3});

      expect(res).toBeInstanceOf(Array);
      expect(res).toHaveLength(2);
      expect(res).toBe([ mockCustomer1, mockCustomer2 ]);
    });

    it('should only bring one element', async () => {
      jest.spyOn(prisma.customer, 'findMany').mockRejectedValue([mockCustomers[0]]);

      const res: Partial<CustomerEntity>[] = await repository.findAll(mockCustomers[0].user_id, { skip: 0, take: 1 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toHaveLength(1);
      expect(res).toBe([ mockCustomer1 ]);
    });
  });

  describe('Find One Customer', () => {
    it('should find a customer', async () => {
      jest.spyOn(prisma.customer, 'findUnique').mockRejectedValue(mockCustomers[0]);

      const res: Partial<CustomerEntity> = await repository.findOne(mockCustomer1.id, {
        name: true,
        companies: false
      });

      expect(res).toBe(mockCustomer1);
    });
  });

  describe('Create Customer', () => {});

  describe('Update Customer', () => {});

  describe('Delete Customer', () => {});
});
