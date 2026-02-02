import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateFeatureDto } from '@/features/dto/create-feature.dto';
import { UpdateFeatureDto } from '@/features/dto/update-feature.dto';
import { Feature } from '@/features/entities/feature.entity';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>
  ) {}

  async create(dto: CreateFeatureDto, image?: Express.Multer.File) {
    const feature = this.featureRepository.create({
      name: dto.name,
      image: image ? `/uploads/features/${image.filename}` : null,
    });

    return await this.featureRepository.save(feature);
  }

  async findAll() {
    return await this.featureRepository.find();
  }

  async findOne(id: number) {
    const feature = await this.featureRepository.findOne({ where: { id } });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    return feature;
  }

  async update(id: number, dto: UpdateFeatureDto, image?: Express.Multer.File) {
    const feature = await this.featureRepository.findOne({ where: { id } });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    if (image) {
      feature.image = `/uploads/features/${image.filename}`;
    }

    Object.assign(feature, dto);

    return await this.featureRepository.save(feature);
  }

  async remove(id: number) {
    const feature = await this.featureRepository.findOne({ where: { id } });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    await this.featureRepository.delete(id);

    return { message: 'Feature removed successfully' };
  }
}
