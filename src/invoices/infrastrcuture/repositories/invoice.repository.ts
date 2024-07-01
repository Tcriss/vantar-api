import { Injectable } from '@nestjs/common';

import { Pagination } from '../../../common/domain/types';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { InvoiceRepositoryI } from '../../domain/interfaces';
import { SelectedFields } from '../../domain/types';
import { PrismaProvider } from '../../../prisma/infrastructure/providers/prisma.provider';

@Injectable()
export class InvoiceRepository implements InvoiceRepositoryI {

    constructor(private prisma: PrismaProvider) {}

    public async findAllInvoices(userId: string, page: Pagination, fields?: SelectedFields, q?: string): Promise<Partial<InvoiceEntity>[]> {
        return this.prisma.invoice.findMany({
            where: { id: userId },
            select: fields,
            take: page.take,
            skip: page.skip
        });
    }

    public async findOneInvoice(id: string, fields?: SelectedFields): Promise<Partial<InvoiceEntity>> {
        return this.prisma.invoice.findUnique({
            where: { id: id },
            select: fields
        })
    }

    public async createInvoice(invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        return this.prisma.invoice.create({ data: {
            total: invoice.total,
            user_id: invoice.user_id
        }});
    }

    public async updateInvoice(id: string, invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        return this.prisma.invoice.update({
            where: { id: id },
            data: invoice
        });
    }

    public async deleteInvoice(id: string): Promise<InvoiceEntity> {
        return this.prisma.invoice.delete({ where: { id: id }});
    }
}
