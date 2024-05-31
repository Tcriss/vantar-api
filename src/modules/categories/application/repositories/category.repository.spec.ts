import { Test, TestingModule } from '@nestjs/testing';
import { Category, Prisma } from '@prisma/client';

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

    describe('read', () => {
        it('should read a category by id', async () => {
          jest.spyOn(prisma.category, 'findUnique').mockResolvedValue(category);
    
          const result = await repository.read('1');

          expect(result).toEqual(category);
          expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
        });
    
        it('should read a category by name', async () => {
          jest.spyOn(prisma.category, 'findUnique').mockResolvedValue(category);
    
          const result = await repository.read(undefined, 'Test');

          expect(result).toEqual(category);
          expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { name: 'Test' } });
        });
      });
    
      describe('readMany', () => {
        it('should read many categories with a query', async () => {
          jest.spyOn(prisma.category, 'findMany').mockResolvedValue(categories);
    
          const result = await repository.readMany('Test');

          expect(result).toEqual(categories);
          expect(prisma.category.findMany).toHaveBeenCalledWith({
            where: { name: { contains: 'Test' } },
            orderBy: { name: 'desc' },
          });
        });
    
        it('should read many categories without a query', async () => {
          jest.spyOn(prisma.category, 'findMany').mockResolvedValue(categories);
    
          const result = await repository.readMany();

          expect(result).toEqual(categories);
          expect(prisma.category.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
        });
      });

      describe('readMany', () => {
        it('should read many categories with a query', async () => {
          jest.spyOn(prisma.category, 'findMany').mockResolvedValue(categories);
    
          const result = await repository.readMany('Test');

          expect(result).toEqual(categories);
          expect(prisma.category.findMany).toHaveBeenCalledWith({
            where: { name: { contains: 'Test' } },
            orderBy: { name: 'desc' },
          });
        });
    
        it('should read many categories without a query', async () => {
          jest.spyOn(prisma.category, 'findMany').mockResolvedValue(categories);
    
          const result = await repository.readMany();

          expect(result).toEqual(categories);
          expect(prisma.category.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
        });
      });

      describe('create', () => {
        it('should create a category', async () => {
          const category: Partial<Category> = { name: 'Test', description: 'Test' };
          const createdCategory: Category = { id: '1', name: 'Test', description: 'Test' };

          jest.spyOn(prisma.category, 'create').mockResolvedValue(createdCategory);
    
          const result = await repository.create(category);

          expect(result).toEqual(createdCategory);
          expect(prisma.category.create).toHaveBeenCalledWith({ data: category });
        });
      });

      describe('createMany', () => {
        it('should create many categories', async () => {
          const categories: Category[] = [{ id: '1', name: 'Test1', description: 'Test1' }, { id: '2', name: 'Test2', description: 'Test2' }];
          const batchPayload: Prisma.BatchPayload = { count: categories.length };

          jest.spyOn(prisma.category, 'createMany').mockResolvedValue(batchPayload);
    
          const result = await repository.createMany(categories);

          expect(result).toEqual(batchPayload);
          expect(prisma.category.createMany).toHaveBeenCalledWith({
            data: categories,
            skipDuplicates: true,
          });
        });
      });
    
      describe('update', () => {
        it('should update a category', async () => {
          const updatedCategory: Partial<Category> = { name: 'Updated Test', description: 'Updated Test' };
          const resultCategory: Category = { id: '1', name: 'Updated Test', description: 'Updated Test' };

          jest.spyOn(prisma.category, 'update').mockResolvedValue(resultCategory);
    
          const result = await repository.update('1', updatedCategory);

          expect(result).toEqual(resultCategory);
          expect(prisma.category.update).toHaveBeenCalledWith({
            where: { id: '1' },
            data: updatedCategory,
          });
        });
      });
    
      describe('delete', () => {
        it('should delete a category', async () => {
          jest.spyOn(prisma.category, 'delete').mockResolvedValue(category);
    
          const result = await repository.delete('1');

          expect(result).toEqual(category);
          expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: '1' } });
        });
      });
});