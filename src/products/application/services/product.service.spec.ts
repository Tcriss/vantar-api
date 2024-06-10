import { Test, TestingModule } from '@nestjs/testing';

import { ProductService } from './product.service';
import { ProductRepository } from '../repositories/product.repository';
import { ProductEntity } from '../../domain/entities/product.entity';
import { partialProductMock1, partialProductMock2, productMock1, productMock2, productMock3, productMock6 } from '../../domain/mocks/product.mock';
import { mockProductRepository } from '../../domain/mocks/product-providers.mock';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository
        }
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Find All Products', () => {
    it('should fetch all products', async () => {
      jest.spyOn(repository, 'findAllProducts').mockResolvedValue([productMock1, productMock2, productMock3]);

      const res: Partial<ProductEntity>[] = await service.findAllProducts('0,10');

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock1, productMock2, productMock3]);
    });

    it('should fetch all products from pagination', async () => {
      jest.spyOn(repository, 'findAllProducts').mockResolvedValue([productMock2]);

      const res: Partial<ProductEntity>[] = await service.findAllProducts('1,1');

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
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(productMock1);

      const res: Partial<ProductEntity> = await service.findOneProduct(productMock1.id);

      expect(res).toBe(productMock1)
    });

    it('should find one product with some fields', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(partialProductMock1);

      const res: Partial<ProductEntity> = await service.findOneProduct(productMock1.id, 'name, inventory_id');

      expect(res).toBe(partialProductMock1);
    });

    it('should retunr undefined if product was not found', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(undefined);

      const res: Partial<ProductEntity> = await service.findOneProduct(productMock1.id, 'name, inventory_id');

      expect(res).toBe(undefined);
    });
  });

  describe('Cteate Product', () => {
    it('should create a product', async () => {
      jest.spyOn(repository, 'createProduct').mockResolvedValue(productMock2);

      const { name, inventory_id, stock, price, category_name, expiration, unit_measure } = productMock2;
      const res: ProductEntity = await service.createProduct({ name, inventory_id, stock, price, category_name, expiration, unit_measure });

      expect(res).toBe(res);
    });
  });

  describe('Update Product', () => {
    it('should update product', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(productMock6);
      jest.spyOn(repository,'updateProduct').mockResolvedValue(productMock6);

      const { name, stock, price, unit_measure } = productMock2;
      const res: ProductEntity = await service.updateProduct(productMock1.id, { name, stock, price, unit_measure });

      expect(res).toBe(productMock6);
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(null);
      jest.spyOn(repository, 'updateProduct').mockResolvedValue(null);

      const { name, stock, price, unit_measure } = productMock2;
      const res: ProductEntity = await service.updateProduct('2323', { name, stock, price, unit_measure });

      expect(res).toBe(null)
    });
  });

  describe('Delete Product', () => {
    it('should delete product', async () => {
      jest.spyOn(repository, 'findOneProduct').mockResolvedValue(productMock6);
      jest.spyOn(repository,'deleteProduct').mockResolvedValue(productMock6);

      const res: ProductEntity = await service.deleteProduct(productMock1.id);

      expect(res).toBe(productMock6);
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(repository, 'deleteProduct').mockResolvedValue(null);

      const res: ProductEntity = await service.deleteProduct('2323');

      expect(res).toBe(null)
    });
  });
});
