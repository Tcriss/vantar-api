import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

import { PrismaProvider } from "src/modules/prisma/providers/prisma.provider";

@Injectable()
export class UserRepository {

    constructor(private prisma: PrismaProvider) { }

    public async find(id?: string, name?: string): Promise<User> {
        return this.prisma.user.findUnique({ where: { id: id } || { id: id, name: name } });
    }

    public async create(user: User): Promise<User> {
        return this.prisma.user.create({ data: user });
    }

    public async update(id: string, user: Partial<User>): Promise<User> {
        return this.prisma.user.update({
            where: { id: id },
            data: user
        })
    }

    public async delete(id: string): Promise<User> {
        return this.prisma.user.delete({ where: { id: id } })
    }
}