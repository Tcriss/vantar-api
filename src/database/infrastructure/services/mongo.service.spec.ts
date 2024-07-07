import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'mongodb';

import { MongoProvider } from '../providers/mongo-db/mongo.provider';
import { MongoService } from './mongo.service';

describe('MongoService', () => {
  let service: MongoService<any>;
  let mongoProviderMock: MongoProvider;
  let configServiceMock: ConfigService;

  beforeEach(async () => {
    mongoProviderMock = {
      db: jest.fn().mockReturnThis(),
      collection: jest.fn(),
    } as any;

    configServiceMock = {
      get: jest.fn().mockReturnValue('test_db_name'),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoService,
        { provide: MongoProvider, useValue: mongoProviderMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<MongoService<any>>(MongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a collection', () => {
    const collectionName = 'test_collection';
    const collectionMock: Partial<Collection<any>> = {};
    mongoProviderMock.db().collection = jest.fn().mockReturnValue(collectionMock);

    const result = service.getProductList(collectionName);
    expect(mongoProviderMock.db).toHaveBeenCalledWith('test_db_name');
    expect(mongoProviderMock.db().collection).toHaveBeenCalledWith(collectionName);
    expect(result).toBe(collectionMock);
  });
});
