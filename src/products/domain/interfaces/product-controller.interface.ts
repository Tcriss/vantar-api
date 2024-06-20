import { ReqUser } from "../../../common/domain/types";
import { ProductQueries } from "../types/product-queries.type";
import { ProductEntity } from "../entities/product.entity";
import { ProductResponse } from "../types";

export interface ProductControllerI {
    findAll: (req: ReqUser, queries: ProductQueries) => Promise<Partial<ProductEntity>[]>;
    findOne: (id: string, selected?: string) => Promise<Partial<ProductEntity>>;
    create: (product: Partial<ProductEntity>) => Promise<ProductResponse>;
    update: (id: string, product: Partial<ProductEntity>) => Promise<ProductResponse>;
    delete: (id: string) => Promise<ProductResponse>;
}