import { Feature } from '@modules/features/entities/feature.entity';
import { FeaturesController } from '@modules/features/features.controller';
import { FeaturesService } from '@modules/features/features.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Feature])],
  controllers: [FeaturesController],
  providers: [FeaturesService],
  exports: [FeaturesService],
})
export class FeaturesModule {}
