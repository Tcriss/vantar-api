import { ProductEntityList } from "../../../products/domain/entities/product-list.entity";

export type InvoiceProductList = {
    id: string,
    products: ProductEntityList[]
};