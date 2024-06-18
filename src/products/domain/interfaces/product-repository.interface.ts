import { Prisma } from "@prisma/client";

import { Pagination } from "../../../common/domain/types";
import { ProductEntity } from "../entities/product.entity";
import { SelectedFields } from "../types";

export const ProductRepositoryToken = Symbol('ProductRepositoryI');
export interface ProductRepositoryI {
    findAllProducts: (page: Pagination, userId?: string, fields?: SelectedFields, query?: string) => Promise<Partial<ProductEntity>[]>;
    findOneProduct: (id: string, fields?: SelectedFields) => Promise<Partial<ProductEntity>>;
    createManyProducts: (products: ProductEntity[]) => Promise<Prisma.BatchPayload>;
    createOneProduct: (product: Partial<ProductEntity>) => Promise<ProductEntity>;
    updateProduct: (id: string, product: Partial<ProductEntity>) => Promise<ProductEntity>;
    deleteProduct: (id: string) => Promise<ProductEntity>;
}