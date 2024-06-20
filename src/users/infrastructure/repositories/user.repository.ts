import { Injectable } from "@nestjs/common";

import { PrismaProvider } from "../../../prisma/infrastructure/providers/prisma.provider";
import { UserEntity } from "../../domain/entities/user.entity";
import { SelectedFields } from "../../domain/types/selected-fields.type";
import { Pagination } from "../../../common/domain/types";
import { UserRepositoryI } from "../../domain/interfaces";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserRepository implements UserRepositoryI {

    constructor(private prisma: PrismaProvider) { }

    public async findAllUsers(page: Pagination, fields?: SelectedFields, query?: string): Promise<Partial<UserEntity>[]> {
        return this.prisma.user.findMany({
            where: { name: { contains: query } },
            orderBy: { name: 'asc' },
            select: {
                ...fields,
                password: false,
                refresh_token: false
            },
            take: page.take,
            skip: page.skip
        });
    }

    public async findOneUser(params: { id?: string, email?: string }): Promise<UserEntity> {
        return this.prisma.user.findUnique({
            where: params.id ? { id: params.id } : { email: params.email } 
        });
    }

    public async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
        return this.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role,
            }
        });
    }

    public async updateUser(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
        return this.prisma.user.update({
            where: { id: id },
            data: user
        });
    }

    public async deleteUser(id: string): Promise<UserEntity> {
        return this.prisma.user.delete({ where: { id: id } });
    }
}