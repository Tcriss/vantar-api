import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { CategoryController } from './category.controller';
import { CategoryService } from '../../application/services/category.service';
import { CategoryRepository } from '../../application/repositories/category.repository';
import { PrismaProvider } from 'src/modules/prisma/providers/prisma.provider';
import { prismaMock } from '../../domain/mocks/prisma.mock';
import { Category } from '@prisma/client';
import { categoryList } from '../../domain/mocks/categories-list.mock';
import { categoryMock, categoryMock1 } from '../../domain/mocks/category.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  const falseId: string = '839611b3-a078-4751-8f18-44d8752f749f';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        CategoryRepository,
        {
          provide: PrismaProvider,
          useValue: prismaMock
        }
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find All Categories', () => {
    it('should return all categories', async () => {
      prismaMock.category.findMany.mockResolvedValue(categoryList);

      const categories: Category[] = await controller.findAll();

      expect(categories).toBe(categoryList);
    });
  });

  describe('Find One Category', () => {
    it('Should return a category by its id', async () => {
      prismaMock.category.findUnique.mockResolvedValue(categoryMock1);

      const category: Category = await controller.findOne(categoryMock1.id);

      expect(category).toBe(categoryMock1);
    });

    it('Should return a category by its name', async () => {
      prismaMock.category.findUnique.mockResolvedValue(categoryMock1);

      const category: Category = await controller.findOneByName(categoryMock1.name);

      expect(category).toBe(categoryMock1);
    });

    it('Should return a not found message if category does not exist', async () => {
      prismaMock.category.findUnique.mockRejectedValue(
        new HttpException('Category not found', HttpStatus.NOT_FOUND)
      );

      try {
        await controller.findOne(falseId);
      } catch(err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toEqual('Category not found');
        expect(err.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('Create Category', () => {
    it('should create a category', async () => {
      prismaMock.category.create.mockResolvedValue(categoryMock1);

      const { name, description } = categoryMock1;
      const res: Category = await controller.create({ name, description });

      expect(res).toBe(categoryMock1);
    });

    it('should send bad request if fields are missing', async () => {
      prismaMock.category.create.mockResolvedValue({
        message: [
          "name should not be empty",
          "description should not be empty"
        ],
        error: "Bad Request",
        statusCode: 400
      });

      const {name, description} = { name: '', description: '' };
      const res: Category = await controller.create({ name, description });

      expect(res).toStrictEqual({
        message: [
          "name should not be empty",
          "description should not be empty"
        ],
        error: "Bad Request",
        statusCode: 400
      });
    });
  });

  describe('Update Category', () => {
    it('should updates a category', async () => {
      prismaMock.category.update.mockResolvedValue({
        id: categoryMock1.id,
        ...categoryMock
      });

      const { name, description } = categoryMock;
      const res: Category = await controller.update(categoryMock.id, { name, description });

      expect(res).toEqual({
        id: categoryMock1.id,
        ...categoryMock
      });
    });
  });

  describe('Delete Category', () => {
    it('should deletes a category', async () => {
      prismaMock.category.delete.mockResolvedValue('Category deleted');

      const res: string = await controller.delete(categoryMock.id);

      expect(res).toBe('Category deleted');
    });

    it('should not delete if category was not found', async () => {
      try {
          await controller.delete(falseId);
      } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toBe('Category not found');
          expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
