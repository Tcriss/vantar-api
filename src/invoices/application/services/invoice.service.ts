import { Injectable } from '@nestjs/common';

import { InvoiceRepositoryI } from '../../domain/interfaces';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { Pagination } from '../../../common/domain/types';
import { SelectedFields } from '../../domain/types';
import { ProductListRepository } from '../decorators/product-list-repository.decorator';
import { ProductList } from '../../../products/domain/entities/product-list.entity';
import { InvoiceRepository } from '../decorators';
import { Repository } from '../../../common/domain/entities';

@Injectable()
export class InvoiceService {

    constructor(
        @InvoiceRepository() private invoiceRepository: InvoiceRepositoryI,
        @ProductListRepository() private listRepository: Repository<ProductList>
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
            products: selected.includes('products')
        } : null;

        return this.invoiceRepository.findAllInvoices(userId, pagination, selectedFields);
    }

    public async findOneInvoice(id: string, userId: string, selected?: string): Promise<Partial<InvoiceEntity>> {
        const fields: SelectedFields = selected ? {
            id: true,
            user_id: true,
            date: selected.includes('date'),
            total: selected.includes('total'),
            products: selected.includes('products')
        } : null;
        const invoice: Partial<InvoiceEntity> = await this.invoiceRepository.findOneInvoice(id, fields);

        if (!invoice) return null;
        if (!(invoice.user_id === userId)) return undefined;

        const productList: Partial<ProductList>[] = await this.listRepository.findAll(userId);

        // productList.forEach(product => {
        //     invoice.products.push(new ProductList(product));
        // });
        return invoice;
    }
    
    public async createInvoice(userId: string, invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        const list: ProductList[] = invoice.products.map(product => ({
            unit_price: product.unit_price,
            amount: product.amount,
            name: product.name,
            total: product.unit_price * product.amount
        }));
        const res = await this.listRepository.insert(list);

        if (!res) return null;
        
        let total: number = 0;
        list.forEach(product => total += product.total);
        invoice.total = total;
        invoice.user_id = userId;

        return this.invoiceRepository.createInvoice(invoice);
    }

    public async updateInvoice(id: string, userId: string, invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        const data: Partial<InvoiceEntity> = await this.findOneInvoice(id, userId);
        
        if (data == null) return null;
        if (data == undefined) return undefined;
        
        return this.invoiceRepository.updateInvoice(id, invoice);
    }

    public async deleteInvoice(id: string, userId: string): Promise<InvoiceEntity> {
        const data: Partial<InvoiceEntity> = await this.findOneInvoice(id, userId);
        
        if (data == null) return null;
        if (data == undefined) return undefined;
        
        return this.invoiceRepository.deleteInvoice(id);
    }
}
