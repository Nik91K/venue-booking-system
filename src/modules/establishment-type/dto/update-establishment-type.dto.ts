import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateEstablishmentTypeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Restaurant',
    description: 'Name of establishment type',
  })
  name?: string;
}
