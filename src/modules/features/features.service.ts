import { FileUploadService } from '@common/services/file-upload.service';
import { CreateFeatureDto } from '@modules/features/dto/create-feature.dto';
import { UpdateFeatureDto } from '@modules/features/dto/update-feature.dto';
import { Feature } from '@modules/features/entities/feature.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
    private fileUploadService: FileUploadService
  ) {}

  async create(dto: CreateFeatureDto, image?: Express.Multer.File) {
    const feature = this.featureRepository.create({
      name: dto.name,
      image: image ? this.fileUploadService.getFileUrl(image.filename) : null,
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
      this.fileUploadService.deleteFile(feature.image);
      feature.image = this.fileUploadService.getFileUrl(image.filename);
    }

    Object.assign(feature, dto);

    return await this.featureRepository.save(feature);
  }

  async remove(id: number) {
    const feature = await this.featureRepository.findOne({ where: { id } });

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    this.fileUploadService.deleteFile(feature.image);
    await this.featureRepository.delete(id);

    return { message: 'Feature removed successfully' };
  }
}
