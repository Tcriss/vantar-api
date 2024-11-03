import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

import { OwnerGuard } from './owner.guard';
import { prismaMock, shopMocks } from '@shops/domain/mocks';
import { PrismaProvider } from '@database/infrastructure/providers';

describe('OwnerGuard', () => {
  let prisma: PrismaProvider;
  let guard: OwnerGuard;

  const mockExecutionContext = (userId?: string, shopId?: string): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({
        user: {
          id: userId
        },
        query: {
          shop: shopId
        }
      }),
    }),
  } as unknown as ExecutionContext);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnerGuard,
        {
          provide: PrismaProvider,
          useValue: prismaMock,
        },
      ],
    }).compile();

    guard = module.get<OwnerGuard>(OwnerGuard);
    prisma = module.get<PrismaProvider>(PrismaProvider);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should pass if crdentials are correct', async () => {
    jest.spyOn(prisma.shop, 'findUnique').mockResolvedValue(shopMocks[0]);

    const context = mockExecutionContext(shopMocks[0].user_id, shopMocks[0].id);
    const res = await guard.canActivate(context);

    expect(res).toBeTruthy();
  });

  it('should throw an exception if shopId was not provided', async () => {
    jest.spyOn(prisma.shop, 'findUnique').mockResolvedValue(null);

    const context = mockExecutionContext(v4(), null);
    
    try {
      await guard.canActivate(context);
    } catch(err) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.message).toBe("no 'shop' param provided in url");
      expect(err.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  it('should throw an exception if shopId is not a valid uuid', async () => {
    jest.spyOn(prisma.shop, 'findUnique').mockResolvedValue(shopMocks[0]);

    const context = mockExecutionContext(shopMocks[0].user_id, '232');
    
    try {
      await guard.canActivate(context);
    } catch(err) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.message).toBe("'shop' value is not a valid uuid");
      expect(err.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  it('should throw an exception if shop was not found', async () => {
    jest.spyOn(prisma.shop, 'findUnique').mockResolvedValue(shopMocks[0]);

    const context = mockExecutionContext(shopMocks[0].user_id, v4());
    
    try {
      await guard.canActivate(context);
    } catch(err) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.message).toBe("no provided shop found");
      expect(err.status).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  it('should throw an exception if user does not own the resource', async () => {
    jest.spyOn(prisma.shop, 'findUnique').mockResolvedValue(shopMocks[0]);

    const context = mockExecutionContext('123', v4());
    
    try {
      await guard.canActivate(context);
    } catch(err) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.message).toBe("resource not found");
      expect(err.status).toBe(HttpStatus.NOT_FOUND);
    }
  });
});
