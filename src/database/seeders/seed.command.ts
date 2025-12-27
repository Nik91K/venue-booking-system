import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { MainSeeder } from './main.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(MainSeeder);

  try {
    await seeder.run();
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();