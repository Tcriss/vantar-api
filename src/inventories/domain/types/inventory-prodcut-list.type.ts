import { ProductList } from "../../../products/domain/entities/product-list.entity";

export type InventoryProductList = {
    id: string,
    products: ProductList[]
};