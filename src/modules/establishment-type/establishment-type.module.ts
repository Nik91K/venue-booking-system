import { AuthModule } from '@modules/auth/auth.module';
import { EstablishmentType } from '@modules/establishment-type/entities/establishment-type.entity';
import { EstablishmentTypeController } from '@modules/establishment-type/establishment-type.controller';
import { EstablishmentTypeService } from '@modules/establishment-type/establishment-type.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EstablishmentType]), AuthModule],
  controllers: [EstablishmentTypeController],
  providers: [EstablishmentTypeService],
  exports: [EstablishmentTypeService],
})
export class EstablishmentTypeModule {}
