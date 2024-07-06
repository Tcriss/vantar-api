import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor } from '@nestjs/common';

import { AppModule } from './app.module';
import { appConfig, swaggerOptions, validationOptions } from './common/application/config';
import { PrismaClientExceptionFilter } from './database/application/filters/prisma-client-exception/prisma-client-exception.filter';
import { AccessTokenGuard } from './auth/application/guards/access-token/access-token.guard';
import { JwtExceptionsFilter } from './auth/application/filters/jwt-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, appConfig);
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  const configService: ConfigService = app.get(ConfigService);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter),
    new JwtExceptionsFilter()
  );
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalGuards(new AccessTokenGuard(reflector));
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { tagsSorter: 'alpha' }
  });

  await app.listen(configService.get<number>('PORT'), '0.0.0.0');
  console.log(`Application running on: ${await app.getUrl()}`);
}

bootstrap();