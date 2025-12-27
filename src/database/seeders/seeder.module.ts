import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Establishment } from 'src/establishment/entities/establishment.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { UserSeeder } from './user.seeder';
import { EstablishmentSeeder } from './establishment.seeder';
import { CommentSeeder } from './comment.seeder';
import { MainSeeder } from './main.seeder';
import { EstablishmentType } from 'src/establishment-type/entities/establishment-type.entity';
import { EstablishmentTypeSeeder } from './establishmentType.seeder';

@Module ({
  imports: [TypeOrmModule.forFeature([User, Establishment, Comment, EstablishmentType])],
  providers: [UserSeeder, EstablishmentSeeder, CommentSeeder, EstablishmentTypeSeeder, MainSeeder ],
  exports: [MainSeeder]
})

export class SeederModule {}
