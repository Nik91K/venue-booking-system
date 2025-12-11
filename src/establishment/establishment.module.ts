import { Module } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { EstablishmentController } from './establishment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Establishment } from './entities/establishment.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Feature } from 'src/features/entities/feature.entity';
import { EstablishmentType } from 'src/establishment-type/entities/establishment-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Establishment, Comment, Feature, EstablishmentType]),
    AuthModule
  ],
  controllers: [EstablishmentController],
  providers: [EstablishmentService],
  exports: [EstablishmentService],
})
export class EstablishmentModule {}
