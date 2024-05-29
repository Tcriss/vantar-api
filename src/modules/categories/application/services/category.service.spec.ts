import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';

import { CategoryService } from './category.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { PrismaProvider } from '../../../prisma/providers/prisma.provider';
import { prismaMock } from '../../domain/mocks/prisma.mock';
import { CategoryRepository } from '../repositories/category.repository';
import { categoryMock1 } from '../../domain/mocks/category.mock';
import { categoryList } from '../../domain/mocks/categories-list.mock';

describe('CategoryService', () => {
  const falseId: string = '8a6e0804-2bd0-4672-b79d-d97027f9071a';
  let service: CategoryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaProvider,
          useValue: prismaMock
        },
        CategoryService,
        CategoryRepository,
      ],
      imports: [PrismaModule]
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('Find All Categories', () => {
    it('should get all categories', async () => {
      prismaMock.category.findMany.mockResolvedValue(categoryList);

      const res: Category[] = await service.findAllCategories();

      expect(res).toEqual(categoryList);
    });
  });

  describe('Create Category', () => {
    it('should create a category', async () => {
      prismaMock.category.create.mockResolvedValue(categoryMock1);

      const res: Category = await service.createCategory(categoryMock1);

      expect(res).toBe(categoryMock1);
    });
  });

  describe('Find One Category', () => {
    it('should get created category by id', async () => {
      prismaMock.category.findUnique.mockResolvedValue(categoryMock1);

      const res: Category = await service.findOneCategory(categoryMock1.id);

      expect(res).toEqual(categoryMock1);
    });

    it('should not return if id or name is not provided', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      const res: Category = await service.findOneCategory();

      expect(res).toBeNull();
    });

    it('should return null if category was not found', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      const res: Category = await service.findOneCategory(falseId);

      expect(res).toBeNull();
    });

    it('should not get category when id is invalid', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      const res: Category = await service.findOneCategory('927a');

      expect(res).toBeNull();
    });
  });

  describe('Update Category', () => {
    it('should update category by id', async () => {
      prismaMock.category.update.mockResolvedValue({
        id: categoryMock1.id,
        name: 'Categoria1x',
        description: 'Categoria de test'
      });

      const name: string = 'Categoria1x';
      const description: string = 'Categoria de test';
      const res: Category = await service.updateCategory(categoryMock1.id, {name, description});

      expect(res).toStrictEqual({
        id: categoryMock1.id,
        name: 'Categoria1x',
        description: 'Categoria de test'
      });
    });

    it('should not update if category was not found', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      const res: Category = await service.findOneCategory(falseId);

      expect(res).toBeNull();
    });

    it('should not update category when id is invalid', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      const res: Category = await service.findOneCategory('927aaab2f05-80e4-d129a99aa825');

      expect(res).toBeNull();
    });
  });

  describe('Delete Category', () => {
    it('should delete category', async () => {
      prismaMock.category.delete.mockResolvedValue(categoryMock1);

      const res = await service.deleteCategory(categoryMock1.id);

      expect(res).toBe(categoryMock1);
    });

    it('should return null if category does not exist', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      const res: Category = await service.findOneCategory(falseId);

      expect(res).toBeNull();
    });

    it('should not delete category when id is invalid', async () => {
      prismaMock.category.findUnique.mockResolvedValue(null);

      const res: Category = await service.findOneCategory('927aaab2-7f05-80e4');

      expect(res).toBeNull();
    });
  });
});
