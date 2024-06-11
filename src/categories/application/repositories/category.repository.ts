import { Injectable } from "@nestjs/common";

import { PrismaProvider } from "../../../prisma/application/providers/prisma.provider";
import { CategoryEntity } from "../../domain/entities/category.entity";

@Injectable()
export class CategoryRepository {

    constructor(private prisma: PrismaProvider) { }

    public async findAll(query?: string): Promise<CategoryEntity[]> {
        return query ?
            this.prisma.category.findMany({
                where: {
                    name: { contains: query }
                },
                orderBy: { name: 'desc' }
            }) : this.prisma.category.findMany({ orderBy: { name: 'asc' } });
    }

    public async findOne(id?: string, name?: string): Promise<CategoryEntity> {
        return this.prisma.category.findUnique({
            where: id ? { id: id } : { name: name }
        });
    }
}