import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  IsOptional,
} from 'class-validator';

export class UpdateEstablishmentDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Bakery',
    description: 'Some name',
  })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: 'Haharina St, 29, Cherkasy, Cherkasy Oblast, 18000',
    description: 'Address of the establishment',
  })
  address?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: 'Calm and comfortable establishment',
    description: 'Some description',
  })
  description?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @ApiProperty({
    example: 20,
    description: 'Total number of seats',
  })
  totalSeats?: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'Array of feature ID',
    type: [Number],
    required: false,
  })
  featureIds?: number[];
}
