import { InvoiceEntity } from "../entities/invoice.entity";
import { Pagination } from "../../../common/domain/types";
import { SelectedFields } from "../types";

export interface InvoiceRepositoryI {
    findAll: (userId: string, pagination: Pagination, fields?: SelectedFields, query?: string) => Partial<InvoiceEntity>[],
    findOneInvoice: (id: string, fields?: SelectedFields,) => Partial<InvoiceEntity>,
    createInvoice: (invoice: Partial<InvoiceEntity>) => InvoiceEntity,
    updateInvoice: (invoice: Partial<InvoiceEntity>) => InvoiceEntity,
    deleteInvoice: (id: string) => InvoiceEntity,
}