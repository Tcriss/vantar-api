import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ShopController } from './shop.controller';
import { ShopParams } from '../../domain/types';
import { shopMocks, shopServiceMock } from '../../domain/mocks';
import { CreateShopDto, UpdateShopDto } from '../../domain/dtos';
import { ShopService } from '../../application/services/shop.service';

describe('ShopController', () => {
  let controller: ShopController;
  let service: ShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopController],
      providers: [
        {
          provide: ShopService,
          useValue: shopServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ShopController>(ShopController);
    service = module.get<ShopService>(ShopService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find All Shops', () => {
    it('should fetch all shops', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(shopMocks);

      const params: ShopParams = { page: 1, limit: 10, fields: '' };
      const req: Request = { user: { id: '123' } } as any as Request;
      const result = await controller.findAll(req, params);

      expect(result).toStrictEqual(shopMocks);
      expect(service.findAll).toHaveBeenCalledWith(
        '123',
        { take: 10, skip: 0 },
        params.fields
      );
    });
  });

  describe('Find One Shop', () => {
    it('should fetch one shop', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(shopMocks[0]);

      const id = '550e8400-e29b-41d4-a716-446655440000';
      const result = await controller.findOne(id, '');

      expect(result).toEqual(shopMocks[0]);
      expect(service.findOne).toHaveBeenCalledWith(id, '');
    });

    it('should throw an error if shop not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('invalid-id', '')).rejects.toThrow(
        new HttpException('Shop not found', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('Create Shop', () => {
    it('should create a shop', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(shopMocks[1]);

      const dto: CreateShopDto = { name: 'New Shop' };
      const result = await controller.create({ user: { sub: shopMocks[1].user_id } as any as Request }, dto);

      expect(result).toEqual({
        message: 'Shop created succesfully',
        shop: shopMocks[1],
      });
    });

    it('should throw an error if shop not created', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(null);

      await expect(controller.create({ user: { sub: shopMocks[1].user_id } as any as Request }, {} as CreateShopDto)).rejects.toThrow(
        new HttpException('Shop not created', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });

  describe('Update Shop', () => {
    it('should update a shop', async () => {
      jest.spyOn(service,  'update').mockResolvedValue(shopMocks[2]);

      const id = '550e8400-e29b-41d4-a716-446655440002';
      const dto: UpdateShopDto = { name: 'Gadget World' };
      const result = await controller.update(id, dto);

      expect(result).toEqual({
        message: 'Shop updated succesfully',
        shop: shopMocks[2],
      });
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });

    it('should throw an error if shop not updated', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(null);

      await expect(controller.update('invalid-id', {} as UpdateShopDto)).rejects.toThrow(
        new HttpException('Shop not updated', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });

  describe('Delete Shop', () => {
    it('should delete a shop', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(shopMocks[1]);

      const result = await controller.delete(shopMocks[1].id);

      expect(result).toEqual({ message: 'Shop deleted succesfully' });
      expect(service.delete).toHaveBeenCalledWith(shopMocks[1].id);
    });

    it('should throw an error if shop not deleted', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(null);

      await expect(controller.delete('invalid-id')).rejects.toThrow(
        new HttpException('Shop not deleted', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });
});
