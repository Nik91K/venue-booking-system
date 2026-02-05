import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { Schedule } from '@modules/schedule/entities/schedule.entity';
import { ScheduleController } from '@modules/schedule/schedule.controller';
import { ScheduleService } from '@modules/schedule/schedule.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Establishment])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
