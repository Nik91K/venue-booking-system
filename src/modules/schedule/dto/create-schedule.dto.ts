import { ScheduleDays } from '@modules/schedule/entities/schedule.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Matches, IsInt, IsEnum, ArrayMinSize, IsArray } from 'class-validator';

export class CreateScheduleItemDto {
  @ApiProperty({
    description: 'Days of the week when this schedule applies',
    enum: ScheduleDays,
    isArray: true,
    example: [ScheduleDays.MONDAY],
  })
  @IsArray()
  @IsEnum(ScheduleDays, { each: true })
  day: ScheduleDays[];

  @ApiProperty({
    description: 'Opening time in 24-hour format (HH:mm)',
    example: '09:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'openTime must be in HH:mm format',
  })
  openTime: string;

  @ApiProperty({
    description: 'Closing time in 24-hour format (HH:mm)',
    example: '20:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'closeTime must be in HH:mm format',
  })
  closeTime: string;
}

export class CreateSchedulesDto {
  @ApiProperty({
    description: 'ID of the establishment for which the schedule is created',
    example: 1,
  })
  @IsInt()
  establishmentId: number;

  @ApiProperty({
    description:
      'List of schedule items. Each item represents working hours for specific days.',
    type: [CreateScheduleItemDto],
    minItems: 1,
    example: [
      {
        day: ['MONDAY'],
        openTime: '09:00',
        closeTime: '20:00',
      },
      {
        day: [ScheduleDays.TUESDAY, ScheduleDays.WEDNESDAY],
        openTime: '10:00',
        closeTime: '18:00',
      },
    ],
  })
  @ArrayMinSize(1)
  scheduleItems: CreateScheduleItemDto[];
}
