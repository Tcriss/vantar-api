import { Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';

import { SelectedFields } from '@invoices/domain/types';
import { InvoiceEntity } from '@invoices/domain/entities';
import { Pagination } from '@common/domain/types';
import { Repository } from '@common/domain/entities';
import { productListCreation } from '@common/application/utils';
import { Cached } from '@common/application/decorators';
import { ProductList } from '@products/domain/types';
import { ProductListRepository } from '@products/application/decotators';

@Injectable()
export class InvoiceService {

    constructor(
        private readonly invoiceRepository: Repository<InvoiceEntity>,
        @ProductListRepository() private readonly productListRepository: Repository<ProductList>,
        @Cached() private readonly cache: Cache
    ) {}

    public async findAllInvoices(userId: string, page: Pagination, selected?: string): Promise<Partial<InvoiceEntity>[]> {
        const selectedFields: SelectedFields = selected ? {
            id: true,
            shop_id: true,
            date: selected.includes('date'),
            total: selected.includes('total'),
        } : null;
        await Promise.all([
            await this.cache.set('invoices-pagination', page),
            await this.cache.set('invoices-fields', selectedFields)
        ]);
        const cachedPagination: Pagination = await this.cache.get('invoices-pagination');
        const cachedFields = await this.cache.get('invoices-fields');
        const cachedInvoices: Partial<InvoiceEntity>[] = await this.cache.get('invoices');

        if (cachedInvoices && cachedFields == selectedFields && cachedPagination == page) return cachedInvoices;

        const invoices = await this.invoiceRepository.findAll(userId, page, selectedFields);
        await this.cache.set('invoices', invoices);

        return invoices;
    }

    public async findOneInvoice(id: string): Promise<Partial<InvoiceEntity>> {
        const cachedInvoice: Partial<InvoiceEntity> = await this.cache.get('product');

        if (cachedInvoice && cachedInvoice.id === id) return cachedInvoice;

        const invoice: Partial<InvoiceEntity> = await this.invoiceRepository.findOne(id);

        if (!invoice) return null;

        const list: Partial<ProductList> = await this.productListRepository.findOne(invoice.id);
        
        invoice.products = list ? list.products : [];
        await this.cache.set('invoice', invoice);

        return invoice;
    }
    
    public async createInvoice(invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        const { list, subtotal } = productListCreation(invoice.products, 0);

        invoice.total = subtotal;

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

    public async updateInvoice(id: string, invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        const data: Partial<InvoiceEntity> = await this.findOneInvoice(id);
        
        if (!data) return null;

        const { list, subtotal } = productListCreation(invoice.products, 0);
        const [ updatedInvoice, updatedProductList ] = await Promise.all([
            this.invoiceRepository.update(id, { total: subtotal }),
            this.productListRepository.updateDoc(id, { id: id, products: list })
        ]);

        if (!updatedInvoice || !updatedProductList) return null;

        updatedInvoice.products = list;

        return updatedInvoice;
    }

    public async deleteInvoice(id: string): Promise<InvoiceEntity> {
        const data: Partial<InvoiceEntity> = await this.findOneInvoice(id);
        
        if (!data) return null;

        const res = await this.productListRepository.deleteDoc(id);

        if (!res) return null;

        await this.cache.del('invoice');
        
        return this.invoiceRepository.delete(id);
    }
}
