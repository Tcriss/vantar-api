import { ValidationPipeOptions } from "@nestjs/common";

export const validationOptions: ValidationPipeOptions = {
    whitelist: true,
    transformOptions: {
        enableImplicitConversion: true,
    },
}