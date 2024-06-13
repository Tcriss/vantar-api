import { Test, TestingModule } from '@nestjs/testing';

import { CustomerRepository } from './customer.repository';
import { PrismaProvider } from '../../../prisma/infrastructure/providers/prisma.provider';
import { prismaMock } from '../../domain/mocks/customers-providers.mock';
import { mockCustomer1, mockCustomer2, mockCustomer3, mockCustomers } from '../../domain/mocks/customers.mock';
import { CustomerEntity } from '../../domain/entities/customer.entity';

describe('Customer', () => {
  let repository: CustomerRepository;
  let prisma: PrismaProvider;

  beforeAll(async () => {
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
      jest.spyOn(prisma.customer, 'findMany').mockResolvedValue([ mockCustomer1, mockCustomer3 ]);

      const res: Partial<CustomerEntity>[] = await repository.findAll(mockCustomers[0].user_id, { skip: 0, take: 3});

      expect(res).toBeInstanceOf(Array);
      expect(res).toHaveLength(2);
      expect(res).toEqual([ mockCustomer1, mockCustomer3 ]);
    });

    it('should only bring one element', async () => {
      jest.spyOn(prisma.customer, 'findMany').mockResolvedValue([mockCustomers[0]]);

      const res: Partial<CustomerEntity>[] = await repository.findAll(mockCustomers[0].user_id, { skip: 0, take: 1 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toHaveLength(1);
      expect(res).toEqual([ mockCustomer1 ]);
    });
  });

  describe('Find One Customer', () => {
    it('should find a customer', async () => {
      jest.spyOn(prisma.customer, 'findUnique').mockResolvedValue(mockCustomers[0]);

      const res: Partial<CustomerEntity> = await repository.findOne(mockCustomer1.id);

      expect(res).toEqual(mockCustomer1);
    });

    it('should fetch some fields from a customer', async () => {
      jest.spyOn(prisma.customer, 'findUnique').mockResolvedValue(mockCustomers[0]);

      const res: Partial<CustomerEntity> = await repository.findOne(mockCustomer1.id, {
        name: true,
        companies: false
      });

      expect(res).toEqual(mockCustomer1);
    });
  });

  describe('Create Customer', () => {
    it('should create a customer', async () => {
      jest.spyOn(prisma.customer, 'create').mockResolvedValue(mockCustomers[0]);

      const { name, contact, companies, user_id } = mockCustomers[0];
      const res: Partial<CustomerEntity> = await repository.create({ name, contact, companies, user_id });

      expect(res).toEqual(mockCustomer1);
    });
  });

  describe('Update Customer', () => {
    it('should update a customer', async () => {
      jest.spyOn(prisma.customer, 'update').mockResolvedValue(mockCustomer3);

      const { name, contact, companies } = mockCustomer2;
      const res: Partial<CustomerEntity> = await repository.update(mockCustomer1.id, { name, contact, companies });

      expect(res).toEqual(mockCustomer3);
    });
  });

  describe('Delete Customer', () => {
    it('should delete a customer', async () => {
      jest.spyOn(prisma.customer, 'delete').mockResolvedValue(mockCustomer3);

      const res: Partial<CustomerEntity> = await repository.delete(mockCustomer3.id);

      expect(res).toEqual(mockCustomer3);
    });
  });
});
