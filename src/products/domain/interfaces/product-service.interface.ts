import { ProductEntity } from "../entities/product.entity";

export interface ProductServiceI {
    findAllProducts: (page: string, inventoryId?: string, query?: string, selected?: string) => Promise<Partial<ProductEntity>[]>;
    findOneProduct: (id: string, selected?: string) => Promise<Partial<ProductEntity>>;
    createProduct: (product: Partial<ProductEntity>) => Promise<ProductEntity>;
    updateProduct: (id: string, product: Partial<ProductEntity>) => Promise<ProductEntity>;
    deleteProduct: (id: string) => Promise<ProductEntity>
}