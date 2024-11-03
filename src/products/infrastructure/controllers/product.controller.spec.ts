import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

import { ProductController } from './product.controller';
import { ProductEntity } from '@products/domain/entities';
import { mockProductService, partialProductMock1, partialProductMock2, productMock1, productMock2, productMock6 } from '@products/domain/mocks';
import { ProductService } from '@products/application/services';
import { PrismaProvider } from '@database/infrastructure/providers';
import { prismaMock } from '@shops/domain/mocks';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService
        },
        {
          provide: PrismaProvider,
          useValue: prismaMock
        }
      ],
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

      const res: Partial<ProductEntity>[] = await controller.findAll({ page: 1, limit: 10, shop: '123' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock1, productMock6]);
    });

    it('should find all products from pagination', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([productMock2]);

      const res: Partial<ProductEntity>[] = await controller.findAll({ page: 1, limit: 10, shop: '123' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock2]);
    });

    it('should find all products with some fields', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([partialProductMock1, partialProductMock2]);

      const res: Partial<ProductEntity>[] = await controller.findAll({ page: 1, limit: 10, shop: '123' , selected: 'name, user_id' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([partialProductMock1, partialProductMock2]);
    });

    it('should throw an exception if page param was not provided', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([partialProductMock1, partialProductMock2]);

      try {
        await controller.findAll({ page: null, limit: null, shop: '123' });
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

      const res: Partial<ProductEntity> = await controller.findOne(productMock1.id);

      expect(res).toBe(productMock1)
    });

    it('should find one product with some fields', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(partialProductMock1);

      const res: Partial<ProductEntity> = await controller.findOne(productMock1.id, 'name, user_id');

      expect(res).toBe(partialProductMock1);
    });

    it('should throw an exception if product was not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      try {
        await controller.findOne(productMock1.id, 'name, user_id');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Product not found');
      }
    });

    it('should throw an exception if user is not owner', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      try {
        await controller.findOne(productMock2.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Product not found');
      }
    });
  });

  describe('Create Many Products', () => {
    it('should create many products', async () => {
      jest.spyOn(service, 'createMany').mockResolvedValue(2);

      const res = await controller.createMany([
        {
          shop_id: '123',
          name: productMock1.name,
          price: productMock1.price
        },
        {
          shop_id: '123',
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

      const { name, price, shop_id } = productMock2;
      const res = await controller.create({ name, price , shop_id});

      expect(res['message']).toBe('Product created successfully');
      expect(res['product']).toBe(productMock2);
    });

    it('should throw an exception if name has numbers', async () => {
      try {
        const { price, shop_id } = productMock2;
        await controller.create({ name: 'Albert0 Rojas4', price, shop_id });  
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
      const res = await controller.update(productMock1.id, { name, price });

      expect(res['message']).toBe('Product updated successfully');
      expect(res['product']).toBe(productMock6);
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(null);

      const { name, price } = productMock2;

      try {
        await controller.update(productMock1.id, { name, price });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an exception if user is not owner', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(undefined);

      try {
        const { name, price } = productMock2;
        await controller.update(productMock2.id, { name, price });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Product not found');
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

      const res = await controller.delete(productMock1.id);

      expect(res['message']).toBe('Product deleted');
    });

    it('should throw an exception if product was not found', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(null);

      try {
        await controller.delete(productMock1.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an exception if user is not owner', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      try {
        await controller.delete(productMock2.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Product not found');
      }
    });
  });
});
