import { Injectable } from "@nestjs/common";

import { PrismaProvider } from "../../../prisma/providers/prisma.provider";
import { CreateUserDto } from "../../infrastructure/dtos/create-user.dto";
import { UpdateUserDto } from "../../infrastructure/dtos/update-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";

@Injectable()
export class UserRepository {

    constructor(private prisma: PrismaProvider) { }

    public async find(id?: string, name?: string, email?: string): Promise<UserEntity> {
        return this.prisma.user.findUnique({ where: 
            {id: id } || 
            { id: id, name: name } || 
            { email: email } 
        });
    }

    public async create(user: CreateUserDto): Promise<UserEntity> {
        return this.prisma.user.create({ data: user });
    }

    public async update(id: string, user: UpdateUserDto): Promise<UserEntity> {
        return this.prisma.user.update({
            where: { id: id },
            data: user
        })
    }

    public async delete(id: string): Promise<UserEntity> {
        return this.prisma.user.delete({ where: { id: id } })
    }
}