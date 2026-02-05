import { ApiPropertyOptional } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class UpdateScheduleDto {
  @ApiPropertyOptional({ example: '09:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  openTime?: string;

  @ApiPropertyOptional({ example: '20:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  closeTime?: string;
}
