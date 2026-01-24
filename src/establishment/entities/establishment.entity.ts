import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Comment } from '@/comment/entities/comment.entity';
import { EstablishmentType } from '@/establishment-type/entities/establishment-type.entity';
import { Feature } from '@/features/entities/feature.entity';
import { User } from '@/users/entities/user.entity';

@Entity()
export class Establishment {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 0 })
  totalSeats: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  coverPhoto?: string;

  @Column({ type: 'simple-array', nullable: true })
  photos?: string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Comment, comment => comment.establishment)
  comments: Comment[];

  @ManyToMany(() => Feature, feature => feature.establishments)
  @JoinTable({
    name: 'establishment_features',
    joinColumn: {
      name: 'establishment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'feature_id',
      referencedColumnName: 'id',
    },
  })
  features: Feature[];

  @ManyToOne(() => EstablishmentType, type => type.establishment)
  @JoinColumn({ name: 'type_id' })
  type: EstablishmentType;

  @Column()
  @ApiProperty()
  ownerId: number;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToMany(() => User, { eager: false })
  @JoinTable({
    name: 'entity_moderators',
    joinColumn: {
      name: 'establishmentId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  moderators: User[];
}
