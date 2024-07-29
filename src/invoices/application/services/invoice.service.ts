import { Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';

import { SelectedFields } from '../../domain/types';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { Pagination } from '../../../common/domain/types';
import { Repository } from '../../../common/domain/entities';
import { productListCreation } from '../../../common/application/utils';
import { ProductList } from '../../../products/domain/types/product-list.type';
import { ProductListRepository } from '../../../products/application/decotators';
import { Cached } from '../../../common/application/decorators';

@Injectable()
export class InvoiceService {

    constructor(
        private invoiceRepository: Repository<InvoiceEntity>,
        @ProductListRepository() private productListRepository: Repository<ProductList>,
        @Cached() private cache: Cache
    ) {}

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
        await Promise.all([
            await this.cache.set('invoices-pagination', pagination),
            await this.cache.set('invoices-fields', selectedFields)
        ]);
        const cachedPagination = await this.cache.get('invoices-pagination');
        const cachedFields = await this.cache.get('invoices-fields');
        const cachedInvoices: Partial<InvoiceEntity>[] = await this.cache.get('invoices');

        if (cachedInvoices && cachedFields == selectedFields && cachedPagination == pagination) return cachedInvoices;

        const invoices = await this.invoiceRepository.findAll(userId, pagination, selectedFields);
        await this.cache.set('invoices', invoices);

        return invoices;
    }

    public async findOneInvoice(id: string, userId: string): Promise<Partial<InvoiceEntity>> {
        const cachedInvoice: Partial<InvoiceEntity> = await this.cache.get('product');

        if (cachedInvoice && cachedInvoice.id === id) return cachedInvoice;

        const invoice: Partial<InvoiceEntity> = await this.invoiceRepository.findOne(id);

        if (!invoice) return null;
        if (!(invoice.user_id === userId)) return undefined;

        const list: Partial<ProductList> = await this.productListRepository.findOne(invoice.id);
        
        invoice.products = list ? list.products : [];
        await this.cache.set('invoice', invoice);

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

        await this.cache.del('invoice');
        
        return this.invoiceRepository.delete(id);
    }
}
