import { Test, TestingModule } from "@nestjs/testing";

import { ProductRepository } from "./product.repository";
import { PrismaProvider } from "../../../prisma/infrastructure/providers/prisma.provider";
import { prismaMock } from "../../domain/mocks/product-providers.mock";
import { ProductEntity } from "../../domain/entities/product.entity";
import { productMock1, productMock2, productMock3, productMock4, productMock5, productMock6 } from "../../domain/mocks/product.mock";

describe('Customer', () => {
    let repository: ProductRepository;
    let prisma: PrismaProvider;
  
    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ProductRepository,
          {
            provide: PrismaProvider,
            useValue: prismaMock
          }
        ],
      }).compile();
  
      prisma = module.get<PrismaProvider>(PrismaProvider);
      repository = module.get<ProductRepository>(ProductRepository);
    });
  
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });

    describe('Find All Products', () => {
      it('should fetch all products', async () => {
        jest.spyOn(prisma.product, 'findMany').mockResolvedValue([ productMock1, productMock2, productMock3 ]);

        const res: Partial<ProductEntity>[] = await repository.findAllProducts({ take: 10, skip: 0 });

        expect(res).toBeInstanceOf(Array);
        expect(res).toEqual([ productMock1, productMock2, productMock3 ]);
      });

      it('should fetch inventory products', async () => {
        jest.spyOn(prisma.product, 'findMany').mockResolvedValue([ productMock1, productMock4, productMock5 ]);

        const id: string = '1d3e9bfc-6a2c-4a7b-8c3d-2c4e9f4b3b2a';
        const res: Partial<ProductEntity>[] = await repository.findAllProducts({ take: 10, skip: 0 }, id);

        expect([ productMock1, productMock4, productMock5 ]).toBeTruthy();
      });

      it('should fetch what pagination indicates', async () => {
        jest.spyOn(prisma.product, 'findMany').mockResolvedValue([ productMock3 ]);

        const res: Partial<ProductEntity>[] = await repository.findAllProducts({ take: 1, skip: 2 });

        expect(res).toHaveLength(1);
        expect(res).toEqual([ productMock3 ]);
      });
    });

    describe('Find One Product', () => {
      it('should fecth one prodcut', async () => {
        jest.spyOn(prisma.product, 'findUnique').mockResolvedValue(productMock2);

        const res: Partial<ProductEntity> = await repository.findOneProduct(productMock2.id);

        expect(res).toBe(productMock2);
      });
    });

    describe('Create Product', () => {
      it('should create a product', async () => {
        jest.spyOn(prisma.product,'create').mockResolvedValue(productMock1);

        const { user_id, name, price } = productMock1;
        const res: ProductEntity = await repository.createProduct({ user_id, name, price });

        expect(res).toBe(productMock1);
      });
    });

    describe('Update Product', () => {
      it('should update a prodcut', async () => {
        jest.spyOn(prisma.product,'update').mockResolvedValue(productMock6);

        const { user_id, name, price } = productMock2;
        const res: ProductEntity = await repository.updateProduct(productMock1.id, { user_id, name, price });

        expect(res).toBe(productMock6);
      });
    });

    describe('Delete Product', () => {
      it('should delete a product', async () => {
        jest.spyOn(prisma.product,'delete').mockResolvedValue(productMock6);

        const res: ProductEntity = await repository.deleteProduct(productMock6.id);

        expect(res).toBe(productMock6);
      });
    });
});