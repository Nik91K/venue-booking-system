import { faker } from '@faker-js/faker';
import { Establishment } from '@modules/establishment/entities/establishment.entity';
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
    private readonly establishmentTypeRepository: Repository<EstablishmentType>
  ) {}

  async seedData(count: number = 20) {
    const establishments: Establishment[] = [];
    const owners = await this.userRepository.find({
      where: { role: UserRole.OWNER },
    });
    const moderators = await this.userRepository.find({
      where: { role: UserRole.MODERATOR },
    });
    const type = await this.establishmentTypeRepository.find();

    if (owners.length === 0) {
      throw new Error('No users with OWNER role found');
    }

    if (moderators.length === 0) {
      throw new Error('No users with MODERATOR role found');
    }

    for (let i = 0; i < count; i++) {
      const establishment = this.establishmentRepository.create({
        name: faker.company.name(),
        address: faker.location.street(),
        description: faker.lorem.paragraph(),
        totalSeats: faker.number.int({ min: 1, max: 100 }),
        owner: faker.helpers.arrayElement(owners),
        moderators: faker.helpers.arrayElements(moderators, 3),
        type: faker.helpers.arrayElement(type),
        coverPhoto: 'https://placehold.co/600x400',
        photos: Array.from({ length: 5 }, () =>
          faker.image.urlPicsumPhotos({ width: 600, height: 400 })
        ),
      });
      establishments.push(establishment);
    }

    await this.establishmentRepository.save(establishments);
  }
}
