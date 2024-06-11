import { Test, TestingModule } from '@nestjs/testing';

import { CategoryRepository } from './category.repository';
import { PrismaProvider } from '../../../prisma/providers/prisma.provider';
import { prismaMock } from '../../domain/mocks/category-providers.mock';
import { categories, category } from '../../domain/mocks/category.mock';

describe('CategoryRepository', () => {
  let repository: CategoryRepository;
  let prisma: PrismaProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryRepository,
        {
          provide: PrismaProvider,
          useValue: prismaMock
        }
      ],
    }).compile();

    repository = module.get<CategoryRepository>(CategoryRepository);
    prisma = module.get<PrismaProvider>(PrismaProvider);
  });

  it('shoul be define', async () => {
    expect(repository).toBeDefined();
  });

  describe('Find All Categories', () => {
    it('should read many categories with a query', async () => {
      jest.spyOn(prisma.category, 'findMany').mockResolvedValue(categories);

      const result = await repository.findAll('Test');

      expect(result).toEqual(categories);
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: { name: { contains: 'Test' } },
        orderBy: { name: 'desc' },
      });
    });

    it('should read many categories without a query', async () => {
      jest.spyOn(prisma.category, 'findMany').mockResolvedValue(categories);

      const result = await repository.findAll();

      expect(result).toEqual(categories);
      expect(prisma.category.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
    });
  });

  describe('Find One Category', () => {
    it('should read a category by id', async () => {
      jest.spyOn(prisma.category, 'findUnique').mockResolvedValue(category);

      const result = await repository.findOne('1');

      expect(result).toEqual(category);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should read a category by name', async () => {
      jest.spyOn(prisma.category, 'findUnique').mockResolvedValue(category);

      const result = await repository.findOne(undefined, 'Test');

      expect(result).toEqual(category);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { name: 'Test' } });
    });
  });
});