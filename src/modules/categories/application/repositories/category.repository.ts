import { Injectable } from "@nestjs/common";
import { Prisma, Category } from "@prisma/client";

import { PrismaProvider } from "../../../prisma/providers/prisma.provider";

@Injectable()
export class CategoryRepository {

    constructor(private prisma: PrismaProvider) { }

    public async read(id?: string, name?: string): Promise<Category> {
        return this.prisma.category.findUnique({
            where: id ? { id: id } : { name: name }
        });
    }

    public async readMany(query?: string): Promise<Category[]> {
        return query ?
            this.prisma.category.findMany({
                where: {
                    name: { contains: query }
                }
            })
            : this.prisma.category.findMany();
    }

    public async create(category: Partial<Category>): Promise<Category> {
        return this.prisma.category.create({
            data: {
                name: category.name,
                description: category.description
            }
        });
    }

    public async createMany(categories: Category[]): Promise<Prisma.BatchPayload> {
        return this.prisma.category.createMany({
            data: categories,
            skipDuplicates: true
        });
    }

    public async update(id: string, category: Partial<Category>): Promise<Category> {
        return this.prisma.category.update({
            where: { id: id }, 
            data: category
        });
    }

    public async delete(id: string): Promise<Category> {
        return this.prisma.category.delete({ where: { id: id } })
    }
}