import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaProvider } from "../../../../database/infrastructure/providers/prisma/prisma.provider";
import { SelectedFields } from "../../../domain/types";
import { ProductEntity } from "../../../domain/entities/product.entity";
import { Pagination } from "../../../../common/domain/types";
import { Repository } from "../../../../common/domain/entities";

@Injectable()
export class ProductRepository implements Partial<Repository<ProductEntity>> {

    constructor(private readonly prisma: PrismaProvider) { }

    public async findAll(shopId: string, page: Pagination, fields?: SelectedFields, query?: string): Promise<Partial<ProductEntity>[]> {
        return this.prisma.product.findMany({
            where: {
                shop_id: shopId,
                name: { contains: query }
            },
            orderBy: { name: 'asc' },
            select: fields,
            skip: page.skip,
            take: page.take
        });
    }

    public async findOne(id: string, fields?: SelectedFields): Promise<Partial<ProductEntity>> {
        return this.prisma.product.findUnique({
            where: { id: id },
            select: fields
        });
    }

    public async createMany(products: ProductEntity[]): Promise<Prisma.BatchPayload> {
        return this.prisma.product.createMany({
            data: [...products]
        });
    };

    public async create(product: Partial<ProductEntity>): Promise<ProductEntity> {
        return this.prisma.product.create({
            data: {
                shop_id: product.shop_id,
                name: product.name,
                price: product.price,
            }
        });
    }

    public async update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity> {
        return this.prisma.product.update({
            where: { id: id },
            data: product
        });
    }

    public async delete(id: string): Promise<ProductEntity> {
        return this.prisma.product.delete({ where: { id: id }});
    }
}