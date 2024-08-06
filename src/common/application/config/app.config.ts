import { NestApplicationOptions } from "@nestjs/common";

export const appConfig: NestApplicationOptions = {
    logger: ['warn', 'error'],
    bufferLogs: true
};