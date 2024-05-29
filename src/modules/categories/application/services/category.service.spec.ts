import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';

import { CategoryService } from './category.service';
import { PrismaModule } from '../../../prisma/prisma.module';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService],
      imports: [PrismaModule]
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
