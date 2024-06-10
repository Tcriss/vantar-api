import { Test, TestingModule } from '@nestjs/testing';

import { ProductController } from './product.controller';
import { ProductService } from '../../application/services/product.service';
import { mockProductService } from '../../domain/mocks/product-providers.mock';
import { partialProductMock1, partialProductMock2, productMock1, productMock2, productMock3, productMock4, productMock5, productMock6 } from '../../domain/mocks/product.mock';
import { ProductEntity } from '../../domain/entities/product.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProductResponse } from '../../domain/types';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ProductService, useValue: mockProductService}],
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('Find All Products', () => {
    it('should find all products', async () => {
      jest.spyOn(service, 'findAllProducts').mockResolvedValue([productMock1, productMock4, productMock5]);

      const res: Partial<ProductEntity>[] = await controller.findAll(productMock1.inventory_id, { page: '0,10' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock1, productMock4, productMock5]);
    });

    it('should find all products from pagination', async () => {
      jest.spyOn(service, 'findAllProducts').mockResolvedValue([productMock2]);

      const res: Partial<ProductEntity>[] = await controller.findAll(productMock1.inventory_id, { page: '0,10' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock2]);
    });

    it('should find all products with some fields', async () => {
      jest.spyOn(service, 'findAllProducts').mockResolvedValue([partialProductMock1, partialProductMock2]);

      const res: Partial<ProductEntity>[] = await controller.findAll(productMock1.inventory_id, { page: '0,10', selected: 'name, inventory_id' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([partialProductMock1, partialProductMock2]);
    });

    it('should throw an exception if page param was not provided', async () => {
      jest.spyOn(service, 'findAllProducts').mockResolvedValue([partialProductMock1, partialProductMock2]);

      try {
        await controller.findAll(productMock1.inventory_id, { page: null });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        expect(err.message).toBe('page query param is missing');
      }
    });
  });

  describe('Find One Product', () => {
    it('should find one product', async () => {
      jest.spyOn(service, 'findOneProduct').mockResolvedValue(productMock1);

      const res: Partial<ProductEntity> = await controller.findOne(productMock1.id);

      expect(res).toBe(productMock1)
    });

    it('should find one product with some fields', async () => {
      jest.spyOn(service, 'findOneProduct').mockResolvedValue(partialProductMock1);

      const res: Partial<ProductEntity> = await controller.findOne(productMock1.id, 'name, inventory_id');

      expect(res).toBe(partialProductMock1);
    });

    it('should throw an exception if product was not found', async () => {
      jest.spyOn(service, 'findOneProduct').mockResolvedValue(undefined);

      try {
        await controller.findOne(productMock1.id, 'name, inventory_id');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Product not found');
      }
    });
  });

  describe('Create Product', () => {
    it('should create a product', async () => {
      jest.spyOn(service, 'createProduct').mockResolvedValue(productMock2);

      const { name, inventory_id, stock, price, category_name, expiration, unit_measure } = productMock2;
      const res: ProductResponse = await controller.create({ name, inventory_id, stock, price, category_name, expiration, unit_measure });

      expect(res.message).toBe('Product created succesfully');
      expect(res.product).toBe(productMock2);
    });
  });

  describe('Update Product', () => {
    it('should update product', async () => {
      jest.spyOn(service,'updateProduct').mockResolvedValue(productMock6);

      const { name, stock, price, unit_measure } = productMock2;
      const res: ProductResponse = await controller.update(productMock1.id, { name, stock, price, unit_measure });

      expect(res.message).toBe('Product updated succesfully');
      expect(res.product).toBe(productMock6);
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'updateProduct').mockResolvedValue(null);

      const { name, stock, price, unit_measure } = productMock2;

      try {
        await controller.update(productMock1.id, { name, stock, price, unit_measure });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('Delete Product', () => {
    it('should delete product', async () => {
      jest.spyOn(service,'updateProduct').mockResolvedValue(productMock6);

      const res: ProductResponse = await controller.delete(productMock1.id);

      expect(res.message).toBe('Product deleted');
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'updateProduct').mockResolvedValue(null);

      try {
        await controller.delete(productMock1.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
