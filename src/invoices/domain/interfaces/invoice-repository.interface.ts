import { InvoiceEntity } from "../entities/invoice.entity";
import { Pagination } from "../../../common/domain/types";
import { SelectedFields } from "../types";

export const InvoiceRepositoryToken = Symbol();
export interface InvoiceRepositoryI {
    findAllInvoices: (userId: string, pagination: Pagination, fields?: SelectedFields, query?: string) => Promise<Partial<InvoiceEntity>[]>,
    findOneInvoice: (id: string, fields?: SelectedFields,) => Promise<Partial<InvoiceEntity>>,
    createInvoice: (invoice: Partial<InvoiceEntity>) => Promise<InvoiceEntity>,
    updateInvoice: (id: string, invoice: Partial<InvoiceEntity>) => Promise<InvoiceEntity>,
    deleteInvoice: (id: string) => Promise<InvoiceEntity>,
}