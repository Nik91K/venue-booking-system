import { faker } from '@faker-js/faker';
import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { Schedule } from '@modules/schedule/entities/schedule.entity';
import { User, UserRole } from '@modules/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EstablishmentType } from '@/modules/establishment-type/entities/establishment-type.entity';

@Injectable()
export class EstablishmentSeeder {
  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EstablishmentType)
    private readonly establishmentTypeRepository: Repository<EstablishmentType>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>
  ) {}

  async seedData(count: number = 20) {
    const establishments: Establishment[] = [];

    const owners = await this.userRepository.find({
      where: { role: UserRole.OWNER },
    });
    const moderators = await this.userRepository.find({
      where: { role: UserRole.MODERATOR },
    });
    const types = await this.establishmentTypeRepository.find();

    if (!owners.length) throw new Error('No users with OWNER role found');
    if (!moderators.length)
      throw new Error('No users with MODERATOR role found');

    for (let i = 0; i < count; i++) {
      const city = faker.location.city();
      const street = faker.location.street();
      const building = faker.string.numeric(2);
      const zipCode = faker.location.zipCode();

      const locationDetails = { city, street, building, zipCode };
      const address = `${city}, ${street} ${building}${zipCode ? `, ${zipCode}` : ''}`;

      const lat = faker.location.latitude({ min: 45, max: 50, precision: 4 });
      const lng = faker.location.longitude({ min: 24, max: 36, precision: 4 });

      const establishment = this.establishmentRepository.create({
        name: faker.company.name(),
        address,
        locationDetails,
        lat,
        lng,
        description: faker.lorem.paragraph(),
        totalSeats: faker.number.int({ min: 10, max: 100 }),
        owner: faker.helpers.arrayElement(owners),
        moderators: faker.helpers.arrayElements(moderators, 3),
        type: faker.helpers.arrayElement(types),
        coverPhoto: 'https://placehold.co/600x400',
        photos: Array.from({ length: 5 }, () =>
          faker.image.urlPicsumPhotos({ width: 600, height: 400 })
        ),
      });

      establishments.push(establishment);
    }

    await this.establishmentRepository.save(establishments);
    console.log(`${count} establishments seeded`);
  }
}
