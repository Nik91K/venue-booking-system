import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { faker } from '@faker-js/faker';
import { Establishment } from "src/establishment/entities/establishment.entity";
import { User, UserRole } from "src/users/entities/user.entity";
import { EstablishmentType } from "src/establishment-type/entities/establishment-type.entity";

@Injectable()
export class EstablishmentSeeder {
  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EstablishmentType)
    private readonly establishmentTypeRepository: Repository<EstablishmentType>,
  ) {}

  async seedData(count: number = 20) {
    const establishments: Establishment[] = []
    const owners = await this.userRepository.find({
      where: { role: UserRole.OWNER }
    })
    const type = await this.establishmentTypeRepository.find()

    if (owners.length === 0) {
      throw new Error()
    }

    if (owners.length === 0) {
      throw new Error('No users with OWNER role found')
    }

    for (let i = 0; i < count; i ++) {
      const establishment = this.establishmentRepository.create({
        name: faker.company.name(),
        address: faker.location.street(),
        description: faker.lorem.paragraph(),
        totalSeats: faker.number.int({ min: 1, max: 100 }),
        owner: faker.helpers.arrayElement(owners),
        type: faker.helpers.arrayElement(type),
        coverPhoto: 'https://placehold.co/600x400',
        photos: Array.from({ length: 5 }, () =>
          faker.image.urlPicsumPhotos({ width: 600, height: 400 })
        )
      })
      establishments.push(establishment)
    }

    return await this.establishmentRepository.save(establishments)
  }
}