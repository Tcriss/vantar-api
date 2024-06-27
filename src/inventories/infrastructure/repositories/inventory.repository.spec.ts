import { Test, TestingModule } from '@nestjs/testing';

import { InventoryRepository } from './inventory.repository';
import { PrismaProvider } from '../../../prisma/infrastructure/providers/prisma.provider';
import { prismaMock } from '../../domain/mocks/inventory-providers.mock';
import { mockInventory1, mockInventory2, mockInventory3 } from '../../domain/mocks/inventory.mock';
import { InventoryEntity } from '../../domain/entities/inventory.entity';

describe('Customer', () => {
  let repository: InventoryRepository;
  let prisma: PrismaProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryRepository,
        {
          provide: PrismaProvider,
          useValue: prismaMock
        }
      ],
    }).compile();

    prisma = module.get<PrismaProvider>(PrismaProvider);
    repository = module.get<InventoryRepository>(InventoryRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Find All Inventories', () => {
    it('should find all inventories', async () => {
      jest.spyOn(prisma.inventory, 'findMany').mockResolvedValue([ mockInventory1, mockInventory3 ]);

      const res: Partial<InventoryEntity>[] = await repository.findAllInventories(mockInventory1.user_id, { skip: 1, take: 2 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toHaveLength(2);
      expect(res).toEqual([ mockInventory1, mockInventory3 ]);
    });

    it('should only bring one element', async () => {
      jest.spyOn(prisma.inventory, 'findMany').mockResolvedValue([mockInventory1]);

      const res: Partial<InventoryEntity>[] = await repository.findAllInventories(mockInventory1.user_id, { skip: 0, take: 1 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toHaveLength(1);
      expect(res).toEqual([ mockInventory1 ]);
    });
  });

  describe('Find One Inventory', () => {
    it('should find a inventory', async () => {
      jest.spyOn(prisma.inventory, 'findUnique').mockResolvedValue(mockInventory2);

      const res: Partial<InventoryEntity> = await repository.findOneInventory(mockInventory2.id);

      expect(res).toEqual(mockInventory2);
    });

    it('should fetch some fields from an inventory', async () => {
      jest.spyOn(prisma.inventory, 'findUnique').mockResolvedValue(mockInventory2);

      const res: Partial<InventoryEntity> = await repository.findOneInventory(mockInventory2.id, {
        id: true,
        cost: true,
        subtotal: false,
        total: false,
        user_id: false,
        created_at: false
      });

      expect(res).toEqual(mockInventory2);
    });
  });

  describe('Create InventorY', () => {
    it('should create a inventory', async () => {
      jest.spyOn(prisma.inventory, 'create').mockResolvedValue(mockInventory2);

      const { user_id, total, subtotal, cost } = mockInventory2;
      const res: Partial<InventoryEntity> = await repository.createInventory({ user_id, total, subtotal, cost });

      expect(res).toEqual(mockInventory2);
    });
  });

  describe('Update InventorY', () => {
    it('should update a inventory', async () => {
      jest.spyOn(prisma.inventory, 'update').mockResolvedValue(mockInventory3);

      const { user_id, total, subtotal, cost } = mockInventory2;
      const res: Partial<InventoryEntity> = await repository.updateInventory(mockInventory1.id, { user_id, total, subtotal, cost });

      expect(res).toEqual(mockInventory3);
    });
  });

  describe('Delete InventorY', () => {
    it('should delete a inventory', async () => {
      jest.spyOn(prisma.inventory, 'delete').mockResolvedValue(mockInventory3);

      const res: Partial<InventoryEntity> = await repository.deleteInventory(mockInventory3.id);

      expect(res).toEqual(mockInventory3);
    });
  });
});
