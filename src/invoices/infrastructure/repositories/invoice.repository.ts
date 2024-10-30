import { Injectable } from '@nestjs/common';

import { Pagination } from '../../../common/domain/types';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { SelectedFields } from '../../domain/types';
import { PrismaProvider } from '../../../database/infrastructure/providers/prisma/prisma.provider';
import { Repository } from '../../../common/domain/entities';

@Injectable()
export class InvoiceRepository implements Partial<Repository<InvoiceEntity>> {

    constructor(private readonly prisma: PrismaProvider) {}

    public async findAll(userId: string, page: Pagination, fields?: SelectedFields, q?: string): Promise<Partial<InvoiceEntity>[]> {
        return this.prisma.invoice.findMany({
            where: { user_id: userId },
            select: fields,
            take: page.take,
            skip: page.skip
        });
    }

    public async findOne(id: string, fields?: SelectedFields): Promise<Partial<InvoiceEntity>> {
        return this.prisma.invoice.findUnique({
            where: { id: id },
            select: fields
        })
    }

    public async create(invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        return this.prisma.invoice.create({ data: {
            total: invoice.total,
            user_id: invoice.user_id
        }});
    }

    public async update(id: string, invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        return this.prisma.invoice.update({
            where: { id: id },
            data: invoice
        });
    }

    public async delete(id: string): Promise<InvoiceEntity> {
        return this.prisma.invoice.delete({ where: { id: id }});
    }
}
