import { InvoiceEntity } from "@invoices/domain/entities";
import { SelectedFields } from "@invoices/domain/types";
import { Pagination } from "@common/domain/types";

export const InvoiceRepositoryToken = Symbol();
export interface InvoiceRepositoryI {
    findAllInvoices: (userId: string, pagination: Pagination, fields?: SelectedFields, query?: string) => Promise<Partial<InvoiceEntity>[]>,
    findOneInvoice: (id: string, fields?: SelectedFields,) => Promise<Partial<InvoiceEntity>>,
    createInvoice: (invoice: Partial<InvoiceEntity>) => Promise<InvoiceEntity>,
    updateInvoice: (id: string, invoice: Partial<InvoiceEntity>) => Promise<InvoiceEntity>,
    deleteInvoice: (id: string) => Promise<InvoiceEntity>,
}