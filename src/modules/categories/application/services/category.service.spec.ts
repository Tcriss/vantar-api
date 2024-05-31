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
      jest.spyOn(repository, 'readMany').mockResolvedValue(categories);

      expect(await service.findAllCategories()).toBe(categories);
    });
  });

  describe('Find One Category', () => {
    it('should return a category by id', async () => {
      jest.spyOn(repository, 'read').mockResolvedValue(category);

      expect(await service.findOneCategory('1')).toBe(category);
    });

    it('should return a category by name', async () => {
      jest.spyOn(repository, 'read').mockResolvedValue(category);

      expect(await service.findOneCategory(null, 'Test')).toBe(category);
    });

    it('should return null if neither id nor name is provided', async () => {
      jest.spyOn(repository, 'read').mockResolvedValue(null);

      expect(await service.findOneCategory()).toBeNull;
    });

    it('should return null if category is not found', async () => {
      jest.spyOn(repository, 'read').mockResolvedValue(undefined);

      expect(await service.findOneCategory('1')).toBeUndefined;
    });
  });

  describe('Create Category', () => {
    it('should create a category', async () => {
      const category: Partial<Category> = { name: 'test', description: 'Test' };
      const createdCategory: Category = { id: '1', name: 'Test', description: 'Test' };
      jest.spyOn(repository, 'create').mockResolvedValue(createdCategory);

      expect(await service.createCategory(category)).toBe(createdCategory);
    });
  });

  describe('Update Category', () => {
    it('should update a category', async () => {
      const updatedCategory: Partial<Category> = { name: 'Updated Test', description: 'Updated Test' };
      const resultCategory: Category = { id: '1', name: 'Updated Test', description: 'Updated Test' };

      jest.spyOn(repository, 'update').mockResolvedValue(resultCategory);
      jest.spyOn(repository, 'read').mockResolvedValue(resultCategory);

      expect(await service.updateCategory('1', updatedCategory)).toBe(resultCategory);
    });

    it('should return null if id was not provided', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(null);

      expect(await service.updateCategory('invalid-uuid', { name: 'Test', description: 'Test' })).toBeNull;
    });

    it('should return null if category does not exist', async () => {
      jest.spyOn(repository, 'read').mockResolvedValue(undefined);

      expect(await service.updateCategory('2', { name: 'Test', description: 'Test' })).toBeUndefined;
    });
  });

  describe('Delete Category', () => {
    it('should delete a category', async () => {
      const category: Category = { id: '1', name: 'Test', description: 'Test' };
      jest.spyOn(repository, 'delete').mockResolvedValue(category);
      jest.spyOn(repository, 'read').mockResolvedValue(category);

      expect(await service.deleteCategory('1')).toBe(category);
    });

    it('should return null if id was not provided', async () => {
      jest.spyOn(repository, 'read').mockResolvedValue(null);

      expect(await service.deleteCategory('invalid-uuid')).toBeNull;
    });

    it('should return undefined does not exist', async () => {
      jest.spyOn(repository, 'read').mockResolvedValue(undefined);

      expect(await service.deleteCategory('2')).toBeUndefined;
    });
  });
});
