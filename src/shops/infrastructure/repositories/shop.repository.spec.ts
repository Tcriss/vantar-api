import { Test, TestingModule } from '@nestjs/testing';

import { ShopRepository } from './shop.repository';
import { prismaMock, shopMocks } from '@shops/domain/mocks';
import { ShopEntity } from '@shops/domain/entities';
import { PrismaProvider } from '@database/infrastructure/providers';

describe('Respotories', () => {
  let repository: ShopRepository;
  let prisma: PrismaProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopRepository,
        {
          provide: PrismaProvider,
          useValue: prismaMock
        }
      ],
    }).compile();

    repository = module.get<ShopRepository>(ShopRepository);
    prisma = module.get<PrismaProvider>(PrismaProvider);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Find All Shops', () => {
    it('should fetch all shops', async () => {
      jest.spyOn(prisma.shop, 'findMany').mockResolvedValue(shopMocks);

      const res: Partial<ShopEntity>[] = await repository.findAll(shopMocks[0].user_id, { take: 10, skip: 0 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual(shopMocks);
    });

    it('should fetch what pagination indicates', async () => {
      jest.spyOn(prisma.shop, 'findMany').mockResolvedValue([ shopMocks[2] ]);

      const res: Partial<ShopEntity>[] = await repository.findAll(shopMocks[0].user_id, { take: 1, skip: 2 });

      expect(res).toHaveLength(1);
      expect(res).toEqual([ shopMocks[2] ]);
    });
  });

  describe('Find One Shop', () => {
    it('should fecth one shop', async () => {
      jest.spyOn(prisma.shop, 'findUnique').mockResolvedValue(shopMocks[0]);

      const res: Partial<ShopEntity> = await repository.findOne(shopMocks[0].id);

      expect(res).toBe(shopMocks[0]);
    });
  });

  describe('Create Shop', () => {
    it('should create a shop', async () => {
      jest.spyOn(prisma.shop,'create').mockResolvedValue(shopMocks[1]);

      const { name, user_id } = shopMocks[1];
      const res: ShopEntity = await repository.create({ name, user_id });

      expect(res).toBe(shopMocks[1]);
    });
  });

  describe('Update Shop', () => {
    it('should update a shop', async () => {
      jest.spyOn(prisma.shop,'update').mockResolvedValue(shopMocks[2]);

      const { id, name } = shopMocks[2];
      const res: ShopEntity = await repository.update(id, { name });

      expect(res).toBe(shopMocks[2]);
    });
  });

  describe('Delete Shop', () => {
    it('should delete a shop', async () => {
      jest.spyOn(prisma.shop,'delete').mockResolvedValue(shopMocks[2]);

      const res: ShopEntity = await repository.delete(shopMocks[2].id);

      expect(res).toBe(shopMocks[2]);
    });
  });
});
