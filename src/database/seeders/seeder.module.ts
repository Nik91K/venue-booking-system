import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Establishment } from 'src/establishment/entities/establishment.entity';
import { EstablishmentType } from 'src/establishment-type/entities/establishment-type.entity';
import { User } from 'src/users/entities/user.entity';

import { MainSeeder } from './main.seeder';
import { AdminSeeder } from './seedersData/admin.seeder';
import { CommentSeeder } from './seedersData/comment.seeder';
import { EstablishmentSeeder } from './seedersData/establishment.seeder';
import { EstablishmentTypeSeeder } from './seedersData/establishmentType.seeder';
import { UserSeeder } from './seedersData/user.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Establishment, Comment, EstablishmentType]),
  ],
  providers: [
    UserSeeder,
    EstablishmentSeeder,
    CommentSeeder,
    EstablishmentTypeSeeder,
    MainSeeder,
    AdminSeeder,
  ],
  exports: [MainSeeder],
})
export class SeederModule {}
