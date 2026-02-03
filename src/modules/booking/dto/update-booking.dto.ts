import { BookingStatus } from '@modules/booking/entities/booking.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @ApiProperty({
    description: 'Reservation status',
    enum: BookingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
  numberOfGuests: any;
  bookingDate: any;
}
