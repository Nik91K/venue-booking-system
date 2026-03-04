import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { User } from '@modules/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['user', 'establishment'])
export class Comment {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'text' })
  @ApiProperty({
    example: 'Hello',
    description: 'Review text',
  })
  text: string;

  @Column({ type: 'int' })
  @Min(1)
  @Max(5)
  @ApiProperty({
    example: 4,
    description: 'Rating of the establishment (1-5)',
  })
  rating: number;

  @Index()
  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Create comment date',
  })
  createdAt: Date;

  @ManyToOne(() => Establishment, establishment => establishment.comments, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'establishmentId' })
  establishment: Establishment;

  @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
