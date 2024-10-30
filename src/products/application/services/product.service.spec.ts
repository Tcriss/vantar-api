import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';

import { ProductService } from './product.service';
import { ProductEntity } from '../../domain/entities/product.entity';
import { partialProductMock1, partialProductMock2, productMock1, productMock2, productMock3, productMock6 } from '../../domain/mocks/product.mock';
import { mockProductRepository } from '../../domain/mocks/product-providers.mock';
import { Repository } from '../../../common/domain/entities';
import { InvoiceProductList } from '../../../invoices/domain/types';

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
    const { user_id } = productMock1;
    it('should fetch all products', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([productMock1, productMock2, productMock3]);

      const res: Partial<ProductEntity>[] = await service.findAll({ take: 10, skip: 0 }, user_id);

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock1, productMock2, productMock3]);
    });

    it('should fetch all products from pagination', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([productMock2]);

      const res: Partial<ProductEntity>[] = await service.findAll({ take: 10, skip: 0 }, user_id);

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([productMock2]);
    });

    it('should fetch all products with some fields', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([partialProductMock1, partialProductMock2]);

      const res: Partial<ProductEntity>[] = await service.findAll({ take: 10, skip: 0 }, 'name, inventory_id');

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([partialProductMock1, partialProductMock2]);
    });
  });

  describe('Find One Product', () => {
    it('should find one product', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(productMock2);

      const res: Partial<ProductEntity> = await service.findOne(productMock2.id, productMock2.user_id);

      expect(res).toBe(productMock2);
    });

    it('should find one product with some fields', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(partialProductMock1);

      const res: Partial<ProductEntity> = await service.findOne(productMock1.id, productMock1.user_id, 'name, inventory_id');

      expect(res).toBe(partialProductMock1);
    });

    it('should return undefined if not the owner', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(productMock1);

      const res: Partial<ProductEntity> = await service.findOne(productMock2.id, productMock2.user_id, 'name, inventory_id');

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const res: Partial<ProductEntity> = await service.findOne(productMock2.id, productMock2.user_id, 'name, inventory_id');

      expect(res).toBeNull();
    });
  });

  describe('Create Many Products', () => {
    it('should create many products', async () => {
      jest.spyOn(repository, 'createMany').mockResolvedValue({ count: 2 });

      const res: number = await service.createMany(productMock1.user_id, [
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

      const { user_id, name, price } = productMock2;
      const res: ProductEntity = await service.create(user_id, { name, price });

      expect(res).toBe(productMock2);
    });
  });

  describe('Update Product', () => {
    const { id, user_id } = productMock1;

    it('should update product', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(productMock1);
      jest.spyOn(repository,'update').mockResolvedValue(productMock6);

      const { name, price } = productMock2;
      const res: ProductEntity = await service.update(id, user_id, { name, price });

      expect(res).toBe(productMock6);
    });

    it('should return undefined if not the owner', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);

      const { name, price } = productMock2;
      const res: Partial<ProductEntity> = await service.update(id, user_id, { name, price });

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      //jest.spyOn(repository, 'updateProduct').mockResolvedValue(null);

      const { name, price } = productMock2;
      const res: ProductEntity = await service.update(id, user_id, { name, price });

      expect(res).toBeNull()
    });
  });

  describe('Delete Product', () => {
    const { id, user_id } = productMock1;

    it('should delete product', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(productMock6);
      jest.spyOn(repository,'delete').mockResolvedValue(productMock6);

      const res: ProductEntity = await service.delete(id, user_id);

      expect(res).toBe(productMock6);
    });

    it('should return undefined if not the owner', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(productMock1);
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
      //jest.spyOn(repository, 'deleteProduct').mockResolvedValue(undefined);

      const res: Partial<ProductEntity> = await service.delete(id, user_id);

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      //jest.spyOn(repository, 'deleteProduct').mockResolvedValue(null);

      const res: ProductEntity = await service.delete(id, user_id);

      expect(res).toBeNull();
    });
  });
});
