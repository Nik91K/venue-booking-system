import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Establishment } from "src/establishment/entities/establishment.entity";
import { User } from "src/users/entities/user.entity";
import { Max, Min } from "class-validator";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id:number

    @Column({ type: "text"})
    @ApiProperty({
        example: "Hello",
        description: "Review text"
    })
    text:string

    @Column({ type: "int"})
    @Min(1)
    @Max(5)
    @ApiProperty({
        example: 4,
        description: "Rating of the establishment (1-5)"
    })
    rating:number

    @CreateDateColumn({type:"timestamp"})
    @ApiProperty({
        description: "Create comment date"
    })
    createdAt:Date

    @Column()
    @ApiProperty()
    establishmentId: number

    @ManyToOne(() => Establishment, (establishment) => establishment.comments, { eager: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'establishmentId' })
    establishment: Establishment

    @Column()
    @ApiProperty()
    userId: number;

    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User
}
