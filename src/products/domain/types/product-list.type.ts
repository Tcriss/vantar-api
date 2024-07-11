import { ProductEntityList } from "../entities/product-list.entity";

export type ProductList = {
    id: string;
    products: ProductEntityList[]
};