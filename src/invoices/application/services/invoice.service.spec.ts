import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';

import { InvoiceService } from './invoice.service';
import { InvoiceRepositoryToken } from '../../domain/interfaces';
import { invoiceMock, invoiceMock1, invoiceMock2, partialInvoiceMock, partialInvoiceMock1 } from '../../domain/mocks/invoice..mock';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { mockInvoiceRepository } from '../../domain/mocks/invoice-providers.mock';
import { ProductListRepositoryToken } from '../../../products/application/decotators/product-list-repository.decorator';
import { mockProductListRepository } from '../../../products/domain/mocks/product-providers.mock';
import { Repository } from '../../../common/domain/entities';
import { ProductList } from '../../../products/domain/entities/product-list.entity';
import { InvoiceProductList } from '../../../invoices/domain/types';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let repository: Repository<InvoiceEntity>;
  let productListRepository: Repository<InvoiceProductList>

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: InvoiceRepositoryToken,
          useValue: mockInvoiceRepository
        },
        {
          provide: ProductListRepositoryToken,
          useValue: mockProductListRepository
        }
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    repository = module.get<Repository<InvoiceEntity>>(InvoiceRepositoryToken);
    productListRepository = module.get<Repository<InvoiceProductList>>(ProductListRepositoryToken)
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Find All Invoices', () => {
    const { user_id } = invoiceMock;
    it('should fetch all invoices', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([invoiceMock, invoiceMock1, invoiceMock2]);

      const res: Partial<InvoiceEntity>[] = await service.findAllInvoices('0,10', user_id);

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([invoiceMock, invoiceMock1, invoiceMock2]);
    });

    it('should fetch all invoices from pagination', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([invoiceMock2]);

      const res: Partial<InvoiceEntity>[] = await service.findAllInvoices(user_id, '1,1');

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([invoiceMock2]);
    });

    it('should fetch all invoices with some fields', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([partialInvoiceMock, partialInvoiceMock1]);

      const res: Partial<InvoiceEntity>[] = await service.findAllInvoices(user_id, '1,1', 'name, inventory_id');

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([partialInvoiceMock, partialInvoiceMock1]);
    });
  });

  describe('Find One Invoices', () => {
    it('should find one invoices', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(invoiceMock1);

      const res: Partial<InvoiceEntity> = await service.findOneInvoice(invoiceMock1.id, invoiceMock1.user_id);

      expect(res).toBe(invoiceMock1);
    });

    it('should find one invoices with some fields', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(partialInvoiceMock1);

      const res: Partial<InvoiceEntity> = await service.findOneInvoice(invoiceMock1.id, invoiceMock1.user_id);

      expect(res).toBe(partialInvoiceMock1);
    });

    it('should return undefined if not the owner', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(invoiceMock1);

      const res: Partial<InvoiceEntity> = await service.findOneInvoice(invoiceMock2.id, invoiceMock2.user_id);

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const res: Partial<InvoiceEntity> = await service.findOneInvoice(invoiceMock.id, invoiceMock.user_id);

      expect(res).toBeNull();
    });
  });

  describe('Create Invoice', () => {
    it('should create a invoice', async () => {
      jest.spyOn(productListRepository, 'insert').mockResolvedValue({
        acknowledged: true,
        insertedId: new ObjectId("60b8d3f60e841169c1e8c1a9")
      });
      jest.spyOn(repository, 'create').mockResolvedValue(invoiceMock2);

      const { user_id } = invoiceMock2;
      const res: InvoiceEntity = await service.createInvoice(user_id, {
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

      const { id, user_id } = invoiceMock1
      const res: InvoiceEntity = await service.updateInvoice(id, user_id, {
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

    it('should return undefined if not the owner', async () => {;
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(invoiceMock1);

      const { total, user_id } = invoiceMock;
      const res: Partial<InvoiceEntity> = await service.updateInvoice(invoiceMock1.id, user_id, { total });

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(null);

      const { total } = invoiceMock;
      const res: InvoiceEntity = await service.updateInvoice(invoiceMock1.id, invoiceMock1.user_id, { total });

      expect(res).toBeNull()
    });
  });

  describe('Delete Invoice', () => {
    const { id, user_id } = invoiceMock1;

    it('should delete invoice', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(invoiceMock1);
      jest.spyOn(productListRepository, 'deleteDoc').mockResolvedValue({acknowledged: true, deletedCount: 1})
      jest.spyOn(repository,'delete').mockResolvedValue(invoiceMock1);

      const res: InvoiceEntity = await service.deleteInvoice(id, user_id);

      expect(res).toBe(invoiceMock1);
    });

    it('should return undefined if not the owner', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(invoiceMock1);
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      const res: Partial<InvoiceEntity> = await service.deleteInvoice(invoiceMock.id, user_id);

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const res: InvoiceEntity = await service.deleteInvoice(id, user_id);

      expect(res).toBeNull();
    });
  });
});