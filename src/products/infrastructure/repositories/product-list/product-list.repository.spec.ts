import { Test, TestingModule } from '@nestjs/testing';
import { ProductListRepository } from './product-list.repositroy';
import { MongoService } from '../../../../database/infrastructure/services/mongo.service';
import { Collection, InsertOneResult, UpdateResult, DeleteResult, ObjectId } from 'mongodb';
import { InvoiceProductList } from '../../../../invoices/domain/types';
import { ProductList } from '../../../domain/entities/product-list.entity';

describe('ProductListRepository', () => {
  let repository: ProductListRepository;
  let mongoService: MongoService<InvoiceProductList>;
  let collection: Collection<InvoiceProductList>;

  const productListMock: ProductList = {
    id: '1',
    name: 'Cloro',
    unit_price: 80.00,
    amount: 3,
    total: 240.00
  };

  const invoiceProductListMock: InvoiceProductList = {
    id: 'invoice1',
    products: [productListMock]
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductListRepository,
        {
          provide: MongoService,
          useValue: {
            getProductList: jest.fn().mockReturnValue({
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
    mongoService = module.get<MongoService<InvoiceProductList>>(MongoService);
    collection = mongoService.getProductList('test');
    repository.setCollection('test');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find one document by id', async () => {
    jest.spyOn(collection, 'findOne').mockResolvedValue(invoiceProductListMock);
    const result = await repository.findOne('invoice1');
    expect(result).toEqual(invoiceProductListMock);
  });

  it('should insert a document', async () => {
    const insertResult: InsertOneResult<InvoiceProductList> = { acknowledged: true, insertedId: 'invoice1' as any as ObjectId };
    jest.spyOn(collection, 'insertOne').mockResolvedValue(insertResult);
    const result = await repository.insert(invoiceProductListMock);
    expect(result).toEqual(insertResult);
  });

  it('should update a document', async () => {
    const updateResult: UpdateResult = { acknowledged: true, matchedCount: 1, modifiedCount: 1, upsertedId: null, upsertedCount: 0 };
    jest.spyOn(collection, 'updateOne').mockResolvedValue(updateResult);
    const result = await repository.updateDoc('invoice1', invoiceProductListMock);
    expect(result).toEqual(updateResult);
  });

  it('should delete a document', async () => {
    const deleteResult: DeleteResult = { acknowledged: true, deletedCount: 1 };
    jest.spyOn(collection, 'deleteOne').mockResolvedValue(deleteResult);
    const result = await repository.deleteDoc('invoice1');
    expect(result).toEqual(deleteResult);
  });
});
