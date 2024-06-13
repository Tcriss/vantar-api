import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { appConfig, swaggerOptions, validationOptions } from './common/application/config';
import { PrismaClientExceptionFilter } from './prisma/application/filters/prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, appConfig);
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  const configService: ConfigService = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { tagsSorter: 'alpha' }
  });

  await app.listen(configService.get<number>('PORT'));
  console.log(`Application running on: ${await app.getUrl()}`);
}

bootstrap();