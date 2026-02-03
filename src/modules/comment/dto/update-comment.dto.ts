import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Great place with amazing food!',
    description: 'Review text',
    required: false,
  })
  readonly text?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @ApiProperty({
    example: 4,
    description: 'Rating of the establishment (1-5)',
    required: false,
  })
  readonly rating?: number;
}
