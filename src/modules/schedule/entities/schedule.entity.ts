import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

import { Establishment } from '@/modules/establishment/entities/establishment.entity';

export enum ScheduleDays {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

@Entity('schedules')
@Unique(['establishment', 'day'])
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ScheduleDays })
  day: ScheduleDays;

  @Column({ type: 'time' })
  openTime: string;

  @Column({ type: 'time' })
  closeTime: string;

  @ManyToOne(() => Establishment, establishment => establishment.schedules, {
    onDelete: 'CASCADE',
  })
  establishment: Establishment;
}
