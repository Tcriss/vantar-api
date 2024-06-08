import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';

import { CategoryService } from './category.service';
import { CategoryRepository } from '../repositories/category.repository';
import { mockCategoryRepository, prismaMock } from '../../domain/mocks/category-providers.mock';
import { categories, category } from '../../domain/mocks/category.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find All Categories', () => {
    it('should return an array of categories', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue(categories);

      expect(await service.findAllCategories()).toBe(categories);
    });
  });

  describe('Find One Category', () => {
    it('should return a category by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(category);

      expect(await service.findOneCategory('1')).toBe(category);
    });

    it('should return a category by name', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(category);

      expect(await service.findOneCategory(null, 'Test')).toBe(category);
    });

    it('should return null if neither id nor name is provided', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      expect(await service.findOneCategory()).toBeNull;
    });

    it('should return null if category is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      expect(await service.findOneCategory('1')).toBeUndefined;
    });
  });
});
