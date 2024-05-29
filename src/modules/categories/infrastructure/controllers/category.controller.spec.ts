import { Test, TestingModule } from '@nestjs/testing';

import { CategoryController } from './category.controller';
import { CategoryService } from '../../application/services/category.service';
import { CategoryRepository } from '../../application/repositories/category.repository';
import { PrismaModule } from '../../../prisma/prisma.module';

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, CategoryRepository],
      controllers: [CategoryController],
      imports: [PrismaModule]
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
