import { NestApplicationOptions } from "@nestjs/common";

export const appConfig: NestApplicationOptions = {
    logger: ['warn', 'error'],
    bufferLogs: true,
    cors: {
        origin: [ process.env.ClIENT ],
        allowedHeaders: [ process.env.CLIENT ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }
};