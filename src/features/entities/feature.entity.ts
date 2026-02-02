import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

import { Establishment } from '@/establishment/entities/establishment.entity';

@Entity('features')
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  @ApiProperty({
    example: 'Wifi',
    description: 'Name of the feature',
  })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string | null;

  @ManyToMany(() => Establishment, establishment => establishment.features, {
    onDelete: 'CASCADE',
  })
  establishments: [Establishment];
}
