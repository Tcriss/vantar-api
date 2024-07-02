import { Test, TestingModule } from '@nestjs/testing';

import { PrismaProvider } from './prisma.provider';

describe('PrismaProvider', () => {
  let prismaProvider: PrismaProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaProvider],
    }).compile();

    prismaProvider = module.get<PrismaProvider>(PrismaProvider);
  });

  it('should be defined', () => {
    expect(prismaProvider).toBeDefined();
  });

  it('should connect to the database on module init', async () => {
    jest.spyOn(prismaProvider, '$connect');
    await prismaProvider.onModuleInit();
    expect(prismaProvider.$connect).toHaveBeenCalled();
  });

  it('should disconnect from the database on module destroy', async () => {
    jest.spyOn(prismaProvider, '$disconnect');
    await prismaProvider.onModuleDestroy();
    expect(prismaProvider.$disconnect).toHaveBeenCalled();
  });
});
