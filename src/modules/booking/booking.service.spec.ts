import { BookingService } from '@modules/booking/booking.service';
import { Booking } from '@modules/booking/entities/booking.entity';
import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { User } from '@modules/users/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

describe('BookingService', () => {
  let service: BookingService;
  let userRepository: Repository<User>;
  let establishmentRepository: Repository<Establishment>;
  let bookingRepository: Repository<Booking>;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };

  const mockEntityManager = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Establishment),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Booking),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(callback => callback(mockEntityManager)),
          },
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    establishmentRepository = module.get<Repository<Establishment>>(
      getRepositoryToken(Establishment)
    );
    bookingRepository = module.get<Repository<Booking>>(
      getRepositoryToken(Booking)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createBookingDto = {
      establishment: 1,
      bookingDate: '2025-12-25',
      bookingTime: '18:30',
      numberOfGuests: 2,
    };

    it('should create a new booking for a valid user and establishment', async () => {
      const mockUser = { id: 1, name: 'User' } as User;
      const mockEstablishment = {
        id: 1,
        name: 'Establishment',
        totalSeats: 10,
      } as Establishment;
      const mockCreatedBooking = {
        id: 1,
        ...createBookingDto,
        user: mockUser,
        establishment: mockEstablishment,
        status: 'confirmed',
        createdAt: new Date(),
      } as unknown as Booking;

      jest
        .spyOn(mockEntityManager, 'findOne')
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockEstablishment)
        .mockResolvedValueOnce(null);

      jest.spyOn(mockQueryBuilder, 'getRawOne').mockResolvedValue({ sum: 0 });
      jest
        .spyOn(mockEntityManager, 'create')
        .mockReturnValue(mockCreatedBooking as Booking);
      jest
        .spyOn(mockEntityManager, 'save')
        .mockResolvedValue(mockCreatedBooking as Booking);

      const result = await service.create(createBookingDto, mockUser.id);

      expect(result).toEqual(mockCreatedBooking);

      expect(mockEntityManager.create).toHaveBeenCalledWith(
        Booking,
        expect.objectContaining({
          bookingDate: new Date(createBookingDto.bookingDate),
          bookingTime: createBookingDto.bookingTime,
          numberOfGuests: createBookingDto.numberOfGuests,
          user: mockUser,
          establishment: mockEstablishment,
        })
      );
      expect(mockEntityManager.save).toHaveBeenCalledWith(mockCreatedBooking);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const mockUser = { id: 1, name: 'User' } as User;

      jest.spyOn(mockEntityManager, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.create(createBookingDto, mockUser.id)
      ).rejects.toThrow(new NotFoundException(`User ${mockUser.id} not found`));

      expect(mockEntityManager.findOne).toHaveBeenCalledWith(User, {
        where: { id: mockUser.id },
      });
      expect(mockEntityManager.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if establishment does not exist', async () => {
      const mockUser = { id: 1, name: 'User' } as User;

      jest
        .spyOn(mockEntityManager, 'findOne')
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);

      await expect(
        service.create(createBookingDto, mockUser.id)
      ).rejects.toThrow(
        new NotFoundException(
          `Establishment ${createBookingDto.establishment} not found`
        )
      );

      expect(mockEntityManager.findOne).toHaveBeenCalledWith(Establishment, {
        where: { id: createBookingDto.establishment },
      });
      expect(mockEntityManager.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if not enough seats available', async () => {
      const mockUser = { id: 1, name: 'User' } as User;
      const mockEstablishment = {
        id: 1,
        name: 'Establishment',
        totalSeats: 10,
      } as Establishment;

      jest
        .spyOn(mockEntityManager, 'findOne')
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockEstablishment)
        .mockResolvedValueOnce(null);

      jest.spyOn(mockQueryBuilder, 'getRawOne').mockResolvedValue({ sum: 9 });

      await expect(service.create(createBookingDto, 1)).rejects.toThrow(
        new BadRequestException('Not enough seats available')
      );
    });

    it('should throw BadRequestException if numberOfGuests exceeds totalSeats', async () => {
      const mockUser = { id: 1, name: 'User' } as User;
      const mockEstablishment = {
        id: 1,
        name: 'Establishment',
        totalSeats: 1,
      } as Establishment;

      jest
        .spyOn(mockEntityManager, 'findOne')
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockEstablishment)
        .mockResolvedValueOnce(null);

      jest.spyOn(mockQueryBuilder, 'getRawOne').mockResolvedValue({ sum: -5 });

      await expect(service.create(createBookingDto, 1)).rejects.toThrow(
        new BadRequestException('Number of guests exceeds total seats (1)')
      );
    });

    it('should rollback (not save) if any error occurs during creation', async () => {
      const mockUser = { id: 1, name: 'User' } as User;
      const mockEstablishment = {
        id: 1,
        name: 'Establishment',
        totalSeats: 10,
      } as Establishment;

      jest
        .spyOn(mockEntityManager, 'findOne')
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockEstablishment)
        .mockResolvedValueOnce(null);

      jest.spyOn(mockQueryBuilder, 'getRawOne').mockResolvedValue({ sum: 10 });

      await expect(
        service.create(createBookingDto, mockUser.id)
      ).rejects.toThrow();

      expect(mockEntityManager.save).not.toHaveBeenCalled();
    });
  });

  describe('getBookingById', () => {
    it('should return a booking if it exists', async () => {
      const mockBooking = { id: 5, bookingTime: '20:00' } as Booking;

      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(mockBooking);

      const result = await service.getBookingById(5);

      expect(result).toEqual(mockBooking);
      expect(bookingRepository.findOne).toHaveBeenCalledWith({
        where: { id: 5 },
        relations: ['user', 'establishment'],
      });
    });

    it('should throw NotFoundException if booking does not exist', async () => {
      jest.spyOn(bookingRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getBookingById(5)).rejects.toThrow(
        new NotFoundException('Booking 5 not found')
      );

      expect(bookingRepository.findOne).toHaveBeenCalledWith({
        where: { id: 5 },
        relations: ['user', 'establishment'],
      });
    });
  });

  describe('getAllBookings', () => {
    it('should return all bookings with user and establishment relations', async () => {
      const mockBookings = [
        { id: 1, bookingTime: '20:00' },
        { id: 2, bookingTime: '21:00' },
        { id: 3, bookingTime: '22:00' },
      ] as Booking[];

      jest.spyOn(bookingRepository, 'find').mockResolvedValue(mockBookings);

      const result = await service.getAllBookings();

      expect(result).toEqual(mockBookings);
      expect(bookingRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'establishment'],
      });
    });
  });

  describe('getUserBookings', () => {
    const expectedQuery = {
      where: { user: { id: 1 } },
      relations: ['establishment'],
      order: { bookingDate: 'DESC' },
    };

    it('should return bookings for the given user, ordered by date descending', async () => {
      const mockBookings = [
        { id: 1, bookingTime: '20:00' },
        { id: 2, bookingTime: '21:00' },
        { id: 3, bookingTime: '22:00' },
      ] as Booking[];

      jest.spyOn(bookingRepository, 'find').mockResolvedValue(mockBookings);

      const result = await service.getUserBookings(1);

      expect(result).toEqual(mockBookings);
      expect(bookingRepository.find).toHaveBeenCalledWith(expectedQuery);
    });

    it('should return an empty array if the user has no bookings', async () => {
      jest.spyOn(bookingRepository, 'find').mockResolvedValue([]);

      const result = await service.getUserBookings(1);

      expect(result).toEqual([]);
    });
  });

  describe('getEstablishmentBookings', () => {
    const expectedQuery = {
      where: { establishment: { id: 1 } },
      relations: ['user'],
      order: { bookingDate: 'DESC' },
    };

    it('should return bookings for the given establishment, ordered by date descending', async () => {
      const mockBookings = [
        { id: 1, bookingTime: '20:00' },
        { id: 2, bookingTime: '21:00' },
        { id: 3, bookingTime: '22:00' },
      ] as Booking[];

      jest.spyOn(bookingRepository, 'find').mockResolvedValue(mockBookings);

      const result = await service.getEstablishmentBookings(1);

      expect(result).toEqual(mockBookings);
      expect(bookingRepository.find).toHaveBeenCalledWith(expectedQuery);
    });

    it('should return an empty array if the establishment has no bookings', async () => {
      jest.spyOn(bookingRepository, 'find').mockResolvedValue([]);

      const result = await service.getEstablishmentBookings(1);

      expect(result).toEqual([]);
    });
  });
});
