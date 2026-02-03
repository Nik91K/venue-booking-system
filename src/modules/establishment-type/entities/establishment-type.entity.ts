import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EstablishmentType {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'text' })
  @ApiProperty({
    example: 'Restaurant',
    description: 'Name of establishment type',
  })
  name: string;

  @OneToMany(() => Establishment, establishment => establishment.type)
  establishment: Establishment[];
}
