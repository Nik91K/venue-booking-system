import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateEstablishmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Bakery',
    description: 'Some name',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  building: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Calm and comfortable establishment',
    description: 'Some description',
  })
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({
    example: 20,
    description: 'Total number of seats',
  })
  totalSeats: number;

  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)]
  )
  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'Array of feature ID',
    type: [Number],
    required: false,
  })
  featureIds?: number[];

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'Establishment type ID',
  })
  typeId: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Cover photo for the establishment',
  })
  coverPhoto: Express.Multer.File;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Array of establishment photos (max 8)',
    maxItems: 8,
    minItems: 1,
  })
  photos: Express.Multer.File[];
}
