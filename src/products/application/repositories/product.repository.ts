import { Injectable } from "@nestjs/common";

import { PrismaProvider } from "../../../prisma/infrastructure/providers/prisma.provider";
import { SelectedFields } from "../../domain/types";
import { ProductEntity } from "../../domain/entities/product.entity";
import { SearchTerms } from "../../domain/types";
import { Pagination } from "../../../common/domain/types";

@Injectable()
export class ProductRepository {

    constructor(private prisma: PrismaProvider) { }

    public async findAllProducts(page: Pagination, inventoryId?: string, fields?: SelectedFields, query?: SearchTerms): Promise<Partial<ProductEntity>[]> {
        return this.prisma.product.findMany({
            where: { inventory_id: inventoryId },
            orderBy: { name: 'asc' },
            select: fields,
            skip: page.skip,
            take: page.take
        });
    }

    public async findOneProduct(id: string, fields?: SelectedFields): Promise<Partial<ProductEntity>> {
        return this.prisma.product.findUnique({
            where: { id: id },
            select: fields
        });
    }

    public async createProduct(product: Partial<ProductEntity>): Promise<ProductEntity> {
        return this.prisma.product.create({
            data: {
                inventory_id: product.inventory_id,
                name: product.name,
                stock: product.stock,
                price: product.price,
                unit_measure: product.unit_measure,
                category_name: product.category_name,
                expiration: product.expiration
            }
        });
    }

    public async updateProduct(id: string, product: Partial<ProductEntity>): Promise<ProductEntity> {
        return this.prisma.product.update({
            where: { id: id },
            data: product
        });
    }

    public async deleteProduct(id: string): Promise<ProductEntity> {
        return this.prisma.product.delete({ where: { id: id }});
    }
}