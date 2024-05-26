import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerOptions = new DocumentBuilder()
    .setTitle('Vantar API')
    .setDescription('The api from Vantar Inventary Manger')
    .setVersion('1.0')
    .build();