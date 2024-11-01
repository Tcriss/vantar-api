import { Test, TestingModule } from '@nestjs/testing';
import { Cache, CacheModule } from '@nestjs/cache-manager';

import { ShopService } from './shop.service';
import { cacheProviderMock, shopMocks, shopRepositoryMock } from '../../domain/mocks';
import { ShopEntity } from '../../domain/entities';
import { Repository } from '../../../common/domain/entities';

describe('ShopService', () => {
  let service: ShopService;
  let repository: Repository<ShopEntity>
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Repository<ShopEntity>,
          useValue: shopRepositoryMock
        },
        {
          provide: Cache,
          useValue: cacheProviderMock
        },
        ShopService
      ],
      imports: [
        CacheModule.register({ ttl: (60 ^ 2) * 1000 }),
      ]
    }).compile();

    service = module.get<ShopService>(ShopService);
    repository = module.get<Repository<ShopEntity>>(Repository<ShopEntity>);
    cache = module.get<Cache>(Cache);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find All Shops', () => {
    it('should fetch all shops', async () => {
      jest.spyOn(cache, 'get').mockResolvedValue(null);
      jest.spyOn(repository, 'findAll').mockResolvedValue(shopMocks);

      const res: Partial<ShopEntity>[] = await service.findAll({ take: 10, skip: 0 });

      expect(res).toStrictEqual(shopMocks);
    });
  });

  describe('Find One Shop', () => {
    it('should find one shop', async () => {
      jest.spyOn(cache, 'get').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(shopMocks[0]);

      const res: Partial<ShopEntity> = await service.findOne(shopMocks[0].id);

      expect(res).toStrictEqual(shopMocks[0]);
    });

    it('should return null if shop was not found', async () => {
      jest.spyOn(cache, 'get').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const res: Partial<ShopEntity> = await service.findOne(shopMocks[0].id);

      expect(res).toBeNull();
    });
  });

  describe('Create Shop', () => {
    it('should create a shop', async () => {
      jest.spyOn(repository, 'create').mockResolvedValue(shopMocks[1]);

      const res: Partial<ShopEntity> = await service.create({ name: 'Vantar' }, shopMocks[1].user_id);

      expect(res).toBe(shopMocks[1]);
      expect(repository.create).toHaveBeenCalledWith({
        name: 'Vantar',
        user_id: shopMocks[1].user_id
      });
    });
  });

  describe('Update Shop', () => {
    it('should update a shop', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(shopMocks[2]);
      jest.spyOn(repository, 'update').mockResolvedValue(shopMocks[2]);

      const res: Partial<ShopEntity> = await service.update(shopMocks[2].id, { name: 'Vantar' });

      expect(res).toBe(shopMocks[2]);
      expect(repository.update).toHaveBeenCalledWith(shopMocks[2].id, { name: 'Vantar' });
    });

    it('should return null if shop does not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'update').mockResolvedValue(shopMocks[2]);

      const res: Partial<ShopEntity> = await service.update(shopMocks[2].id, { name: 'Vantar' });

      expect(res).toBeNull();
    });
  });

  describe('Delete Shop', () => {
    it('should delete a shop', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(shopMocks[2]);
      jest.spyOn(repository, 'delete').mockResolvedValue(shopMocks[2]);

      const res: Partial<ShopEntity> = await service.delete(shopMocks[2].id);

      expect(res).toBe(shopMocks[2]);
      expect(repository.delete).toHaveBeenCalledWith(shopMocks[2].id);
    });

    it('should return null if shop does not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'delete').mockResolvedValue(shopMocks[2]);

      const res: Partial<ShopEntity> = await service.delete(shopMocks[2].id);

      expect(res).toBeNull();
    });
  });
});
