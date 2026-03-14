import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  });
  app.useStaticAssets(
    join(__dirname, '..', process.env.UPLOADS_PATH ?? 'uploads'),
    {
      prefix: '/uploads',
    }
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('My REST API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('users')
    .build();

  app.getHttpAdapter().get('/', (req, res) => {});

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
