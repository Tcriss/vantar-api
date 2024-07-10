import { Test, TestingModule } from '@nestjs/testing';

import { InvoiceController } from './invoice.controller';
import { mockInvoiceService } from '../../domain/mocks/invoice-providers.mock';
import { InvoiceService } from '../../application/services/invoice.service';
import { invoiceMock, invoiceMock1, invoiceMock2, partialInvoiceMock, partialInvoiceMock1, partialInvoiceMock2 } from 'src/invoices/domain/mocks/invoice..mock';
import { InvoiceEntity } from 'src/invoices/domain/entities/invoice.entity';
import { Roles } from 'src/common/domain/enums';
import { HttpException, HttpStatus } from '@nestjs/common';
import { userMock } from 'src/users/domain/entities/mocks/user.mocks';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService
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

      const res: Partial<InvoiceEntity>[] = await controller.findAll({
        user: {
          id: invoiceMock.user_id,
          name: '',
          email: '',
          role: Roles.CUSTOMER
        }
      }, { page: '0,10' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([invoiceMock, invoiceMock1]);
    });

    it('should find all products with pagination', async () => {
      jest.spyOn(service, 'findAllInvoices').mockResolvedValue([invoiceMock1]);

      const res: Partial<InvoiceEntity>[] = await controller.findAll({
        user: {
          id: invoiceMock.user_id,
          name: '',
          email: '',
          role: Roles.CUSTOMER
        }
      }, { page: '1,1' });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([invoiceMock1]);
    });

    it('should find all products with some fields', async () => {
      jest.spyOn(service, 'findAllInvoices').mockResolvedValue([
        partialInvoiceMock,
        partialInvoiceMock1,
        partialInvoiceMock2
      ]);

      const res: Partial<InvoiceEntity>[] = await controller.findAll({
        user: {
          id: invoiceMock.user_id,
          name: '',
          email: '',
          role: Roles.CUSTOMER
        }
      }, { page: '0,10', fields: 'id, user_id' });

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

      const res = await controller.findOne({
        user: {
          id: invoiceMock.user_id,
          email: '',
          name: '',
          role: Roles.CUSTOMER
        }
      }, invoiceMock.id);

      expect(res).toBe(invoiceMock);
    });

    it('should find one product with some fields', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(partialInvoiceMock1);

      const res = await controller.findOne({
          user: {
            id: invoiceMock1.user_id,
            email: '',
            name: '',
            role: Roles.CUSTOMER
          }
        }, 
        invoiceMock1.id,
        'name, user_id'
      );

      expect(res).toBe(partialInvoiceMock1);
    });

    it('should throw an exception if product was not found', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(null);

      try {
        await controller.findOne({
          user: {
            id: invoiceMock.user_id,
            email: '',
            name: '',
            role: Roles.CUSTOMER
          }
        }, invoiceMock.id, 'name, user_id');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Invoice not found');
      }
    });

    it('should throw an exception if user is not owner', async () => {
      jest.spyOn(service, 'findOneInvoice').mockResolvedValue(undefined);

      try {
        await controller.findOne({
          user: {
            id: invoiceMock1.user_id,
            email: '',
            name: '',
            role: Roles.CUSTOMER
          }
        }, invoiceMock2.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe('Forbidden resource');
      }
    });
  });

  describe('Create Invoice', () => {
    it('should create an invoice', async () => {
      jest.spyOn(service, 'createInvoice').mockResolvedValue(invoiceMock2);

      const { total, user_id } = invoiceMock2;
      const res = await controller.create({
        user: {
          id: invoiceMock2.user_id,
          name: '',
          email: '',
          role: Roles.CUSTOMER
        }
      }, { total, user_id });

      expect(res['message']).toBe('Invoice created successfully');
      expect(res['invoice']).toBe(invoiceMock2);
    });
  });

  describe('Update Invoice', () => {
    it('should update an invoice', async () => {
      jest.spyOn(service, 'updateInvoice').mockResolvedValue(invoiceMock2);

      const { total } = invoiceMock1;
      const res = await controller.update({
        user: {
          id: invoiceMock.user_id,
          name: '',
          email: '',
          role: Roles.CUSTOMER
        }
      }, { total }, invoiceMock.id);

      expect(res['message']).toBe('Invoice updated successfully');
      expect(res['invoice']).toBe(invoiceMock2);
    });

    it('should throw an exception if invoice was not found', async () => {
      jest.spyOn(service, 'updateInvoice').mockResolvedValue(null);

      const { total } = invoiceMock1;
      const { user_id } = invoiceMock;
      
      try {
        await controller.update({
          user: {
            id: invoiceMock.user_id,
            name: '',
            email: '',
            role: Roles.CUSTOMER
          }
        }, { total }, '123');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Invoice not found');
      }
    });

    it('should throw an exception if not the owner', async () => {
      jest.spyOn(service, 'updateInvoice').mockResolvedValue(undefined);

      const { total } = invoiceMock1;
      const { user_id } = invoiceMock;
      
      try {
        await controller.update({
          user: {
            id: invoiceMock.user_id,
            name: '',
            email: '',
            role: Roles.CUSTOMER
          }
        }, { total }, '123');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe('Forbidden resource');
      }
    });
  });

  describe('Delete Invoice', () => {
    it('should delete an invoice', async () => {
      jest.spyOn(service, 'deleteInvoice').mockResolvedValue(invoiceMock2);

      const res = await controller.delete({
        user: {
          id: invoiceMock2.user_id,
          name: '',
          email: '',
          role: Roles.CUSTOMER
        }
      }, invoiceMock2.id);

      expect(res['message']).toBe('Invoice deleted');
    });

    it('should throw an exception if invoice was not found', async () => {
      jest.spyOn(service, 'deleteInvoice').mockResolvedValue(null);

      try {
        await controller.delete({
          user: {
            id: invoiceMock.user_id,
            name: '',
            email: '',
            role: Roles.CUSTOMER
          }
        }, userMock.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.NOT_FOUND);
        expect(err.message).toBe('Invoice not found');
      }
    });

    it('should throw an exception if not the owner', async () => {
      jest.spyOn(service, 'deleteInvoice').mockResolvedValue(undefined);
      
      try {
        await controller.delete({
          user: {
            id: invoiceMock.user_id,
            name: '',
            email: '',
            role: Roles.CUSTOMER
          }
        }, userMock.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(err.message).toBe('Forbidden resource');
      }
    });
  });
});
