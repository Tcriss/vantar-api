import { Injectable } from '@nestjs/common';

import { Repository } from '../decorators';
import { InvoiceRepositoryI } from '../../domain/interfaces';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { Pagination } from '../../../common/domain/types';
import { SelectedFields } from '../../domain/types';

@Injectable()
export class InvoiceService {

    constructor(@Repository() private repository: InvoiceRepositoryI) {}

    public async findAllInvoices(userId: string, page: string, selected?: string): Promise<Partial<InvoiceEntity>[]> {
        const pagination: Pagination = {
            skip: +page.split(',')[0],
            take: +page.split(',')[1]
        };
        const selectedFields: SelectedFields = selected ? {
            id: true,
            user_id: true,
            date: selected.includes('date'),
            total: selected.includes('total'),
            products: selected.includes('products')
        } : null;

        return this.repository.findAllInvoices(userId, pagination, selectedFields);
    }

    public async findOneInvoice(id: string, userId: string, selected?: string): Promise<Partial<InvoiceEntity>> {
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: true,
            date: selected.includes('date'),
            total: selected.includes('total'),
            products: selected.includes('products')
        } : null;
        const invoice: Partial<InvoiceEntity> = await this.repository.findOneInvoice(id, fields);

        if (!invoice) return null;
        if (!(invoice.user_id === userId)) return undefined;

        return invoice;
    }

    public async createInvoice(userId: string, invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        invoice.user_id = userId;

        return this.repository.createInvoice(invoice);
    }

    public async updateInvoice(id: string, userId: string, invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        const data: Partial<InvoiceEntity> = await this.findOneInvoice(id, userId);
        
        if (data == null) return null;
        if (data == undefined) return undefined;
        
        return this.repository.updateInvoice(id, invoice);
    }

    public async deleteInvoice(id: string, userId: string): Promise<InvoiceEntity> {
        const data: Partial<InvoiceEntity> = await this.findOneInvoice(id, userId);
        
        if (data == null) return null;
        if (data == undefined) return undefined;
        
        return this.repository.deleteInvoice(id);
    }
}
