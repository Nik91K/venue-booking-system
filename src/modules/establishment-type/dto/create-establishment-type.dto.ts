import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEstablishmentTypeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Restaurant',
    description: 'Name of establishment type',
  })
  name: string;
}
