import { Injectable } from "@nestjs/common";

import { PrismaProvider } from "../../../prisma/providers/prisma.provider";
import { UserEntity } from "../../domain/entities/user.entity";

@Injectable()
export class UserRepository {

    constructor(private prisma: PrismaProvider) { }

    public async find(params: { id?: string, email?: string }): Promise<UserEntity> {
        return this.prisma.user.findUnique({
            where: params.id ? { id: params.id } : { email: params.email } 
        });
    }

    public async create(user: Partial<UserEntity>): Promise<UserEntity> {
        return this.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        });
    }

    public async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
        return this.prisma.user.update({
            where: { id: id },
            data: user
        })
    }

    public async delete(id: string): Promise<UserEntity> {
        return this.prisma.user.delete({ where: { id: id } })
    }
}