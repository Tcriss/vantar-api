import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

import { ProductController } from './product.controller';
import { ProductService } from '../../application/services/product.service';
import { mockProductService } from '../../domain/mocks/product-providers.mock';
import { partialProductMock1, partialProductMock2, productMock1, productMock2, productMock6 } from '../../domain/mocks/product.mock';
import { ProductEntity } from '../../domain/entities/product.entity';
import { Roles } from '../../../common/domain/enums';

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
      jest.spyOn(service, 'findAll').mockResolvedValue([productMock1, productMock6]);

      const res: Partial<ProductEntity>[] = await controller.findAll({
        user: {
          id: productMock1.user_id,
          name: '',
          email: '',
          role: Roles.CUSTOMER
        }
      } as unknown as Request, { page: 1, limit: 10 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock1, productMock6]);
    });

    it('should find all products from pagination', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([productMock2]);

      const res: Partial<ProductEntity>[] = await controller.findAll({
        user: {
          id: productMock1.user_id,
          name: '',
          email: '',
          role: Roles.CUSTOMER
        }
      } as unknown as Request, { page: 1, limit: 10 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock2]);
    });

    it('should find all products with some fields', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([partialProductMock1, partialProductMock2]);

      const res: Partial<ProductEntity>[] = await controller.findAll({
        user: {
          id: productMock1.user_id,
          name: '',
          email: '',
          role: Roles.CUSTOMER
        }
      } as unknown as Request, { page: 1, limit: 10, selected: 'name, user_id' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([partialProductMock1, partialProductMock2]);
    });

    it('should throw an exception if page param was not provided', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([partialProductMock1, partialProductMock2]);

      try {
        await controller.findAll({
          user: {
            id: productMock1.user_id,
            name: '',
            email: '',
            role: Roles.CUSTOMER
          }
        } as unknown as Request, { page: null });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        expect(err.message).toBe("'page' or 'limit' param missing");
      }
    });
  });

  describe('Find One Product', () => {
    it('should find one product', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(productMock1);

      const res: Partial<ProductEntity> = await controller.findOne(productMock1.id, {
        user: {
          id: productMock1.user_id,
          email: '',
          name: '',
          role: Roles.CUSTOMER
        }
      } as unknown as Request);

      expect(res).toBe(productMock1)
    });

    it('should find one product with some fields', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(partialProductMock1);

      const res: Partial<ProductEntity> = await controller.findOne(productMock1.id, {
        user: {
          id: productMock1.user_id,
          email: '',
          name: '',
          role: Roles.CUSTOMER
        }
      } as unknown as Request, 'name, user_id');

      expect(res).toBe(partialProductMock1);
    });

    it('should throw an exception if product was not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      try {
        await controller.findOne(productMock1.id, {
          user: {
            id: productMock1.user_id,
            email: '',
            name: '',
            role: Roles.CUSTOMER
          }
        } as unknown as Request, 'name, user_id');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Product not found');
      }
    });

    it('should throw an exception if user is not owner', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      try {
        await controller.findOne(productMock2.id, {
          user: {
            id: productMock1.user_id,
            email: '',
            name: '',
            role: Roles.CUSTOMER
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe('Not enough permissions');
      }
    });
  });

  describe('Create Many Products', () => {
    it('should create many products', async () => {
      jest.spyOn(service, 'createMany').mockResolvedValue(2);

      const res = await controller.createMany({
        user: {
          id: productMock1.user_id,
          name: '',
          email: '',
          role: Roles.CUSTOMER
        }
      } as unknown as Request, [
        {
          name: productMock1.name,
          price: productMock1.price
        },
        {
          name: productMock2.name,
          price: productMock2.price
        }
      ]);

      expect(res['message']).toBe('Products created successfully');
      expect(res['count']).toBe(2);
    });
  });

  describe('Create One Product', () => {
    it('should create a product', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(productMock2);

      const { name, price } = productMock2;
      const res = await controller.create({
        user: {
          id: productMock1.user_id,
          name: '',
          email: '',
          role: Roles.CUSTOMER
        }
      } as unknown as Request, { name, price });

      expect(res['message']).toBe('Product created successfully');
      expect(res['product']).toBe(productMock2);
    });

    it('should throw an exception if name has numbers', async () => {
      try {
        const { price, user_id } = productMock2;
        await controller.create({
          user: {
            id: user_id,
            name: '',
            email: '',
            role: Roles.CUSTOMER
          }
        } as unknown as Request,
        { name: 'Albert0 Rojas4', price });  
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe(['name must not contain numbers']);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('Update Product', () => {
    it('should update product', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(productMock1);
      jest.spyOn(service,'update').mockResolvedValue(productMock6);

      const { name, price } = productMock2;
      const res = await controller.update(productMock1.id, {
        user: {
          id: productMock1.user_id,
          email: '',
          name: '',
          role: Roles.CUSTOMER
        }
      } as unknown as Request, { name, price });

      expect(res['message']).toBe('Product updated successfully');
      expect(res['product']).toBe(productMock6);
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(null);

      const { name, price } = productMock2;

      try {
        await controller.update(productMock1.id, {
          user: {
            id: productMock1.user_id,
            email: '',
            name: '',
            role: Roles.CUSTOMER
          }
        } as unknown as Request, { name, price });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an exception if user is not owner', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(undefined);

      try {
        const { name, price } = productMock2;
        await controller.update(productMock2.id, {
          user: {
            id: productMock1.user_id,
            email: '',
            name: '',
            role: Roles.CUSTOMER
          }
        } as unknown as Request, { name, price });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe('Not enough permissions');
      }
    });

    // it('should throw an exception if name has numbers', async () => {
    //   try {
    //     const { user_id, id } = productMock2;
    //     await controller.update(id, {
    //       user: {
    //         id: user_id,
    //         name: '',
    //         email: '',
    //         role: Roles.CUSTOMER
    //       }
    //     } as unknown as Request,
    //     { name: 'Albert0 Rojas4' });  
    //   } catch (err) {
    //     expect(err).toBeInstanceOf(BadRequestException);
    //     expect(err.message).toBe(['name must not contain numbers']);
    //     expect(err.status).toBe(HttpStatus.BAD_REQUEST);
    //   }
    // });
  });

  describe('Delete Product', () => {
    it('should delete product', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(productMock1);
      jest.spyOn(service,'delete').mockResolvedValue(productMock1);

      const res = await controller.delete(productMock1.id, {
        user: {
          id: productMock1.user_id,
          email: '',
          name: '',
          role: Roles.CUSTOMER
        }
      } as unknown as Request);

      expect(res['message']).toBe('Product deleted');
    });

    it('should throw an exception if product was not found', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(null);

      try {
        await controller.delete(productMock1.id, {
          user: {
            id: productMock1.user_id,
            email: '',
            name: '',
            role: Roles.CUSTOMER
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an exception if user is not owner', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      try {
        await controller.delete(productMock2.id, {
          user: {
            id: productMock1.user_id,
            email: '',
            name: '',
            role: Roles.CUSTOMER
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe('Not enough permissions');
      }
    });
  });
});
