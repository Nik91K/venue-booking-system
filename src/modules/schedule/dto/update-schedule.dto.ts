import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class UpdateSingleScheduleDto {
  @ApiPropertyOptional({ example: '09:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  @IsOptional()
  openTime?: string;

  @ApiPropertyOptional({ example: '20:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  @IsOptional()
  closeTime?: string;
}
