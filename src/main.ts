import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() { 
  const app = await NestFactory.create(AppModule);
  
  app.enableCors(false)
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = new DocumentBuilder()
   .setTitle('My REST API') 
   .setDescription('The API description')
   .setVersion('1.0')
   .addBearerAuth()
   .addTag('users')
   .build(); 
  app.getHttpAdapter().get('/', (req, res) => {
    res.redirect('/api')
  })
  
  const document = SwaggerModule.createDocument(app, config);  SwaggerModule.setup('api', app, document)
  await app.listen(3000); 
} 

bootstrap();