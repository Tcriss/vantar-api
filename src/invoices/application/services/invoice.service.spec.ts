import { Test, TestingModule } from '@nestjs/testing';

import { InvoiceService } from './invoice.service';
import { InvoiceRepositoryI, InvoiceRepositoryToken } from '../../domain/interfaces';
import { invoiceMock, invoiceMock1, invoiceMock2, partialInvoiceMock, partialInvoiceMock1 } from '../../domain/mocks/invoice..mock';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { mockInvoiceRepository } from '../../domain/mocks/invoice-providers.mock';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let repository: InvoiceRepositoryI;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: InvoiceRepositoryToken,
          useValue: mockInvoiceRepository
        }
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    repository = module.get<InvoiceRepositoryI>(InvoiceRepositoryToken);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Find All Invoices', () => {
    const { user_id } = invoiceMock;
    it('should fetch all invoices', async () => {
      jest.spyOn(repository, 'findAllInvoices').mockResolvedValue([invoiceMock, invoiceMock1, invoiceMock2]);

      const res: Partial<InvoiceEntity>[] = await service.findAllInvoices('0,10', user_id);

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([invoiceMock, invoiceMock1, invoiceMock2]);
    });

    it('should fetch all invoices from pagination', async () => {
      jest.spyOn(repository, 'findAllInvoices').mockResolvedValue([invoiceMock2]);

      const res: Partial<InvoiceEntity>[] = await service.findAllInvoices(user_id, '1,1');

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([invoiceMock2]);
    });

    it('should fetch all invoices with some fields', async () => {
      jest.spyOn(repository, 'findAllInvoices').mockResolvedValue([partialInvoiceMock, partialInvoiceMock1]);

      const res: Partial<InvoiceEntity>[] = await service.findAllInvoices(user_id, '1,1', 'name, inventory_id');

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([partialInvoiceMock, partialInvoiceMock1]);
    });
  });

  describe('Find One Invoices', () => {
    it('should find one invoices', async () => {
      jest.spyOn(repository, 'findOneInvoice').mockResolvedValue(invoiceMock1);

      const res: Partial<InvoiceEntity> = await service.findOneInvoice(invoiceMock1.id, invoiceMock1.user_id);

      expect(res).toBe(invoiceMock1);
    });

    it('should find one invoices with some fields', async () => {
      jest.spyOn(repository, 'findOneInvoice').mockResolvedValue(partialInvoiceMock1);

      const res: Partial<InvoiceEntity> = await service.findOneInvoice(invoiceMock1.id, invoiceMock1.user_id, 'id, user_id');

      expect(res).toBe(partialInvoiceMock1);
    });

    it('should return undefined if not the owner', async () => {
      jest.spyOn(repository, 'findOneInvoice').mockResolvedValue(invoiceMock1);

      const res: Partial<InvoiceEntity> = await service.findOneInvoice(invoiceMock2.id, invoiceMock2.user_id);

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(repository, 'findOneInvoice').mockResolvedValue(null);

      const res: Partial<InvoiceEntity> = await service.findOneInvoice(invoiceMock.id, invoiceMock.user_id);

      expect(res).toBeNull();
    });
  });

  describe('Create One Invoice', () => {
    it('should create a invoice', async () => {
      jest.spyOn(repository, 'createInvoice').mockResolvedValue(invoiceMock2);

      const { total, user_id } = invoiceMock2;
      const res: InvoiceEntity = await service.createInvoice(user_id, { total });

      expect(res).toBe(invoiceMock2);
    });
  });

  describe('Update Invoice', () => {
    it('should update invoice', async () => {
      jest.spyOn(repository, 'findOneInvoice').mockResolvedValue(invoiceMock1);
      jest.spyOn(repository,'updateInvoice').mockResolvedValue(invoiceMock2);

      const { total } = invoiceMock;
      const { id, user_id } = invoiceMock1
      const res: InvoiceEntity = await service.updateInvoice(id, user_id, { total });

      expect(res).toBe(invoiceMock2);
    });

    it('should return undefined if not the owner', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(invoiceMock1);
      jest.spyOn(repository, 'updateInvoice').mockResolvedValue(undefined);

      const { total, user_id } = invoiceMock;
      const res: Partial<InvoiceEntity> = await service.updateInvoice(invoiceMock1.id, user_id, { total });

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(null);
      //jest.spyOn(repository, 'updateInvoice').mockResolvedValue(null);

      const { total } = invoiceMock;
      const res: InvoiceEntity = await service.updateInvoice(invoiceMock1.id, invoiceMock1.user_id, { total });

      expect(res).toBeNull()
    });
  });

  describe('Delete Invoice', () => {
    const { id, user_id } = invoiceMock1;

    it('should delete invoice', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(invoiceMock1);
      jest.spyOn(repository,'deleteInvoice').mockResolvedValue(invoiceMock1);

      const res: InvoiceEntity = await service.deleteInvoice(id, user_id);

      expect(res).toBe(invoiceMock1);
    });

    it('should return undefined if not the owner', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(invoiceMock);
      //jest.spyOn(repository, 'deleteInvoice').mockResolvedValue(undefined);

      const res: Partial<InvoiceEntity> = await service.deleteInvoice(invoiceMock.id, user_id);

      expect(res).toBeUndefined();
    });

    it('should return null if product was not found', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(null);
      //jest.spyOn(repository, 'deleteInvoice').mockResolvedValue(null);

      const res: InvoiceEntity = await service.deleteInvoice(id, user_id);

      expect(res).toBeNull();
    });
  });
});