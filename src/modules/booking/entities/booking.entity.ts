import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { User } from '@modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookings, { eager: true })
  user: User;

  @ManyToOne(() => Establishment, { eager: true })
  establishment: Establishment;

  @Column({ type: 'date' })
  bookingDate: Date;

  @Column({ type: 'time' })
  bookingTime: string;

  @Column({ type: 'int' })
  numberOfGuests: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Index()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
