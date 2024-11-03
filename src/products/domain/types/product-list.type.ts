import { ProductEntityList } from "@products/domain/entities";

export type ProductList = {
    id: string;
    products: ProductEntityList[]
};