import { BookingController } from '@modules/booking/booking.controller';
import { BookingService } from '@modules/booking/booking.service';
import { Booking } from '@modules/booking/entities/booking.entity';
import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { User } from '@modules/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Establishment])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
