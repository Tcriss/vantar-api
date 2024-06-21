import { Prisma } from "@prisma/client";
import { ProductEntity } from "../entities/product.entity";

export interface ProductServiceI {
    findAllProducts: (page: string, inventoryId?: string, query?: string, selected?: string) => Promise<Partial<ProductEntity>[]>;
    findOneProduct: (id: string, selected?: string) => Promise<Partial<ProductEntity>>;
    createManyProducts: (userId: string, products: Partial<ProductEntity>[]) => Promise<number>;
    createOneProduct: (userId: string, product: Partial<ProductEntity>) => Promise<ProductEntity>;
    updateProduct: (id: string, product: Partial<ProductEntity>, userId: string) => Promise<ProductEntity>;
    deleteProduct: (id: string, userId: string) => Promise<ProductEntity>
}