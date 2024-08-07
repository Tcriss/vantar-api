import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { appConfig, swaggerOptions } from './common/application/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, appConfig);
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  const configService = app.get<ConfigService>(ConfigService);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { tagsSorter: 'alpha' }
  });

  await app.listen(configService.get<number>('PORT') || 2020, '0.0.0.0');
  console.log(`Application running on: ${await app.getUrl()}`);
}

bootstrap();