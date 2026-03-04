import { BookingService } from '@modules/booking/booking.service';
import { CreateBookingDto } from '@modules/booking/dto/create-booking.dto';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Throttle({ booking: { limit: 20, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiCreatedResponse({ description: 'Reservation successfully created' })
  @ApiNotFoundResponse({ description: 'No establishment found' })
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingService.create(createBookingDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiOkResponse({ description: 'List of all bookings' })
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiOkResponse({ description: 'User bookings retrieved successfully' })
  getUserBookings(@Request() req) {
    return this.bookingService.getUserBookings(req.user.id);
  }

  @Get('establishment/:establishmentId')
  @ApiOperation({ summary: 'Get all bookings for specific establishment' })
  @ApiOkResponse({
    description: 'Establishment bookings retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Establishment not found' })
  getEstablishmentBookings(@Param('establishmentId') establishmentId: string) {
    return this.bookingService.getEstablishmentBookings(+establishmentId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiOkResponse({ description: 'Booking details' })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(+id);
  }
}
