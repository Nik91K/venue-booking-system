import { NestFactory } from '@nestjs/core';

import { MainSeeder } from '@/database/seeders/main.seeder';
import { SeederAppModule } from '@/database/seeders/seeder-app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederAppModule);
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
