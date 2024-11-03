import { ProductEntityList } from "@products/domain/entities";

export type InventoryProductList = {
    id: string,
    products: ProductEntityList[]
};