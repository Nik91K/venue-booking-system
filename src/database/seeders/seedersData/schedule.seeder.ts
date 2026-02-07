import { Establishment } from '@modules/establishment/entities/establishment.entity';
import {
  Schedule,
  ScheduleDays,
} from '@modules/schedule/entities/schedule.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleSeeder {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>
  ) {}

  async seedSchedules() {
    const establishments = await this.establishmentRepository.find();
    const schedule: Schedule[] = [];
    const days = Object.values(ScheduleDays);

    if (!establishments.length) {
      throw new Error('No establishments found. Seed establishments first.');
    }

    for (const establishment of establishments) {
      for (const day of days) {
        schedule.push(
          this.scheduleRepository.create({
            day,
            openTime: '09:00',
            closeTime: '21:00',
            establishment: { id: establishment.id },
          })
        );
      }
      await this.scheduleRepository.save(schedule);
    }
  }
}
