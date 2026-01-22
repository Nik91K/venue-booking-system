import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Establishment } from 'src/establishment/entities/establishment.entity';
import { EstablishmentType } from 'src/establishment-type/entities/establishment-type.entity';
import { User } from 'src/users/entities/user.entity';

import { AdminSeeder } from './admin.seeder';
import { CommentSeeder } from './comment.seeder';
import { EstablishmentSeeder } from './establishment.seeder';
import { EstablishmentTypeSeeder } from './establishmentType.seeder';
import { MainSeeder } from './main.seeder';
import { UserSeeder } from './user.seeder';

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
