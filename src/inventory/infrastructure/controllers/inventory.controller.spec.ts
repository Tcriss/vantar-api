import { Test, TestingModule } from '@nestjs/testing';

import { InventoryController } from './inventory.controller';
import { InventoryService } from '../../application/services/inventory.service';
import { mockInventoryService } from '../../domain/mocks/inventory-providers.mock';
import { mockInventory1, mockInventory2, mockInventory3, mockPartialInventory1, mockPartialInventory2, mockPartialInventory3 } from '../../domain/mocks/inventory.mock';
import { InventoryEntity } from '../../domain/entities/inventory.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
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

      const res: Partial<InventoryEntity>[] = await controller.findAll(mockInventory1.customer_id, {page: '0,3'});

      expect(res.length).toBe(2);
      expect(res).toStrictEqual([ mockInventory1, mockInventory3 ]);
    });

    it('should get all inventories with some fiedls', async () => {
      jest.spyOn(service, 'findAllInventories').mockResolvedValue([ mockPartialInventory1, mockPartialInventory3 ]);

      const res: Partial<InventoryEntity>[] = await controller.findAll(mockInventory1.customer_id, { page: '0,3', fields: 'name, contact, userId' });

      expect(res.length).toBe(2);
      expect(res).toStrictEqual([ mockPartialInventory1, mockPartialInventory3 ]);
    });

    it('should get inventories that only match query search results', async () => {
      jest.spyOn(service, 'findAllInventories').mockResolvedValue([ mockInventory1 ]);

      const searchTerm: string = 'Bodega';
      const res: Partial<InventoryEntity>[] = await controller.findAll(mockInventory1.customer_id, { page: '0,3', q: searchTerm });

      expect(res.length).toBe(1);
      expect(res).toStrictEqual([ mockInventory1 ]);
      expect(res[0].company_name.includes(searchTerm)).toBeTruthy();
    });

    it('should throw exception if page query param was not provided', async () => {
      jest.spyOn(service, 'findAllInventories').mockResolvedValue(null);

      try {
        await controller.findAll(mockInventory1.customer_id, { page: null });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        expect(err.message).toBe('page query param is missing in url');
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

    it('shoudl throw an exception if invenoty was not found', async () => {
      jest.spyOn(service, 'findOneInventory').mockResolvedValue(undefined);

      try {
        await controller.findOne(mockInventory1.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Inventory not found');
      }
    })

    // it('should throw an exception if uuid is wrong', async () => {
    //   jest.spyOn(service, 'findOneInventory').mockResolvedValue(undefined);

    //   try {
    //     await controller.findOne('123');
    //   } catch (err) {
    //     expect(err).toBeInstanceOf(HttpException);
    //     expect(err.status).toBe(HttpStatus.BAD_REQUEST);
    //     expect(err.message).toBe('Id does not have a valid uuid format');
    //   }
    // });
  });

  describe('Create Inventory', () => {
    it('should create an inventory', async () => {
      jest.spyOn(service, 'createInventory').mockResolvedValue(mockInventory1);

      const { company_name, customer_id, capital, service_charge } = mockInventory1;
      const res: InventoyResponse  = await controller.create({ company_name, customer_id, capital, service_charge });

      expect(res.message).toBe('Inventory created succesfully');
      expect(res.data).toBe(mockInventory1);
    });

    it('should throw exception if fields are bad implemented', async () => {
      jest.spyOn(service, 'createInventory').mockResolvedValue(null);

      try {
        await controller.create({ company_name: null, customer_id: '123', capital: 4, service_charge: 4 });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('Update Inventory', () => {
    it('should update an inventory', async () => {
      jest.spyOn(service, 'updateInventory').mockResolvedValue(mockInventory3);

      const { company_name, service_charge } = mockInventory2;
      const res: InventoyResponse  = await controller.update(mockInventory1.id, { company_name, service_charge });

      expect(res.message).toBe('Inventory updated succesfully');
      expect(res.data).toBe(mockInventory3);
    });

    it('should throw an exception if uuid is wrong', async () => {
      jest.spyOn(service, 'findOneInventory').mockResolvedValue(undefined);

      const { company_name, service_charge } = mockInventory2;

      try {
        await controller.update('123', { company_name, service_charge });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
        expect(err.message).toBe('Id does not have a valid uuid format');
      }
    });

    it('should throw exception if fields are bad implemented', async () => {
      jest.spyOn(service, 'createInventory').mockResolvedValue(null);

      try {
        await controller.update(mockInventory1.id, { company_name: null, customer_id: '123', capital: 4, service_charge: 4 });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
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
      jest.spyOn(service, 'findOneInventory').mockResolvedValue(null);
      jest.spyOn(service, 'deleteInventory').mockResolvedValue(null);

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
