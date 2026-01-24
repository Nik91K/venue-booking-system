import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstablishmentType } from 'src/establishment-type/entities/establishment-type.entity';
import { Repository } from 'typeorm';

import { ESTABLISHMENT_TYPES } from '@/database/seeders/fixtures/establishment-types.fixture';

@Injectable()
export class EstablishmentTypeSeeder {
  constructor(
    @InjectRepository(EstablishmentType)
    private readonly establishmentTypeRepository: Repository<EstablishmentType>
  ) {}
  async seedData(count: number = 3) {
    const types: EstablishmentType[] = [];

    for (let i = 0; i < count; i++) {
      const type = this.establishmentTypeRepository.create({
        name: ESTABLISHMENT_TYPES[i],
      });
      types.push(type);
    }
    await this.establishmentTypeRepository.save(types);
  }
}
