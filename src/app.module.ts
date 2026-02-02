import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AuthModule } from '@/auth/auth.module';
import { AvailabilityModule } from '@/availability/availability.module';
import { BookingModule } from '@/booking/booking.module';
import { CommentModule } from '@/comment/comment.module';
import { databaseConfig } from '@/database/database.config';
import { SeederModule } from '@/database/seeders/seeder.module';
import { EstablishmentModule } from '@/establishment/establishment.module';
import { EstablishmentTypeModule } from '@/establishment-type/establishment-type.module';
import { FeaturesModule } from '@/features/features.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database') as TypeOrmModuleOptions,
    }),
    EstablishmentModule,
    CommentModule,
    AuthModule,
    AvailabilityModule,
    BookingModule,
    UsersModule,
    FeaturesModule,
    EstablishmentTypeModule,
    SeederModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
