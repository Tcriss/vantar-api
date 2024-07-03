import { Test, TestingModule } from '@nestjs/testing';

import { InvoiceRepository } from './invoice.repository';
import { PrismaProvider } from '../../../../database/infrastructure/providers/prisma/prisma.provider';
import { prismaMock } from '../../../domain/mocks/invoice-providers.mock';
import { invoiceMock, invoiceMock1, invoiceMock2, partialInvoiceMock } from 'src/invoices/domain/mocks/invoice..mock';
import { InvoiceEntity } from '../../../domain/entities/invoice.entity';

describe('Repositories', () => {
  let repository: InvoiceRepository;
  let prisma: PrismaProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceRepository,
        {
          provide: PrismaProvider,
          useValue: prismaMock
        }
      ],
    }).compile();

    repository = module.get<InvoiceRepository>(InvoiceRepository);
    prisma = module.get<PrismaProvider>(PrismaProvider);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Find All Invoices', () => {
    it('should fetch all products', async () => {
      jest.spyOn(prisma.invoice, 'findMany').mockResolvedValue([ invoiceMock, invoiceMock1, invoiceMock2 ]);

      const id: string = 'b5c2d3e4-5678-901a-bcde-fghij2345678';
      const res: Partial<InvoiceEntity>[] = await repository.findAllInvoices(id, { take: 10, skip: 0 });

      expect(res).toBeInstanceOf(Array);
      expect(res).toEqual([ invoiceMock, invoiceMock1, invoiceMock2 ]);
    });

    it('should fetch what pagination indicates', async () => {
      jest.spyOn(prisma.invoice, 'findMany').mockResolvedValue([ invoiceMock2 ]);

      const id: string = 'b5c2d3e4-5678-901a-bcde-fghij2345678';
      const res: Partial<InvoiceEntity>[] = await repository.findAllInvoices(id, { take: 1, skip: 2 });

      expect(res).toHaveLength(1);
      expect(res).toEqual([ invoiceMock2 ]);
    });
  });

  describe('Find One Invoice', () => {
    it('should fecth one prodcut', async () => {
      jest.spyOn(prisma.invoice, 'findUnique').mockResolvedValue(invoiceMock);

      const res: Partial<InvoiceEntity> = await repository.findOneInvoice(invoiceMock.id);

      expect(res).toBe(invoiceMock);
    });
  });

  describe('Create Invoice', () => {
    it('should create a product', async () => {
      jest.spyOn(prisma.invoice,'create').mockResolvedValue(invoiceMock);

      const { total, user_id } = invoiceMock;
      const res: InvoiceEntity = await repository.createInvoice({ user_id, total });

      expect(res).toBe(invoiceMock);
    });
  });

  describe('Update Invoice', () => {
    it('should update a product', async () => {
      jest.spyOn(prisma.invoice,'update').mockResolvedValue(invoiceMock);

      const { total, user_id } = invoiceMock;
      const res: InvoiceEntity = await repository.updateInvoice(user_id, { total });

      expect(res).toBe(invoiceMock);
    });
  });

  describe('Delete Invoice', () => {
    it('should delete a product', async () => {
      jest.spyOn(prisma.invoice,'delete').mockResolvedValue(invoiceMock);

      const res: InvoiceEntity = await repository.deleteInvoice(invoiceMock.id);

      expect(res).toBe(invoiceMock);
    });
  });
});
