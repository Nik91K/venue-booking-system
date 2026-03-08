import { databaseConfig } from '@config/database.config';
import { validationSchema } from '@config/env.validation';
import { throttlerConfig } from '@config/throttler.config';
import { AuthModule } from '@modules/auth/auth.module';
import { BookingModule } from '@modules/booking/booking.module';
import { CommentModule } from '@modules/comment/comment.module';
import { EstablishmentModule } from '@modules/establishment/establishment.module';
import { EstablishmentTypeModule } from '@modules/establishment-type/establishment-type.module';
import { FeaturesModule } from '@modules/features/features.module';
import { ScheduleModule } from '@modules/schedule/schedule.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { SeederModule } from '@/database/seeders/seeder.module';

@Module({
  imports: [
    ThrottlerModule.forRoot(throttlerConfig),
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
      envFilePath: '.env',
      validationSchema,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
        convert: true,
      },
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
    ScheduleModule,
  ],
  controllers: [],
})
export class AppModule {}
