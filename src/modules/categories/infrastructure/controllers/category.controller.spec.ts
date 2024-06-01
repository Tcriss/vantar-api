import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Category } from '@prisma/client';

import { CategoryController } from './category.controller';
import { CategoryService } from '../../application/services/category.service';
import { CreateCategoryDTO } from '../dtos/create-category.dto';
import { EditCategoryDTO } from '../dtos/edit-category.dto';
import { mockCategoryService } from '../../domain/mocks/category-providers.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result: Category[] = [
        { 
          id: '1', 
          name: 'Test', 
          description: 'Test' 
        }
      ];
      jest.spyOn(service, 'findAllCategories').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('Find One', () => {
    it('should return a category', async () => {
      const result: Category = { id: '1', name: 'Test', description: 'Test' };
      jest.spyOn(service, 'findOneCategory').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });

    it('should throw an exception if category not found', async () => {
      jest.spyOn(service, 'findOneCategory').mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(HttpException);
    });

    it('should throw an exception if category id is invalid', async () => {
      jest.spyOn(service, 'findOneCategory').mockRejectedValue(
        new HttpException('id must be in uuid format', HttpStatus.BAD_REQUEST)
      );

      await expect(controller.findOne('1')).rejects.toThrow(HttpException);
    });
  });

  describe('Find One By Name', () => {
    it('should return a category by name', async () => {
      const result: Category = { id: '1', name: 'Test', description: 'Test' };
      jest.spyOn(service, 'findOneCategory').mockResolvedValue(result);

      expect(await controller.findOneByName('Test')).toBe(result);
    });

    it('should throw an exception if category not found by name', async () => {
      jest.spyOn(service, 'findOneCategory').mockResolvedValue(null);

      await expect(controller.findOneByName('Test')).rejects.toThrow(HttpException);
    });
  });

  describe('Create', () => {
    it('should create a category', async () => {
      const dto: CreateCategoryDTO = { name: 'Test', description: 'Test' };
      const result: Category = { id: '1', name: 'Test', description: 'Test' };
      jest.spyOn(service, 'createCategory').mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
    });
  });

  describe('Update', () => {
    it('should update a category', async () => {
      const dto: EditCategoryDTO = { name: 'Updated Test', description: 'Updated Test' };
      const result: Category = { id: '1', name: 'Updated Test', description: 'Updated Test' };
      jest.spyOn(service, 'updateCategory').mockResolvedValue(result);

      expect(await controller.update('1', dto)).toBe(result);
    });

    it('should throw an exception if category not found for update', async () => {
      jest.spyOn(service, 'updateCategory').mockResolvedValue(null);

      await expect(controller.update('1', { name: 'Test', description: 'Test' })).rejects.toThrow(HttpException);
    });

    it('should throw an exception if category id is invalid', async () => {
      jest.spyOn(service, 'updateCategory').mockRejectedValue(
        new HttpException('id must be in uuid format', HttpStatus.BAD_REQUEST)
      );

      await expect(controller.findOne('1')).rejects.toThrow(HttpException);
    });
  });

  describe('Delete', () => {
    it('should delete a category', async () => {
      const result: Category = { id: '1', name: 'Test', description: 'Test' };
      jest.spyOn(service, 'deleteCategory').mockResolvedValue(result);

      expect(await controller.delete('1')).toBe('Category deleted');
    });

    it('should throw an exception if category not deleted', async () => {
      jest.spyOn(service, 'deleteCategory').mockResolvedValue(null);

      await expect(controller.delete('1')).rejects.toThrow(HttpException);
    });

    it('should throw an exception if category id is invalid', async () => {
      jest.spyOn(service, 'deleteCategory').mockRejectedValue(
        new HttpException('id must be in uuid format', HttpStatus.BAD_REQUEST)
      );

      await expect(controller.findOne('1')).rejects.toThrow(HttpException);
    });
  });
});
