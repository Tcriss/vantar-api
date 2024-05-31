import { Injectable } from "@nestjs/common";

import { PrismaProvider } from "../../../prisma/providers/prisma.provider";
import { Product } from "@prisma/client";

@Injectable()
export class ProductRepository {

    constructor(private prisma: PrismaProvider) {}

    public async findMany(): Promise<Product[]> {
        return this.prisma.product.findMany();
    }

    public async find(id?: string, name?: string, category?: string): Promise<Product> {
        return this.prisma.product.findUnique({
            where: { id: id, name: name, category_name: category }
        });
    }

    public async create(product: Product): Promise<Product> {
        return this.prisma.product.create({ data: product });
    }

    public async update(id: string, product: Product): Promise<Product> {
        return this.prisma.product.update({
            where: { id: id },
            data: product
        });
    }

    public async delete(id: string): Promise<Product> {
        return this.prisma.product.delete({ where: { id: id } });
    }
}