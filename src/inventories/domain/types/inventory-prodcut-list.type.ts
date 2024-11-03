import { ProductEntityList } from "@products/domain/entities/product-list.entity";

export type InventoryProductList = {
    id: string,
    products: ProductEntityList[]
};