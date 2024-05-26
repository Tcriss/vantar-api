import { NestApplicationOptions } from "@nestjs/common";

export const appConfig: NestApplicationOptions = {
    logger: ['error', 'warn']
}