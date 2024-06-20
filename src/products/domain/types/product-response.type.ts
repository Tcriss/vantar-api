import { ProductEntity } from "../entities/product.entity";

export type ProductResponse = {
    message: string,
    product?: Partial<ProductEntity>,
    count?: number
};