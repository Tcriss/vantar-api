import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { ObjectId } from 'mongodb';

import { InventoryService } from './inventory.service';
import { mockInventory1, mockInventory2, mockInventory3, mockPartialInventory1, mockInventoryRepository } from '@inventories/domain/mocks';
import { InventoryProductList } from '@inventories/domain/types';
import { InventoryEntity } from '@inventories/domain/entities';
import { Repository } from '@common/domain/entities';
import { mockProductListRepository } from '@products/domain/mocks';
import { ProductEntityList } from '@products/domain/entities';
import { ProductListRepositoryToken } from '@products/application/decotators';


describe('InventoryService', () => {
  let service: InventoryService;
  let repository: Repository<InventoryEntity>;
  let productListRepository: Repository<InventoryProductList>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: Repository<InventoryEntity>,
          useValue: mockInventoryRepository
        },
        {
          provide: ProductListRepositoryToken,
          useValue: mockProductListRepository
        },
      ],
      imports: [CacheModule.register({ ttl: (60 ^ 2) * 1000 })]
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repository = module.get<Repository<InventoryEntity>>(Repository<InventoryEntity>);
    productListRepository = module.get<Repository<InventoryProductList>>(ProductListRepositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find All Inventories', () => {
    it('should fetch all inventories', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([ mockInventory1, mockInventory3 ]);

      const res: Partial<InventoryEntity>[] = await service.findAllInventories('123', { take: 10, skip: 0 });

      expect(res).toStrictEqual([ mockInventory1, mockInventory3 ]);
    });

    it('should fetch some fields', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([ mockPartialInventory1 ]);

      const res: Partial<InventoryEntity>[] = await service.findAllInventories('123', { take: 10, skip: 0 }, 'company_name, products_amount, id');

      expect(res).toStrictEqual([ mockPartialInventory1 ]);
    });
  });

  describe('Find One Inventory', () => {
    it('should find an inventory by its id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInventory1);
      jest.spyOn(productListRepository, 'findOne').mockResolvedValue({
        id: mockInventory1.id,
        products: mockInventory1.products as ProductEntityList[]
      });

      const { id } = mockInventory1; 
      const res: Partial<InventoryEntity> = await service.findOneInventory(id);

      expect(res).toEqual(mockInventory1);
    });

    it('should get some fields', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPartialInventory1);
      jest.spyOn(productListRepository, 'findOne').mockResolvedValue({
        id: mockInventory1.id,
        products: mockInventory1.products as ProductEntityList[]
      });

      const { id } = mockInventory1; 
      const res: Partial<InventoryEntity> = await service.findOneInventory(id, 'id, products_amount, company_name');

      expect(res).toBe(mockPartialInventory1);
    });

    it('should return null if inventory not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const { id } = mockInventory2;
      const res: Partial<InventoryEntity> = await service.findOneInventory(id);

      expect(res).toBeNull();
    });
  });

  describe('Create Inventory', () => {
    it('should create an inventory', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(mockInventory2);
      jest.spyOn(productListRepository, 'insert').mockResolvedValue({
        insertedId: new ObjectId(),
        acknowledged: true
      });

      const { shop_id, cost, products } = mockInventory2;
      const res: InventoryEntity = await service.createInventory({ shop_id, cost, products });

      expect(res).toBe(mockInventory2);
    });
  });

  describe('Update Inventory', () => {
    it('should update inventory', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInventory2);
      jest.spyOn(productListRepository, 'updateDoc').mockResolvedValue({
        upsertedId: new ObjectId(),
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0
      });
      jest.spyOn(repository, 'update').mockResolvedValue(mockInventory3);

      const { cost, products } = mockInventory2;
      const res: InventoryEntity = await service.updateInventory(mockInventory1.id, { cost, products });

      expect(res).toBe(mockInventory3);
    });

    it('should return null if inventory was not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      //jest.spyOn(repository, 'updateInventory').mockResolvedValue(null);

      const { cost, products } = mockInventory2;
      const res: InventoryEntity = await service.updateInventory(mockInventory2.id, { products, cost });

      expect(res).toBeNull();
    });
  });

  describe('Delete Inventory', () => {
    it('should delete iventory', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInventory3);
      jest.spyOn(repository, 'delete').mockResolvedValue(mockInventory3);
      jest.spyOn(productListRepository, 'deleteDoc').mockResolvedValue({
        deletedCount: 1,
        acknowledged: true
      })

      const { id } = mockInventory3;
      const res: InventoryEntity = await service.deleteInventory(id);

      expect(res).toBe(mockInventory3);
    });

    it('should return undefined if inventory was not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(productListRepository, 'findOne').mockResolvedValue(null);
      //jest.spyOn(repository, 'deleteInventory').mockResolvedValue(null);

      const { id } = mockInventory3;
      const res: InventoryEntity = await service.deleteInventory(id);

      expect(res).toBeNull();
    });
  });
})
