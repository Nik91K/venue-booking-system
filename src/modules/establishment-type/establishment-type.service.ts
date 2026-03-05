import { EstablishmentType } from '@modules/establishment-type/entities/establishment-type.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateEstablishmentTypeDto } from './dto/create-establishment-type.dto';
import { UpdateEstablishmentTypeDto } from './dto/update-establishment-type.dto';

@Injectable()
export class EstablishmentTypeService {
  constructor(
    @InjectRepository(EstablishmentType)
    private typeRepository: Repository<EstablishmentType>
  ) {}

  async create(createEstablishmentTypeDto: CreateEstablishmentTypeDto) {
    return this.typeRepository.save(
      this.typeRepository.create(createEstablishmentTypeDto)
    );
  }

  async findAll(): Promise<EstablishmentType[]> {
    return await this.typeRepository.find();
  }

  async findOne(id: number): Promise<EstablishmentType> {
    const type = await this.typeRepository.findOne({
      where: { id },
    });

    if (!type) {
      throw new NotFoundException(`EstablishmentType ${id} not found`);
    }

    return type;
  }

  async update(
    id: number,
    updateEstablishmentTypeDto: UpdateEstablishmentTypeDto
  ) {
    const type = await this.findOne(id);
    this.typeRepository.merge(type, updateEstablishmentTypeDto);
    return this.typeRepository.save(type);
  }

  async remove(id: number) {
    const type = await this.typeRepository.delete(id);
    if (type.affected === 0) {
      throw new NotFoundException(`EstablishmentType ${id} not found`);
    }
    return type;
  }
}
