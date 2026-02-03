import { RefreshToken } from '@modules/auth/entities/refresh-token.entity';
import { Booking } from '@modules/booking/entities/booking.entity';
import { Comment } from '@modules/comment/entities/comment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  OWNER = 'OWNER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  avatarSeed: string;

  @Column()
  avatarUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Booking, booking => booking.establishment)
  bookings: Booking[];

  @OneToMany(() => Comment, comment => comment.user, { cascade: true })
  comments: Comment[];

  @OneToMany(() => RefreshToken, token => token.user, { cascade: true })
  refreshToken: RefreshToken[];

  @Column('int', { array: true, default: [] })
  favorites: number[];
}
