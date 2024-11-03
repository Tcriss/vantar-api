import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { ObjectId } from 'mongodb';

import { InvoiceService } from './invoice.service';
import { InvoiceEntity } from '@invoices/domain/entities';
import { InvoiceProductList } from '@invoices/domain/types';
import { invoiceMock, invoiceMock1, invoiceMock2, partialInvoiceMock, partialInvoiceMock1, mockInvoiceRepository } from '@invoices/domain/mocks';
import { Repository } from '@common/domain/entities';
import { mockProductListRepository } from '@products/domain/mocks';
import { ProductListRepositoryToken } from '@products/application/decotators';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let repository: Repository<InvoiceEntity>;
  let productListRepository: Repository<InvoiceProductList>

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: Repository<InvoiceEntity>,
          useValue: mockInvoiceRepository
        },
        {
          provide: ProductListRepositoryToken,
          useValue: mockProductListRepository
        }
      ],
      imports: [CacheModule.register({ ttl: (60 ^ 2) * 1000 })]
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    repository = module.get<Repository<InvoiceEntity>>(Repository<InvoiceEntity>);
    productListRepository = module.get<Repository<InvoiceProductList>>(ProductListRepositoryToken)
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Find All Invoices', () => {
    it('should fetch all invoices', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([invoiceMock, invoiceMock1, invoiceMock2]);

      const res: Partial<InvoiceEntity>[] = await service.findAllInvoices('123',{ take: 10, skip: 0 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([invoiceMock, invoiceMock1, invoiceMock2]);
    });

    it('should fetch all invoices from pagination', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([invoiceMock2]);

      const res: Partial<InvoiceEntity>[] = await service.findAllInvoices('123',{ take: 10, skip: 0 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([invoiceMock2]);
    });

    it('should fetch all invoices with some fields', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([partialInvoiceMock, partialInvoiceMock1]);

      const res: Partial<InvoiceEntity>[] = await service.findAllInvoices('123', { take: 10, skip: 0 }, 'name, inventory_id');

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([partialInvoiceMock, partialInvoiceMock1]);
    });
  });

  describe('Find One Invoices', () => {
    it('should find one invoices', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(invoiceMock1);

      const res: Partial<InvoiceEntity> = await service.findOneInvoice(invoiceMock1.id);

      expect(res).toBe(invoiceMock1);
    });

    it('should find one invoices with some fields', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(partialInvoiceMock1);

      const res: Partial<InvoiceEntity> = await service.findOneInvoice(invoiceMock1.id);

      expect(res).toBe(partialInvoiceMock1);
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const res: Partial<InvoiceEntity> = await service.findOneInvoice(invoiceMock.id);

      expect(res).toBeNull();
    });
  });

  describe('Create Invoice', () => {
    it('should create an invoice', async () => {
      jest.spyOn(productListRepository, 'insert').mockResolvedValue({
        acknowledged: true,
        insertedId: new ObjectId("60b8d3f60e841169c1e8c1a9")
      });
      jest.spyOn(repository, 'create').mockResolvedValue(invoiceMock2);

      const res: InvoiceEntity = await service.createInvoice({
        shop_id: invoiceMock2.shop_id,
        products: [
          {
            id: '1',
            name: 'Cloro',
            unit_price: 80.00,
            amount: 3,
            total: 240.00,
          }
        ]
      });

      expect(res).toBe(invoiceMock2);
    });
  });

  describe('Update Invoice', () => {
    it('should update invoice', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(invoiceMock1);
      jest.spyOn(productListRepository, 'updateDoc').mockResolvedValue({
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 1
      })
      jest.spyOn(repository,'update').mockResolvedValue(invoiceMock1);

      const { id, shop_id } = invoiceMock1
      const res: InvoiceEntity = await service.updateInvoice(id, {
        shop_id,
        products: [
          {
            id: '1',
            name: 'Cloro',
            unit_price: 80.00,
            amount: 3,
            total: 240.00,
          }
        ]
      });

      expect(res).toBe(invoiceMock1);
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(null);

      const { total } = invoiceMock;
      const res: InvoiceEntity = await service.updateInvoice(invoiceMock1.id, { total });

      expect(res).toBeNull()
    });
  });

  describe('Delete Invoice', () => {
    const { id } = invoiceMock1;

    it('should delete invoice', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(invoiceMock1);
      jest.spyOn(productListRepository, 'deleteDoc').mockResolvedValue({acknowledged: true, deletedCount: 1})
      jest.spyOn(repository,'delete').mockResolvedValue(invoiceMock1);

      const res: InvoiceEntity = await service.deleteInvoice(id);

      expect(res).toBe(invoiceMock1);
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const res: InvoiceEntity = await service.deleteInvoice(id);

      expect(res).toBeNull();
    });
  });
});