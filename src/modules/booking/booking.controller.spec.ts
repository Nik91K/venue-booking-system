import { Test, TestingModule } from '@nestjs/testing';

import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

describe('BookingController', () => {
  let controller: BookingController;
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: {
            getAllBookings: jest.fn().mockResolvedValue([
              { id: 1, name: 'Booking 1' },
              { id: 2, name: 'Booking 2' },
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllBookings', () => {
    it('should return a list of all reservations from the service', async () => {
      const result = await controller.getAllBookings();

      expect(result).toEqual([
        { id: 1, name: 'Booking 1' },
        { id: 2, name: 'Booking 2' },
      ]);

      expect(service.getAllBookings).toHaveBeenCalledTimes(1);
    });
  });
});
