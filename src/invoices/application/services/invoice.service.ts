import { Injectable } from '@nestjs/common';

import { InvoiceProductList, SelectedFields } from '../../domain/types';
import { ProductListRepository } from '../../../products/application/decotators';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { Pagination } from '../../../common/domain/types';
import { Repository } from '../../../common/domain/entities';
import { InvoiceRepository } from '../decorators';
import { productListCreation } from '../../../common/application/utils';

@Injectable()
export class InvoiceService {

    constructor(
        @InvoiceRepository() private invoiceRepository: Repository<InvoiceEntity>,
        @ProductListRepository() private productListRepository: Repository<InvoiceProductList>
    ) {
        this.productListRepository.setCollection('product-history');
    }

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
        } : null;

        return this.invoiceRepository.findAll(userId, pagination, selectedFields);
    }

    public async findOneInvoice(id: string, userId: string): Promise<Partial<InvoiceEntity>> {
        const invoice: Partial<InvoiceEntity> = await this.invoiceRepository.findOne(id);

        if (!invoice) return null;
        if (!(invoice.user_id === userId)) return undefined;

        const list: Partial<InvoiceProductList> = await this.productListRepository.findOne(invoice.id);
        
        invoice.products = list ? list.products : [];
        return invoice;
    }
    
    public async createInvoice(userId: string, invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        const { list, subtotal } = productListCreation(invoice.products, 0);

        invoice.total = subtotal;
        invoice.user_id = userId;

        const newInvoice: InvoiceEntity = await this.invoiceRepository.create(invoice);

        if (!newInvoice) return null;

        const productsResult = await this.productListRepository.insert({
            id: newInvoice.id,
            products: list
        });

        if (!productsResult) return null;

        newInvoice.products = list;

        return newInvoice;
    }

    public async updateInvoice(id: string, userId: string, invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        const data: Partial<InvoiceEntity> = await this.findOneInvoice(id, userId);
        
        if (!data) return null;
        if (data.user_id !== userId) return undefined;

        const { list, subtotal } = productListCreation(invoice.products, 0);
        const [ updatedInvoice, updatedProductList ] = await Promise.all([
            this.invoiceRepository.update(id, { total: subtotal }),
            this.productListRepository.updateDoc(id, { id: id, products: list })
        ]);

        if (!updatedInvoice || !updatedProductList) return null;

        updatedInvoice.products = list;

        return updatedInvoice;
    }

    public async deleteInvoice(id: string, userId: string): Promise<InvoiceEntity> {
        const data: Partial<InvoiceEntity> = await this.findOneInvoice(id, userId);
        
        if (!data) return null;
        if (data.user_id !== userId) return undefined;

        const res = await this.productListRepository.deleteDoc(id);

        if (!res) return null;
        
        return this.invoiceRepository.delete(id);
    }
}
