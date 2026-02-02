import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from '@/comment/entities/comment.entity';
import { MainSeeder } from '@/database/seeders/main.seeder';
import { AdminSeeder } from '@/database/seeders/seedersData/admin.seeder';
import { CommentSeeder } from '@/database/seeders/seedersData/comment.seeder';
import { EstablishmentSeeder } from '@/database/seeders/seedersData/establishment.seeder';
import { EstablishmentTypeSeeder } from '@/database/seeders/seedersData/establishmentType.seeder';
import { UserSeeder } from '@/database/seeders/seedersData/user.seeder';
import { Establishment } from '@/establishment/entities/establishment.entity';
import { EstablishmentType } from '@/establishment-type/entities/establishment-type.entity';
import { User } from '@/users/entities/user.entity';

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
