import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsArray } from "class-validator";
export class CreateEstablishmentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "Bakery",
        description: "Some name"
    })
    name: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "Haharina St, 29, Cherkasy, Cherkasy Oblast, 18000",
        description: "Address of the establishment"
    })
    address: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "Calm and comfortable establishment",
        description: "Some description"
    })
    description: string

    @IsNumber()
    @Min(1)
    @ApiProperty({
        example: 20,
        description: "Total number of seats"
    })
    totalSeats: number

    @IsArray()
    @IsOptional()
    @ApiProperty({
        description: "Array of feature ID",
        type: [Number],
        required: false
    })
    featureIds?: number[]

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        example: 1,
        description: "Establishment type ID"
    })
    typeId?: number
}
