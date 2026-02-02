import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'WiFi',
    description: 'Name of the feature',
    type: 'string',
  })
  name: string;
}
