import { Test, TestingModule } from '@nestjs/testing';

import { ProductListRepository } from './product-list.repositroy';
import { MongoProvider } from '../../../../database/infrastructure/providers/mongo-db/mongo.provider';
import { collectionMock, mongoMock } from '../../../domain/mocks/product-providers.mock';
import { InvoiceProductList } from 'src/invoices/domain/types';
import { Collection } from 'mongodb';
import { MongoService } from 'src/database/infrastructure/services/mongo.service';

describe('', () => {
  let repository: ProductListRepository;
  let mongo: MongoService<InvoiceProductList>;
  let collection: Collection<InvoiceProductList>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductListRepository,
        {
          provide: MongoService,
          useValue: mongoMock,
        },
      ],
    }).compile();

    repository = module.get<ProductListRepository>(ProductListRepository);
    mongo = module.get<MongoService<InvoiceProductList>>(MongoProvider);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get Collection', () => {
    it('should get collection', () => {
      jest.spyOn(mongo, 'getProductList').mockResolvedValue(collectionMock.collection);

      collection = mongo.getProductList('list');
    });
  })

  describe('Find List', () => {
    it('should ')
  });

  describe('Create List', () => {
    jest.spyOn(collection, )
  });

  describe('Update List', () => {});

  describe('Delete List', () => {});
});
