import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InvoiceRepositoryI } from '../../domain/interfaces';
import { InvoiceEntity } from '../../domain/entities/invoice.entity';
import { Pagination } from '../../../common/domain/types';
import { InvoiceProductList, SelectedFields } from '../../domain/types';
import { ProductListRepository } from '../decorators/product-list-repository.decorator';
import { ProductList } from '../../../products/domain/entities/product-list.entity';
import { InvoiceRepository } from '../decorators';
import { Repository } from '../../../common/domain/entities';

@Injectable()
export class InvoiceService {

    constructor(
        @InvoiceRepository() private invoiceRepository: Repository<InvoiceEntity>,
        @ProductListRepository() private listRepository: Repository<InvoiceProductList>
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

        return this.invoiceRepository.findAll(userId, pagination, selectedFields);
    }

    public async findOneInvoice(id: string, userId: string): Promise<Partial<InvoiceEntity>> {
        const invoice: Partial<InvoiceEntity> = await this.invoiceRepository.findOne(id);

        if (!invoice) return null;
        if (!(invoice.user_id === userId)) return undefined;

        const list: Partial<InvoiceProductList> = await this.listRepository.findOne(invoice.id);
        
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

        const productsResult = await this.listRepository.insert({
            id: newInvoice.id,
            products: list
        });

        if (!productsResult) return null;

        newInvoice.products = list;

        return newInvoice;
    }

    public async updateInvoice(id: string, userId: string, invoice: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
        const data: Partial<InvoiceEntity> = await this.findOneInvoice(id, userId);
        
        if (data == null) return null;
        if (data == undefined) return undefined;
        
        return this.invoiceRepository.update(id, invoice);
    }

    public async deleteInvoice(id: string, userId: string): Promise<InvoiceEntity> {
        const data: Partial<InvoiceEntity> = await this.findOneInvoice(id, userId);
        
        if (data == null) return null;
        if (data == undefined) return undefined;
        
        return this.invoiceRepository.delete(id);
    }
}
