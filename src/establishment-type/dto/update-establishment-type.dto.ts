import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateEstablishmentTypeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
      example: "Restaurant",
      description: "Name of establishment type"
  })
  name?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
      example: "https://example.com/",
      description: "URL icons",
      required: false
  })
  image?: string
}
