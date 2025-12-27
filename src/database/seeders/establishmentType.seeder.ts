import { EstablishmentType } from "src/establishment-type/entities/establishment-type.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { faker } from '@faker-js/faker';

@Injectable()
export class EstablishmentTypeSeeder {
  constructor(
    @InjectRepository(EstablishmentType)
    private readonly establishmentTypeRepository: Repository<EstablishmentType>,
  ){}
  async seedData(count: number = 3) {
    const types: EstablishmentType[] = []
  
    for (let i = 0; i < count; i++) {
      const type = this.establishmentTypeRepository.create({
        name: faker.food.dish(),
        image: faker.image.url()
      })
      types.push(type)
    }
    return await this.establishmentTypeRepository.save(types)
  }
}
