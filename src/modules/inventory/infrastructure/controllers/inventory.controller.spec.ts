import { Test, TestingModule } from '@nestjs/testing';

import { InventoryController } from './inventory.controller';
import { InventoryService } from '../../application/services/inventory.service';
import { mockInventoryService } from '../../domain/mocks/inventory-providers.mock';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: InventoryService,
          useValue: mockInventoryService
        }
      ],
      controllers: [InventoryController],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('Find All Inventories', () => {});

  describe('Find One Inventory', () => {});

  describe('Create Inventory', () => {});

  describe('Update Inventory', () => {});

  describe('Delete Inventory', () => {});
});
