import { AuthModule } from '@modules/auth/auth.module';
import { BookingModule } from '@modules/booking/booking.module';
import { EstablishmentModule } from '@modules/establishment/establishment.module';
import { FeaturesModule } from '@modules/features/features.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { databaseConfig } from '@/database/database.config';
import { SeederModule } from '@/database/seeders/seeder.module';
import { CommentModule } from '@/modules/comment/comment.module';
import { EstablishmentTypeModule } from '@/modules/establishment-type/establishment-type.module';

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
