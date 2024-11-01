import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { InventoryController } from './inventory.controller';
import { InventoryService } from '../../application/services/inventory.service';
import { mockInventoryService } from '../../domain/mocks/inventory-providers.mock';
import { mockInventory1, mockInventory2, mockInventory3, mockPartialInventory1, mockPartialInventory2, mockPartialInventory3 } from '../../domain/mocks/inventory.mock';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { InventoyResponse } from '../../domain/types';

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

  describe('Find All Inventories', () => {
    it('should get all inventories', async () => {
      jest.spyOn(service, 'findAllInventories').mockResolvedValue([ mockInventory1, mockInventory3 ]);

      const res: Partial<InventoryEntity>[] = await controller.findAll({ page: 1, limit: 10 });

      expect(res.length).toBe(2);
      expect(res).toStrictEqual([ mockInventory1, mockInventory3 ]);
    });

    it('should get all inventories with some fiedls', async () => {
      jest.spyOn(service, 'findAllInventories').mockResolvedValue([ mockPartialInventory1, mockPartialInventory3 ]);

      const res: Partial<InventoryEntity>[] = await controller.findAll({
        page: 1,
        limit: 10,
        fields: 'name, contact, userId'
      });

      expect(res.length).toBe(2);
      expect(res).toStrictEqual([ mockPartialInventory1, mockPartialInventory3 ]);
    });

    it('should throw exception if page query param was not provided', async () => {
      try {
        await controller.findAll({ page: null });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        expect(err.message).toBe("'page' or 'limit' param missing");
      }
    });
  });

  describe('Find One Inventory', () => {
    it('should get an inventory by its id', async () => {
      jest.spyOn(service, 'findOneInventory').mockResolvedValue(mockInventory2);

      const res: Partial<InventoryEntity> = await controller.findOne(mockInventory2.id);

      expect(res).toBe(mockInventory2);
    });

    it('should get an inventory with some fields', async () => {
      jest.spyOn(service, 'findOneInventory').mockResolvedValue(mockPartialInventory2);

      const res: Partial<InventoryEntity> = await controller.findOne(mockInventory2.id, 'company_name, id, products_amount');

      expect(res).toBe(mockPartialInventory2);
    });

    it('shoudl throw an exception if inventory was not found', async () => {
      jest.spyOn(service, 'findOneInventory').mockResolvedValue(null);

      try {
        await controller.findOne(mockInventory1.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Inventory not found');
      }
    });

    it('shoudl throw an exception if is not owner', async () => {
      jest.spyOn(service, 'findOneInventory').mockResolvedValue(mockInventory1);

      try {
        await controller.findOne(mockInventory1.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Inventory not found');
      }
    });
  });

  describe('Create Inventory', () => {
    it('should create an inventory', async () => {
      jest.spyOn(service, 'createInventory').mockResolvedValue(mockInventory1);

      const { cost } = mockInventory1;
      const res: InventoyResponse  = await controller.create({
        cost: cost,
        products: []
      });

      expect(res.message).toBe('Inventory created succesfully');
      expect(res.data).toBe(mockInventory1);
    });
  });

  describe('Update Inventory', () => {
    it('should update an inventory', async () => {
      jest.spyOn(service, 'updateInventory').mockResolvedValue(mockInventory3);

      const { total, subtotal, cost } = mockInventory2;
      const res: InventoyResponse  = await controller.update(mockInventory1.id, {
        cost: 5,
        products: []
      });

      expect(res.message).toBe('Inventory updated succesfully');
      expect(res.data).toBe(mockInventory3);
    });

    it('should throw an exception if uuid is wrong', async () => {
      //jest.spyOn(service, 'findOneInventory').mockResolvedValue(undefined);

      const { total, subtotal, cost } = mockInventory2;

      try {
        await controller.update('123', {
          cost: 5,
          products: []
        });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        expect(err.message).toBe('Id does not have a valid uuid format');
      }
    });

    it('should throw exception if fields are bad implemented', async () => {
      jest.spyOn(service, 'createInventory').mockResolvedValue(null);

      try {
        await controller.update(mockInventory1.id, {
          cost: 5,
          products: []
        });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('shoudl throw an exception if is not owner', async () => {
      //jest.spyOn(service, 'findOneInventory').mockResolvedValue(undefined);
      const { cost } = mockInventory2;
      try {
        await controller.update(mockInventory2.id, {
          cost: cost,
          products: []
        });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe('Forbidden resource');
      }
    });
  });

  describe('Delete Inventory', () => {
    it('should delete inventory', async () => {
      jest.spyOn(service, 'findOneInventory').mockResolvedValue(mockInventory3);
      jest.spyOn(service, 'deleteInventory').mockResolvedValue(mockInventory3);

      const res: InventoyResponse = await controller.delete(mockInventory3.id);

      expect(res.message).toBe('Inventory deleted succesfully');
    });

    it('should throw an exception if inventory was not found', async () => {
      jest.spyOn(service, 'deleteInventory').mockResolvedValue(null);

      try {
        await controller.delete(mockInventory1.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Inventory not found');
      }
    });

    it('shoudl throw an exception if is not owner', async () => {
      jest.spyOn(service, 'deleteInventory').mockResolvedValue(undefined);

      try {
        await controller.delete(mockInventory1.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Inventory not found');
      }
    });
  });
});
