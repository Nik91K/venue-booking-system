import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import databaseConfig from '@/config/database.config';
import { SeederModule } from '@/database/seeders/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig(),
      autoLoadEntities: true,
    } as TypeOrmModuleOptions),
    SeederModule,
  ],
})
export class SeederAppModule {}
// to avoid raising the entire App module, a separate module for connecting the database
