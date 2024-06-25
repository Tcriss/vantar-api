import { Test, TestingModule } from '@nestjs/testing';

import { InventoryService } from './inventory.service';
import { mockInventoryRepository } from '../../domain/mocks/inventory-providers.mock';
import { mockInventory1, mockInventory2, mockInventory3, mockPartialInventory1 } from '../../domain/mocks/inventory.mock';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { InventoryRepositoryI, InventoryRepositoryToken } from '../../domain/interfaces/inventory-repository.interface';

describe('InventoryService', () => {
  let service: InventoryService;
  let repository: InventoryRepositoryI;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: InventoryRepositoryToken,
          useValue: mockInventoryRepository
        }
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repository = module.get<InventoryRepositoryI>(InventoryRepositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find All Inventories', () => {
    it('should fetch all inventories', async () => {
      jest.spyOn(repository, 'findAllInventories').mockResolvedValue([ mockInventory1, mockInventory3 ]);

      const res: Partial<InventoryEntity>[] = await service.findAllInventories('be702a7b-13a3-4e03-93f6-65b2a82e1905', '0,3');

      expect(res).toStrictEqual([ mockInventory1, mockInventory3 ]);
    });

    it('should fetch some fields', async () => {
      jest.spyOn(repository, 'findAllInventories').mockResolvedValue([ mockPartialInventory1 ]);

      const res: Partial<InventoryEntity>[] = await service.findAllInventories('be702a7b-13a3-4e03-93f6-65b2a82e1905', '0,3', 'company_name, products_amount, id');

      expect(res).toStrictEqual([ mockPartialInventory1 ]);
    });

    // it('should fetch by search query', async () => {
    //   jest.spyOn(repository, 'findAllInventories').mockResolvedValue([ mockInventory1 ]);

    //   const res: Partial<InventoryEntity>[] = await service.findAllInventories('be702a7b-13a3-4e03-93f6-65b2a82e1905', '0,3', '', 'Bodega');

    //   expect(res).toStrictEqual([ mockInventory1 ]);
    // });
  });

  describe('Find One Inventory', () => {
    it('should find an inventory by its id', async () => {
      jest.spyOn(repository, 'findOneInventory').mockResolvedValue(mockInventory1);

      const { id, user_id } = mockInventory1; 
      const res: Partial<InventoryEntity> = await service.findOneInventory(id, user_id);

      expect(res).toEqual(mockInventory1);
    });

    it('should get some fields', async () => {
      jest.spyOn(repository, 'findOneInventory').mockResolvedValue(mockPartialInventory1);

      const { id, user_id } = mockInventory1; 
      const res: Partial<InventoryEntity> = await service.findOneInventory(id, user_id, 'id, products_amount, company_name');

      expect(res).toBe(mockPartialInventory1);
    });

    it('should return null if is not the ownder', async () => {
      //jest.spyOn(repository, 'findOneInventory').mockResolvedValue(mockPartialInventory1);

      const { user_id } = mockInventory2;
      const { id } = mockInventory1;
      const res: Partial<InventoryEntity> = await service.findOneInventory(id, user_id);

      expect(res).toBeNull();
    });
  });

  describe('Create Inventory', () => {
    it('should create an inventory', async () => {
      jest.spyOn(repository, 'createInventory').mockResolvedValue(mockInventory2);

      const { user_id, total, subtotal, cost } = mockInventory2;
      const res: InventoryEntity = await service.createInventory({ user_id, total, subtotal, cost });

      expect(res).toBe(mockInventory2);
    });
  });

  describe('Update Inventory', () => {
    it('should update inventory', async () => {
      jest.spyOn(repository, 'findOneInventory').mockResolvedValue(mockInventory2);
      jest.spyOn(repository, 'updateInventory').mockResolvedValue(mockInventory3);

      const { total, subtotal, cost, user_id } = mockInventory2;
      const res: InventoryEntity = await service.updateInventory(mockInventory1.id, { total, subtotal, cost }, user_id);

      expect(res).toBe(mockInventory3);
    });

    it('should return undefined if inventory was not found', async () => {
      jest.spyOn(repository, 'findOneInventory').mockResolvedValue(null)
      //jest.spyOn(repository, 'updateInventory').mockResolvedValue(null);

      const { total, subtotal, cost, user_id } = mockInventory2;
      const res: InventoryEntity = await service.updateInventory(mockInventory2.id, { total, subtotal, cost }, user_id);

      expect(res).toBeUndefined();
    });

    it('should return null if is not the owner', async () => {
      jest.spyOn(repository, 'findOneInventory').mockResolvedValue(mockInventory1);

      const { id } = mockInventory1;
      const { total, subtotal, cost, user_id } = mockInventory2;
      const res: InventoryEntity = await service.updateInventory(id, { total, subtotal, cost }, user_id);

      expect(res).toBeNull();
    });
  });

  describe('Delete Inventory', () => {
    it('should delete iventory', async () => {
      jest.spyOn(repository, 'findOneInventory').mockResolvedValue(mockInventory3);
      jest.spyOn(repository, 'deleteInventory').mockResolvedValue(mockInventory3);

      const { id, user_id } = mockInventory3;
      const res: InventoryEntity = await service.deleteInventory(id, user_id);

      expect(res).toBe(mockInventory3);
    });

    it('should return undefined if inventory was not found', async () => {
      jest.spyOn(repository, 'findOneInventory').mockResolvedValue(null);
      //jest.spyOn(repository, 'deleteInventory').mockResolvedValue(null);

      const { id, user_id } = mockInventory3;
      const res: InventoryEntity = await service.deleteInventory(id, user_id);

      expect(res).toBeUndefined();
    });

    it('should return null if is not the owner', async () => {
      jest.spyOn(repository, 'findOneInventory').mockResolvedValue(mockInventory1);
      //jest.spyOn(repository, 'deleteInventory').mockResolvedValue(null);

      const { id } = mockInventory1;
      const { user_id } = mockInventory2;
      const res: InventoryEntity = await service.deleteInventory(id, user_id);

      expect(res).toBeNull();
    });
  });
});