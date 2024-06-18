import { Injectable } from "@nestjs/common";

import { PrismaProvider } from "../../../prisma/infrastructure/providers/prisma.provider";
import { SelectedFields } from "../../domain/types";
import { ProductEntity } from "../../domain/entities/product.entity";
import { Pagination } from "../../../common/domain/types";

@Injectable()
export class ProductRepository {

    constructor(private prisma: PrismaProvider) { }

    public async findAllProducts(page: Pagination, userId?: string, fields?: SelectedFields, query?: string): Promise<Partial<ProductEntity>[]> {
        return this.prisma.product.findMany({
            where: {
                user_id: userId,
                name: { contains: query }
            },
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
                user_id: product.user_id,
                name: product.name,
                price: product.price,
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