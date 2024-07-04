import { Injectable } from '@nestjs/common';

import { InvoiceProductList, SelectedFields } from '../../domain/types';
import { ProductListRepository } from '../../../products/application/decotators';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { ProductList } from '../../../products/domain/entities/product-list.entity';
import { Pagination } from '../../../common/domain/types';
import { Repository } from '../../../common/domain/entities';
import { InvoiceRepository } from '../decorators';

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
        let invoiceTotal: number = 0;
        const list: ProductList[] = invoice.products.map(product => {
            const newProduct = {
                unit_price: product.unit_price,
                amount: product.amount,
                name: product.name,
                total: product.unit_price * product.amount
            };
            invoiceTotal += newProduct.total;
            return newProduct;
        });

        invoice.total = invoiceTotal;
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
        
        let invoiceTotal: number = 0;
        const list: ProductList[] = invoice.products.map(product => {
            const newProduct = {
                unit_price: product.unit_price,
                amount: product.amount,
                name: product.name,
                total: product.unit_price * product.amount
            };
            invoiceTotal += newProduct.total;
            return newProduct;
        });
        const productList: InvoiceProductList = {
            products: list,
            id: id,
        };
        const productListRes = await this.productListRepository.updateDoc(id, productList);

        if (!productListRes) return null;

        const updated = await this.invoiceRepository.update(id, { total: invoiceTotal });

        updated.products = list;

        return updated;
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
