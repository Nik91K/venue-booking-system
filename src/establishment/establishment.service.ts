import { BadRequestException, Delete, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { Establishment } from './entities/establishment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature } from 'src/features/entities/feature.entity';
import { EstablishmentType } from 'src/establishment-type/entities/establishment-type.entity';

@Injectable()
export class EstablishmentService {
  constructor (
    @InjectRepository(Establishment)
    private establishmentRepository: Repository<Establishment>,
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
    @InjectRepository(EstablishmentType)
    private typeRepository: Repository<EstablishmentType>,
  ){}

  async create (createEstablishmentDto: CreateEstablishmentDto) {
    const establishment = this.establishmentRepository.create(createEstablishmentDto)

    if (createEstablishmentDto.typeId) {
      const type = await this.typeRepository.findOne({
        where: { id: createEstablishmentDto.typeId }
      })

      if (!type) {
        throw new NotFoundException(`EstablishmentType ${createEstablishmentDto.typeId} not found`)
      }

      establishment.type = type
    }

    return this.establishmentRepository.save(establishment)

  }

  async getAllReservation (): Promise<Establishment[]> {
    return this.establishmentRepository.find()
  }

  async getAllComments (id: number) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: id },
      relations: ['comments']
    })

    if(!establishment) {
      throw new NotFoundException(`Establishment ${id} invalid`)
    }

    return establishment.comments
  }

  async edit (id: number, updateEstablishmentDto: UpdateEstablishmentDto) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id },
      relations: ['features']
    })

    if(!establishment) {
      throw new NotFoundException(`Establishment ${id} invalid`)
    }

    this.establishmentRepository.merge(establishment, updateEstablishmentDto)
    return this.establishmentRepository.save(establishment)
  }

  async findOneWithFeatures(id: number) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id },
      relations: ['features', 'comments']
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${id} not found`);
    }

    return establishment;
  }

  async remove (id: number) {
    const result = await this.establishmentRepository.delete(id)
    return result
  }

    async addFeature(establishmentId: number, featureId: number) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
      relations: ['features']
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${establishmentId} not found`);
    }

    const feature = await this.featureRepository.findOne({
      where: { id: featureId }
    });

    if (!feature) {
      throw new NotFoundException(`Feature ${featureId} not found`);
    }

    const featureExists = establishment.features.some(f => f.id === featureId);
    
    if (featureExists) {
      throw new BadRequestException('Feature already added to this establishment');
    }

    establishment.features.push(feature);
    return await this.establishmentRepository.save(establishment);
  }

  async removeFeature(establishmentId: number, featureId: number) {
    const establishment = await this.establishmentRepository.findOne({
      where: { id: establishmentId },
      relations: ['features']
    });

    if (!establishment) {
      throw new NotFoundException(`Establishment ${establishmentId} not found`);
    }

    const initialLength = establishment.features.length;
    establishment.features = establishment.features.filter(f => f.id !== featureId);

    if (establishment.features.length === initialLength) {
      throw new NotFoundException(`Feature ${featureId} not found in this establishment`);
    }

    return await this.establishmentRepository.save(establishment);
  }

}
