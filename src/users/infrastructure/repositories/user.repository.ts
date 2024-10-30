import { Injectable } from "@nestjs/common";

import { PrismaProvider } from "../../../database/infrastructure/providers/prisma/prisma.provider";
import { UserEntity } from "../../domain/entities/user.entity";
import { Pagination } from "../../../common/domain/types";
import { Repository } from "../../../common/domain/entities";

@Injectable()
export class UserRepository implements Partial<Repository<UserEntity>> {

    constructor(private readonly prisma: PrismaProvider) { }

    public async findAll(page: Pagination, query?: string): Promise<UserEntity[]> {
        return this.prisma.user.findMany({
            where: { name: { contains: query } },
            orderBy: { name: 'asc' },
            take: page.take,
            skip: page.skip
        });
    }

    public async findOne(id: string, email?: string): Promise<UserEntity> {
        return this.prisma.user.findUnique({
            where: id ? { id: id } : { email: email } 
        });
    }

    public async create(user: Partial<UserEntity>): Promise<UserEntity> {
        return this.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
                activation_token: user.activation_token
            }
        });
    }

    public async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
        return this.prisma.user.update({
            where: { id: id },
            data: user
        });
    }

    public async delete(id: string): Promise<UserEntity> {
        return this.prisma.user.delete({ where: { id: id } });
    }
}