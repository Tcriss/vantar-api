import { NestApplicationOptions } from "@nestjs/common";

export const appConfig: NestApplicationOptions = {
    logger: ['warn', 'error'],
    bufferLogs: true,
    cors: {
        origin: [ process.env.ClIENTS ],
        allowedHeaders: [ 'Content-Type', 'authorization' ],
        exposedHeaders: [ 'Content-Length', 'Content-Type' ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }
};