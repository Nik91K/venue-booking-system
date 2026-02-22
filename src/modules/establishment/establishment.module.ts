import { AuthModule } from '@modules/auth/auth.module';
import { Comment } from '@modules/comment/entities/comment.entity';
import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { EstablishmentController } from '@modules/establishment/establishment.controller';
import { EstablishmentService } from '@modules/establishment/establishment.service';
import { EstablishmentType } from '@modules/establishment-type/entities/establishment-type.entity';
import { Feature } from '@modules/features/entities/feature.entity';
import { User } from '@modules/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EstablishmentOwnerGuard } from '@/common/guard/establishment-owner.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Establishment,
      Comment,
      Feature,
      EstablishmentType,
      User,
    ]),
    AuthModule,
  ],
  controllers: [EstablishmentController],
  providers: [EstablishmentService, EstablishmentOwnerGuard],
  exports: [EstablishmentService],
})
export class EstablishmentModule {}
