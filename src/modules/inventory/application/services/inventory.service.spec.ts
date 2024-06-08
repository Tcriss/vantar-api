import { Test, TestingModule } from '@nestjs/testing';

import { InventoryService } from './inventory.service';
import { InventoryRepository } from '../repositories/inventory.repository';
import { mockInventoryRepository } from '../../domain/mocks/inventory-providers.mock';
import { mockInventory1, mockInventory2, mockInventory3, mockPartialInventory1, mockPartialInventory2 } from '../../domain/mocks/inventory.mock';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { mockCustomer1 } from 'src/modules/customers/domain/mocks/customers.mock';

describe('InventoryService', () => {
  let service: InventoryService;
  let repository: InventoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: InventoryRepository,
          useValue: mockInventoryRepository
        }
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repository = module.get<InventoryRepository>(InventoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find All Inventories', () => {
    it('should fetch all inventories', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([ mockInventory1, mockInventory3 ]);

      const res: Partial<InventoryEntity>[] = await service.findAllInventories('be702a7b-13a3-4e03-93f6-65b2a82e1905', {skip: 0, take: 3});

      expect(res).toStrictEqual([ mockInventory1, mockInventory3 ]);
    });

    it('should fetch some fields', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([ mockPartialInventory1 ]);

      const res: Partial<InventoryEntity>[] = await service.findAllInventories('be702a7b-13a3-4e03-93f6-65b2a82e1905', { skip: 0, take: 3 }, 'company_name, products_amount, id');

      expect(res).toStrictEqual([ mockPartialInventory1 ]);
    });

    it('should fetch by search query', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([ mockInventory1 ]);

      const res: Partial<InventoryEntity>[] = await service.findAllInventories('be702a7b-13a3-4e03-93f6-65b2a82e1905', { skip: 0, take: 3 }, '', 'Bodega');

      expect(res).toStrictEqual([ mockInventory1 ]);
    });
  });

  describe('Find One Inventory', () => {
    it('should find an inventory by its id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInventory1);

      const res: Partial<InventoryEntity> = await service.findOneInventory(mockInventory1.id);

      expect(res).toEqual(mockInventory1);
    });

    it('should get some fields', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPartialInventory1);

      const res: Partial<InventoryEntity> = await service.findOneInventory(mockCustomer1.id, 'id, products_amount, company_name');

      expect(res).toBe(mockPartialInventory1);
    });
  });

  describe('Create Inventory', () => {
    it('should create an inventory', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(mockInventory2);

      const { company_name, capital, service_charge } = mockInventory2;
      const res: InventoryEntity = await service.createInventory({ company_name, capital, service_charge });

      expect(res).toBe(mockInventory2);
    });
  });

  describe('Update Inventory', () => {
    it('should update inventory', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(mockInventory3);

      const { company_name, service_charge } = mockInventory2;
      const res: InventoryEntity = await service.updateInventory(mockInventory1.id, { company_name, service_charge });

      expect(res).toBe(mockInventory3);
    });

    it('should not update if inventory was not found', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(null);

      const { company_name, service_charge } = mockInventory2;
      const res: InventoryEntity = await service.updateInventory(mockInventory2.id, { company_name, service_charge });

      expect(res).toBe(null);
    });
  });

  describe('Delete Inventory', () => {
    it('should delete iventory', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(mockInventory3);

      const res: InventoryEntity = await service.deleteInventory(mockInventory3.id);

      expect(res).toBe(mockInventory3);
    });

    it('should not update if inventory was not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(null);

      const res: InventoryEntity = await service.deleteInventory(mockInventory2.id);

      expect(res).toBe(null);
    });
  });
});
