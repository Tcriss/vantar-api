import { ProductEntityList } from "@products/domain/entities";

export type InvoiceProductList = {
    id: string,
    products: ProductEntityList[]
};