import { ReqUser } from "../../../common/domain/types";
import { ProductQueries } from "../types/product-queries.type";
import { ProductEntity } from "../entities/product.entity";
import { ProductResponse } from "../types";

export interface ProductControllerI {
    findAll: (req: ReqUser, queries: ProductQueries) => Promise<Partial<ProductEntity>[]>;
    findOne: (id: string, req: ReqUser, selected?: string) => Promise<Partial<ProductEntity>>;
    createMany: (req: ReqUser, products: ProductEntity[]) => any;
    createOne: (req: ReqUser, product: Partial<ProductEntity>) => Promise<ProductResponse>;
    update: (id: string, product: Partial<ProductEntity>, req: ReqUser) => Promise<ProductResponse>;
    delete: (id: string, req: ReqUser) => Promise<ProductResponse>;
}