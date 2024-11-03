import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { InvoiceController } from './invoice.controller';
import { InvoiceEntity } from '@invoices/domain/entities';
import { productListMock } from '@products/domain/mocks';
import { mockInvoiceService, invoiceMock, invoiceMock1, invoiceMock2, partialInvoiceMock, partialInvoiceMock1, partialInvoiceMock2 } from '@invoices/domain/mocks';
import { prismaMock } from '@shops/domain/mocks';
import { CreateProductListDto } from '@products/domain/dtos';
import { InvoiceService } from '@invoices/application/services';
import { PrismaProvider } from '@database/infrastructure/providers';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService
        },
        {
          provide: PrismaProvider,
          useValue: prismaMock
        }
      ],
      controllers: [InvoiceController],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Find All Invoices', () => {
    it('should find all products', async () => {
      jest.spyOn(service, 'findAllInvoices').mockResolvedValue([invoiceMock, invoiceMock1]);

      const res: Partial<InvoiceEntity>[] = await controller.findAll({ page: 1, limit: 10, shop: '123' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([invoiceMock, invoiceMock1]);
    });

    it('should find all products with pagination', async () => {
      jest.spyOn(service, 'findAllInvoices').mockResolvedValue([invoiceMock1]);

      const res: Partial<InvoiceEntity>[] = await controller.findAll({ page: 1, limit: 10, shop: '123' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([invoiceMock1]);
    });

    it('should find all products with some fields', async () => {
      jest.spyOn(service, 'findAllInvoices').mockResolvedValue([
        partialInvoiceMock,
        partialInvoiceMock1,
        partialInvoiceMock2
      ]);

      const res: Partial<InvoiceEntity>[] = await controller.findAll({ page: 1, limit: 10, shop: '123' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([
        partialInvoiceMock,
        partialInvoiceMock1,
        partialInvoiceMock2
      ]);
    });
  });

  describe('Find One Invoice', () => {
    it('should find one product', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(invoiceMock);

      const res = await controller.findOne(invoiceMock.id);

      expect(res).toBe(invoiceMock);
    });

    it('should find one product with some fields', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(partialInvoiceMock1);

      const res = await controller.findOne(invoiceMock1.id, 'name, user_id');

      expect(res).toBe(partialInvoiceMock1);
    });

    it('should throw an exception if product was not found', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(null);

      try {
        await controller.findOne(invoiceMock.id, 'name, user_id');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Invoice not found');
      }
    });

    it('should throw an exception if user is not owner', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(undefined);

      try {
        await controller.findOne(invoiceMock2.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Invoice not found');
      }
    });
  });

  describe('Create Invoice', () => {
    it('should create an invoice', async () => {
      jest.spyOn(service, 'createInvoice').mockResolvedValue(invoiceMock2);

      const res = await controller.create({
        shop_id: '1',
        products: [productListMock as CreateProductListDto]
      });

      expect(res['message']).toBe('Invoice created successfully');
      expect(res['invoice']).toBe(invoiceMock2);
    });
  });

  describe('Update Invoice', () => {
    it('should update an invoice', async () => {
      jest.spyOn(service, 'updateInvoice').mockResolvedValue(invoiceMock2);

      const res = await controller.update({ products: [productListMock] }, invoiceMock.id);

      expect(res['message']).toBe('Invoice updated successfully');
      expect(res['invoice']).toBe(invoiceMock2);
    });

    it('should throw an exception if invoice was not found', async () => {
      jest.spyOn(service, 'updateInvoice').mockResolvedValue(null);
      
      try {
        await controller.update({ products: [productListMock] }, '123');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Invoice not found');
      }
    });
  });

  describe('Delete Invoice', () => {
    it('should delete an invoice', async () => {
      jest.spyOn(service, 'deleteInvoice').mockResolvedValue(invoiceMock2);

      const res = await controller.delete(invoiceMock2.id);

      expect(res['message']).toBe('Invoice deleted');
    });

    it('should throw an exception if invoice was not found', async () => {
      jest.spyOn(service, 'deleteInvoice').mockResolvedValue(null);

      try {
        await controller.delete(invoiceMock.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Invoice not found');
      }
    });
  });
});
