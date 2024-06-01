import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { appConfig, swaggerOptions, validationOptions } from './config';
import { PrismaClientExceptionFilter } from './filters/prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, appConfig);
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  const configService: ConfigService = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('PORT'));
  console.log(`Application running on: ${await app.getUrl()}`);
}

bootstrap();