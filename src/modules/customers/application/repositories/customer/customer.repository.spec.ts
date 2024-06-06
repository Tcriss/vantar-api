import { Test, TestingModule } from '@nestjs/testing';

import { CustomerRepository } from './customer.repository';

describe('Customer', () => {
  let provider: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRepository
      ],
    }).compile();

    provider = module.get<CustomerRepository>(CustomerRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
