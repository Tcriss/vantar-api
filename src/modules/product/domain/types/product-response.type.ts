import { ProductEntity } from "../entities/product.entity";

export type ProductResponse = {
    message: string,
    data?: Partial<ProductEntity>
};