import { Test, TestingModule } from "@nestjs/testing";

import { ProductListRepository } from "./product-list.repositroy";
import { MongoProvider } from "../../../../database/infrastructure/providers/mongo-db/mongo.provider";
import { mongoMock } from "../../../../products/domain/mocks/product-providers.mock";

describe('', () => {
    let repository: ProductListRepository;
    let mongo: MongoProvider;
  
    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
            ProductListRepository,
          {
            provide: MongoProvider,
            useValue: mongoMock
          }
        ],
      }).compile();
  
      repository = module.get<ProductListRepository>(ProductListRepository);
      mongo = module.get<MongoProvider>(MongoProvider);
    });
  
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });
})