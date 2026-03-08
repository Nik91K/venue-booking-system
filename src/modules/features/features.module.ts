import { featureUploadService } from '@config/feature-upload.config';
import { Feature } from '@modules/features/entities/feature.entity';
import { FeaturesController } from '@modules/features/features.controller';
import { FeaturesService } from '@modules/features/features.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Feature])],
  controllers: [FeaturesController],
  providers: [FeaturesService, featureUploadService],
  exports: [FeaturesService],
})
export class FeaturesModule {}
