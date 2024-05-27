import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes';

import { AppModule } from './app.module';
import { appConfig, swaggerOptions, validationOptions } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, appConfig);
  const document = SwaggerModule.createDocument(app, swaggerOptions);

  app.useGlobalPipes(new ValidationPipe(validationOptions))
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
