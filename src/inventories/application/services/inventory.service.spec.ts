import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';

import { InventoryService } from './inventory.service';
import { mockInventoryRepository } from '../../domain/mocks/inventory-providers.mock';
import { mockInventory1, mockInventory2, mockInventory3, mockPartialInventory1 } from '../../domain/mocks/inventory.mock';
import { mockProductListRepository } from '../../../products/domain/mocks/product-providers.mock';
import { InventoryProductList } from '../../domain/types/inventory-prodcut-list.type';
import { InvoiceProductList } from '../../../invoices/domain/types';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { ProductList } from '../../../products/domain/entities/product-list.entity';
import { Repository } from '../../../common/domain/entities';


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
          provide: Repository<InvoiceProductList>,
          useValue: mockProductListRepository
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repository = module.get<Repository<InventoryEntity>>(Repository<InventoryEntity>);
    productListRepository = module.get<Repository<InventoryProductList>>(Repository<InvoiceProductList>);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find All Inventories', () => {
    it('should fetch all inventories', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([ mockInventory1, mockInventory3 ]);

      const res: Partial<InventoryEntity>[] = await service.findAllInventories('be702a7b-13a3-4e03-93f6-65b2a82e1905', '0,3');

      expect(res).toStrictEqual([ mockInventory1, mockInventory3 ]);
    });

    it('should fetch some fields', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([ mockPartialInventory1 ]);

      const res: Partial<InventoryEntity>[] = await service.findAllInventories('be702a7b-13a3-4e03-93f6-65b2a82e1905', '0,3', 'company_name, products_amount, id');

      expect(res).toStrictEqual([ mockPartialInventory1 ]);
    });
  });

  describe('Find One Inventory', () => {
    it('should find an inventory by its id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInventory1);
      jest.spyOn(productListRepository, 'findOne').mockResolvedValue({
        id: mockInventory1.id,
        products: mockInventory1.products as ProductList[]
      });

      const { id, user_id } = mockInventory1; 
      const res: Partial<InventoryEntity> = await service.findOneInventory(id, user_id);

      expect(res).toEqual(mockInventory1);
    });

    it('should get some fields', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPartialInventory1);
      jest.spyOn(productListRepository, 'findOne').mockResolvedValue({
        id: mockInventory1.id,
        products: mockInventory1.products as ProductList[]
      });

      const { id, user_id } = mockInventory1; 
      const res: Partial<InventoryEntity> = await service.findOneInventory(id, user_id, 'id, products_amount, company_name');

      expect(res).toBe(mockPartialInventory1);
    });

    it('should return null if inventory not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const { id, user_id } = mockInventory2;
      const res: Partial<InventoryEntity> = await service.findOneInventory(id, user_id);

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

      const { user_id, cost, products } = mockInventory2;
      const res: InventoryEntity = await service.createInventory({ user_id, cost, products });

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

      const { cost, user_id, products } = mockInventory2;
      const res: InventoryEntity = await service.updateInventory(mockInventory1.id, { cost, products }, user_id);

      expect(res).toBe(mockInventory3);
    });

    it('should return null if inventory was not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      //jest.spyOn(repository, 'updateInventory').mockResolvedValue(null);

      const { cost, user_id, products } = mockInventory2;
      const res: InventoryEntity = await service.updateInventory(mockInventory2.id, { products, cost }, user_id);

      expect(res).toBeNull();
    });

    it('should return null if is not the owner', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInventory1);

      const { id } = mockInventory1;
      const { cost, user_id, products } = mockInventory2;
      const res: InventoryEntity = await service.updateInventory(id, { products, cost }, user_id);

      expect(res).toBeUndefined();
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

      const { id, user_id } = mockInventory3;
      const res: InventoryEntity = await service.deleteInventory(id, user_id);

      expect(res).toBe(mockInventory3);
    });

    it('should return undefined if inventory was not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(productListRepository, 'findOne').mockResolvedValue(null);
      //jest.spyOn(repository, 'deleteInventory').mockResolvedValue(null);

      const { id, user_id } = mockInventory3;
      const res: InventoryEntity = await service.deleteInventory(id, user_id);

      expect(res).toBeNull();
    });

    it('should return null if is not the owner', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInventory1);
      jest.spyOn(productListRepository, 'findOne').mockResolvedValue({
        id: mockInventory1.id,
        products: mockInventory1.products as ProductList[]
      });
      //jest.spyOn(repository, 'deleteInventory').mockResolvedValue(null);

      const { id } = mockInventory1;
      const { user_id } = mockInventory2;
      const res: InventoryEntity = await service.deleteInventory(id, user_id);

      expect(res).toBeUndefined();
    });
  });
});
