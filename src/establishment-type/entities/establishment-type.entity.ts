import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Establishment } from "src/establishment/entities/establishment.entity";

@Entity()
export class EstablishmentType {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number

  @Column({type: "text" })
  @ApiProperty({
    example: "Restaurant",
    description: "Name of establishment type"
  })
  name: string

  @Column({ type: "text", nullable: true })
  @ApiProperty({
    example: "https://example.com",
    description: "URL icons for establishment type"
  })
  image?: string

  @OneToMany(() => Establishment, (establishment) => establishment.type)
  establishment: Establishment[]
}
