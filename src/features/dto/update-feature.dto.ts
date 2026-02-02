import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFeatureDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'WiFi',
    description: 'Name of the feature',
    required: false,
  })
  readonly name: string;
}
