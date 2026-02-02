import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AdminSeeder } from '@/database/seeders/seedersData/admin.seeder';
import { CommentSeeder } from '@/database/seeders/seedersData/comment.seeder';
import { EstablishmentSeeder } from '@/database/seeders/seedersData/establishment.seeder';
import { EstablishmentTypeSeeder } from '@/database/seeders/seedersData/establishmentType.seeder';
import { UserSeeder } from '@/database/seeders/seedersData/user.seeder';

@Injectable()
export class MainSeeder {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly userSeeder: UserSeeder,
    private readonly adminSeeder: AdminSeeder,
    private readonly establishmentTypeSeeder: EstablishmentTypeSeeder,
    private readonly establishmentSeeder: EstablishmentSeeder,
    private readonly commentSeeder: CommentSeeder
  ) {}

  async run() {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();
    await this.userSeeder.seedData({
      user: 4,
      moderator: 2,
      owner: 2,
    });
    await this.adminSeeder.seedAdmin();
    await this.establishmentTypeSeeder.seedData(3);
    await this.establishmentSeeder.seedData(100);
    await this.commentSeeder.seedData(200);
  }
}
