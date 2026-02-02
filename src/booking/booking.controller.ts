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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

import { JwtAuthGuard } from '@/common/guard/jwt.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiOkResponse({ description: 'Reservation successfully created' })
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
