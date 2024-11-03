import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';

import { ProductService } from './product.service';
import { ProductEntity } from '@products/domain/entities';
import { partialProductMock1, partialProductMock2, productMock1, productMock2, productMock3, productMock6, mockProductRepository } from '@products/domain/mocks';
import { Repository } from '@common/domain/entities';
import { InvoiceProductList } from '@invoices/domain/types';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: Repository<InvoiceProductList>,
          useValue: mockProductRepository
        }
      ],
      imports: [CacheModule.register({ ttl: (60 ^ 2) * 1000 })]
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(Repository<InvoiceProductList>);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Find All Products', () => {
    it('should fetch all products', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([productMock1, productMock2, productMock3]);

      const res: Partial<ProductEntity>[] = await service.findAll('123', { take: 10, skip: 0 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock1, productMock2, productMock3]);
    });

    it('should fetch all products from pagination', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([productMock2]);

      const res: Partial<ProductEntity>[] = await service.findAll('123', { take: 10, skip: 0 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock2]);
    });

    it('should fetch all products with some fields', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([partialProductMock1, partialProductMock2]);

      const res: Partial<ProductEntity>[] = await service.findAll('123', { take: 10, skip: 0 }, 'name, inventory_id');

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([partialProductMock1, partialProductMock2]);
    });
  });

  describe('Find One Product', () => {
    it('should find one product', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(productMock2);

      const res: Partial<ProductEntity> = await service.findOne(productMock2.id);

      expect(res).toBe(productMock2);
    });

    it('should find one product with some fields', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(partialProductMock1);

      const res: Partial<ProductEntity> = await service.findOne(productMock1.id, 'name, inventory_id');

      expect(res).toBe(partialProductMock1);
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const res: Partial<ProductEntity> = await service.findOne(productMock2.id, 'name, inventory_id');

      expect(res).toBeNull();
    });
  });

  describe('Create Many Products', () => {
    it('should create many products', async () => {
      jest.spyOn(repository, 'createMany').mockResolvedValue({ count: 2 });

      const res: number = await service.createMany([
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
      jest.spyOn(repository, 'create').mockResolvedValue(productMock2);

      const { name, price } = productMock2;
      const res: ProductEntity = await service.create({ name, price });

      expect(res).toBe(productMock2);
    });
  });

  describe('Update Product', () => {
    const { id } = productMock1;

    it('should update product', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(productMock1);
      jest.spyOn(repository,'update').mockResolvedValue(productMock6);

      const { name, price } = productMock2;
      const res: ProductEntity = await service.update(id, { name, price });

      expect(res).toBe(productMock6);
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      //jest.spyOn(repository, 'updateProduct').mockResolvedValue(null);

      const { name, price } = productMock2;
      const res: ProductEntity = await service.update(id, { name, price });

      expect(res).toBeNull()
    });
  });

  describe('Delete Product', () => {
    const { id } = productMock1;

    it('should delete product', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(productMock6);
      jest.spyOn(repository,'delete').mockResolvedValue(productMock6);

      const res: ProductEntity = await service.delete(id);

      expect(res).toBe(productMock6);
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      //jest.spyOn(repository, 'deleteProduct').mockResolvedValue(null);

      const res: ProductEntity = await service.delete(id);

      expect(res).toBeNull();
    });
  });
});
