import { Test, TestingModule } from '@nestjs/testing';
import { ProductListRepository } from './product-list.repositroy';
import { Collection, InsertOneResult, UpdateResult, DeleteResult, ObjectId } from 'mongodb';
import { ProductEntityList } from '../../../domain/entities/product-list.entity';
import { MongoProvider } from '../../../../database/infrastructure/providers/mongo-db/mongo.provider';
import { ProductList } from 'src/products/domain/types/product-list.type';

describe('ProductListRepository', () => {
  let repository: ProductListRepository;
  let mongoProvider: MongoProvider<ProductList>;
  let collection: Collection<ProductList>;

  const productListMock: ProductEntityList = {
    id: '1',
    name: 'Cloro',
    unit_price: 80.00,
    amount: 3,
    total: 240.00
  };

  const ProductListMock: ProductList = {
    id: 'invoice1',
    products: [productListMock]
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductListRepository,
        {
          provide: MongoProvider<ProductList>,
          useValue: {
            database: jest.fn().mockReturnValue({
              findOne: jest.fn(),
              insertOne: jest.fn(),
              updateOne: jest.fn(),
              deleteOne: jest.fn()
            })
          }
        }
      ]
    }).compile();

    repository = module.get<ProductListRepository>(ProductListRepository);
    mongoProvider = module.get<MongoProvider<ProductList>>(MongoProvider);
    collection = mongoProvider.database();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find one document by id', async () => {
    jest.spyOn(collection, 'findOne').mockResolvedValue(ProductListMock);
    const result = await repository.findOne('invoice1');
    expect(result).toEqual(ProductListMock);
  });

  it('should insert a document', async () => {
    const insertResult: InsertOneResult<ProductList> = { acknowledged: true, insertedId: 'invoice1' as any as ObjectId };
    jest.spyOn(collection, 'insertOne').mockResolvedValue(insertResult);
    const result = await repository.insert(ProductListMock);
    expect(result).toEqual(insertResult);
  });

  it('should update a document', async () => {
    const updateResult: UpdateResult = { acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedId: null, upsertedCount: 0 };
    jest.spyOn(collection, 'updateOne').mockResolvedValue(updateResult);
    const result = await repository.updateDoc('invoice1', ProductListMock);
    expect(result).toEqual(updateResult);
  });

  it('should delete a document', async () => {
    const deleteResult: DeleteResult = { acknowledged: true, deletedCount: 1 };
    jest.spyOn(collection, 'deleteOne').mockResolvedValue(deleteResult);
    const result = await repository.deleteDoc('invoice1');
    expect(result).toEqual(deleteResult);
  });
});
