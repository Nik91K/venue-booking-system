import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { User } from '@modules/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MainSeeder } from '@/database/seeders/main.seeder';
import { AdminSeeder } from '@/database/seeders/seedersData/admin.seeder';
import { CommentSeeder } from '@/database/seeders/seedersData/comment.seeder';
import { EstablishmentSeeder } from '@/database/seeders/seedersData/establishment.seeder';
import { EstablishmentTypeSeeder } from '@/database/seeders/seedersData/establishmentType.seeder';
import { UserSeeder } from '@/database/seeders/seedersData/user.seeder';
import { Comment } from '@/modules/comment/entities/comment.entity';
import { EstablishmentType } from '@/modules/establishment-type/entities/establishment-type.entity';

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
