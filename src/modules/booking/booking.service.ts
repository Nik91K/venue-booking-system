import { CreateBookingDto } from '@modules/booking/dto/create-booking.dto';
import {
  Booking,
  BookingStatus,
} from '@modules/booking/entities/booking.entity';
import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { User } from '@modules/users/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Establishment)
    private establishmentRepository: Repository<Establishment>
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: number
  ): Promise<Booking> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const establishment = await this.establishmentRepository.findOne({
      where: { id: createBookingDto.establishment },
    });
    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    function addHoursToTime(time: string, hours: number): string {
      const [h, m] = time.split(':').map(Number);
      const date = new Date(1970, 0, 1, h, m);
      date.setHours(date.getHours() + hours);
      return date.toTimeString().slice(0, 5);
    }

    const timeFrom = addHoursToTime(createBookingDto.bookingTime, -1);
    const timeTo = addHoursToTime(createBookingDto.bookingTime, 1);

    const seatsRequested = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.numberOfGuests)', 'sum')
      .where('booking.establishmentId = :establishmentId', {
        establishmentId: createBookingDto.establishment,
      })
      .andWhere('booking.bookingDate = :bookingDate', {
        bookingDate: createBookingDto.bookingDate,
      })
      .andWhere('booking.bookingTime BETWEEN :from AND :to', {
        from: timeFrom,
        to: timeTo,
      })
      .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
      .getRawOne();

    if (
      parseInt(seatsRequested.sum) + createBookingDto.numberOfGuests >
      establishment.totalSeats
    ) {
      throw new BadRequestException('Not enough seats available');
    }

    const numberOfGuests = createBookingDto.numberOfGuests;

    if (numberOfGuests > establishment.totalSeats) {
      throw new BadRequestException(
        `Number of guests exceeds total seats (${establishment.totalSeats})`
      );
    }

    const booking = this.bookingRepository.create({
      user,
      establishment,
      bookingDate: new Date(createBookingDto.bookingDate),
      bookingTime: createBookingDto.bookingTime,
      numberOfGuests: createBookingDto.numberOfGuests,
    });

    return await this.bookingRepository.save(booking);
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: ['user', 'establishment'],
    });
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['establishment'],
      order: { bookingDate: 'DESC' },
    });
  }

  async getEstablishmentBookings(establishmentId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { establishment: { id: establishmentId } },
      relations: ['user'],
      order: { bookingDate: 'DESC' },
    });
  }

  async getBookingById(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'establishment'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking ${id} not found`);
    }

    return booking;
  }
}
