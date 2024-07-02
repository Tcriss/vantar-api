import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaProvider extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    onModuleInit(): void {
        this.$connect();
    }

    onModuleDestroy(): void {
        this.$disconnect();
    }
}