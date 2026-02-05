import { ScheduleDays } from '@modules/schedule/entities/schedule.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Matches, IsInt, IsEnum } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ enum: ScheduleDays, example: ScheduleDays.MONDAY })
  @IsEnum(ScheduleDays)
  day: ScheduleDays;

  @ApiProperty({ type: String, format: 'time', example: '09:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  openTime: string;

  @ApiProperty({ type: String, format: 'time', example: '20:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  closeTime: string;

  @ApiProperty({ type: Number, description: 'Establishment ID', example: 1 })
  @IsInt()
  establishmentId: number;
}
