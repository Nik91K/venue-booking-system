import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateCommentDto {
    @ApiProperty()
    id: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "Great place with amazing food",
        description: "Review text"
    })
    readonly text: string

    @IsInt()
    @Min(1)
    @Max(5)
    @ApiProperty({
        example: 4,
        description: "Rating of the establishment (1-5)"
    })
    readonly rating: number

    @IsInt()
    @ApiProperty({
        example: 1,
        description: "Establishment id"
    })
    establishmentId: number
}
