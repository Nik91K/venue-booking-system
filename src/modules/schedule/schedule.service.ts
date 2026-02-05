import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { CreateScheduleDto } from '@modules/schedule/dto/create-schedule.dto';
import { UpdateScheduleDto } from '@modules/schedule/dto/update-schedule.dto';
import { Schedule } from '@modules/schedule/entities/schedule.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,

    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>
  ) {}
  async create(createScheduleDto: CreateScheduleDto) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: createScheduleDto.establishmentId },
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    const schedule = this.scheduleRepository.create({
      day: createScheduleDto.day,
      openTime: createScheduleDto.openTime,
      closeTime: createScheduleDto.closeTime,
      establishment,
    });

    return await this.scheduleRepository.save(schedule);
  }

  async findByEstablishment(establishmentId: number) {
    return this.scheduleRepository.find({
      where: {
        establishment: { id: establishmentId },
      },
      order: {
        day: 'ASC',
      },
    });
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['establishment'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule ${id} not found`);
    }

    this.scheduleRepository.merge(schedule, updateScheduleDto);
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: number) {
    const result = await this.scheduleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Schedule ${id} not found`);
    }
  }
}
