import { Test, TestingModule } from '@nestjs/testing';

import { ProductService } from './product.service';
import { ProductRepositoryI, ProductRepositoryToken } from '../../domain/interfaces';
import { ProductEntity } from '../../domain/entities/product.entity';
import { partialProductMock1, partialProductMock2, productMock1, productMock2, productMock3, productMock6 } from '../../domain/mocks/product.mock';
import { mockProductRepository } from '../../domain/mocks/product-providers.mock';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepositoryI;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepositoryToken,
          useValue: mockProductRepository
        }
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepositoryI>(ProductRepositoryToken);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Find All Products', () => {
    const { user_id } = productMock1;
    it('should fetch all products', async () => {
      jest.spyOn(repository, 'findAllProducts').mockResolvedValue([productMock1, productMock2, productMock3]);

      const res: Partial<ProductEntity>[] = await service.findAllProducts('0,10', user_id);

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock1, productMock2, productMock3]);
    });

    it('should fetch all products from pagination', async () => {
      jest.spyOn(repository, 'findAllProducts').mockResolvedValue([productMock2]);

      const res: Partial<ProductEntity>[] = await service.findAllProducts('1,1', user_id);

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock2]);
    });

    it('should fetch all products with some fields', async () => {
      jest.spyOn(repository, 'findAllProducts').mockResolvedValue([partialProductMock1, partialProductMock2]);

      const res: Partial<ProductEntity>[] = await service.findAllProducts('1,1', 'name, inventory_id');

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([partialProductMock1, partialProductMock2]);
    });
  });

  describe('Find One Product', () => {
    it('should find one product', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(productMock2);

      const res: Partial<ProductEntity> = await service.findOneProduct(productMock2.id, productMock2.user_id);

      expect(res).toBe(productMock2);
    });

    it('should find one product with some fields', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(partialProductMock1);

      const res: Partial<ProductEntity> = await service.findOneProduct(productMock1.id, productMock1.user_id, 'name, inventory_id');

      expect(res).toBe(partialProductMock1);
    });

    it('should return undefined if not the owner', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(productMock1);

      const res: Partial<ProductEntity> = await service.findOneProduct(productMock2.id, productMock2.user_id, 'name, inventory_id');

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(null);

      const res: Partial<ProductEntity> = await service.findOneProduct(productMock2.id, productMock2.user_id, 'name, inventory_id');

      expect(res).toBeNull();
    });
  });

  describe('Create Many Products', () => {
    it('should create many products', async () => {
      jest.spyOn(repository, 'createManyProducts').mockResolvedValue({ count: 2 });

      const res: number = await service.createManyProducts(productMock1.user_id, [
        {
          id:null,
          name: productMock1.name,
          price: productMock1.price,
        },
        {
          id:null,
          name: productMock2.name,
          price: productMock2.price,
        }
      ]);

      expect(res).toBe(2);
    });
  });

  describe('Create One Product', () => {
    it('should create a product', async () => {
      jest.spyOn(repository, 'createOneProduct').mockResolvedValue(productMock2);

      const { user_id, name, price } = productMock2;
      const res: ProductEntity = await service.createOneProduct(user_id, { name, price });

      expect(res).toBe(productMock2);
    });
  });

  describe('Update Product', () => {
    const { id, user_id } = productMock1;

    it('should update product', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(productMock1);
      jest.spyOn(repository,'updateProduct').mockResolvedValue(productMock6);

      const { name, price } = productMock2;
      const res: ProductEntity = await service.updateProduct(id, { name, price }, user_id);

      expect(res).toBe(productMock6);
    });

    it('should return undefined if not the owner', async () => {
      jest.spyOn(repository, 'updateProduct').mockResolvedValue(undefined);

      const { name, price } = productMock2;
      const res: Partial<ProductEntity> = await service.updateProduct(id, { name, price }, user_id);

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(null);
      //jest.spyOn(repository, 'updateProduct').mockResolvedValue(null);

      const { name, price } = productMock2;
      const res: ProductEntity = await service.updateProduct(id, { name, price }, user_id);

      expect(res).toBeNull()
    });
  });

  describe('Delete Product', () => {
    const { id, user_id } = productMock1;

    it('should delete product', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(productMock6);
      jest.spyOn(repository,'deleteProduct').mockResolvedValue(productMock6);

      const res: ProductEntity = await service.deleteProduct(id, user_id);

      expect(res).toBe(productMock6);
    });

    it('should return undefined if not the owner', async () => {
      jest.spyOn(repository, 'deleteProduct').mockResolvedValue(undefined);
      //jest.spyOn(repository, 'deleteProduct').mockResolvedValue(undefined);

      const res: Partial<ProductEntity> = await service.deleteProduct(id, user_id);

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(null);
      //jest.spyOn(repository, 'deleteProduct').mockResolvedValue(null);

      const res: ProductEntity = await service.deleteProduct(id, user_id);

      expect(res).toBeNull();
    });
  });
});
