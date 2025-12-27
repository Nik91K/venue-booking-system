import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "../../comment/entities/comment.entity";
import { User } from "../../users/entities/user.entity";
import { Feature } from "src/features/entities/feature.entity";
import { EstablishmentType } from "src/establishment-type/entities/establishment-type.entity";

@Entity()
export class Establishment {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number

    @Column({type: "text" })
    name: string

    @Column({ type: "text" })
    address: string

    @Column({ type: "text" })
    description?: string

    @Column({ type: "int", default: 0})
    totalSeats: number

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date

    @OneToMany(() => Comment, (comment) => comment.establishment)
    comments: Comment[]

    @ManyToMany(() => Feature, (feature) => feature.establishments)
    @JoinTable({
        name: 'establishment_features',
        joinColumn: {
            name: 'establishment_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'feature_id',
            referencedColumnName: 'id'
        }
    })
    features: Feature[]

    @ManyToOne(() => EstablishmentType, (type) => type.establishment)
    @JoinColumn({ name: 'type_id' })
    type: EstablishmentType

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'owner_id' })
    owner: User

}