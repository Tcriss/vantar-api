import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaProvider extends PrismaClient implements OnModuleInit {

    onModuleInit() {
        this.$connect();
    }
}