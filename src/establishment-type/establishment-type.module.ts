import { Module } from '@nestjs/common';
import { EstablishmentTypeService } from './establishment-type.service';
import { EstablishmentTypeController } from './establishment-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstablishmentType } from './entities/establishment-type.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstablishmentType]),
    AuthModule
  ],
  controllers: [EstablishmentTypeController],
  providers: [EstablishmentTypeService],
  exports: [EstablishmentTypeService],
})
export class EstablishmentTypeModule {}
