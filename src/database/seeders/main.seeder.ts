import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AdminSeeder } from './admin.seeder';
import { CommentSeeder } from './comment.seeder';
import { EstablishmentSeeder } from './establishment.seeder';
import { EstablishmentTypeSeeder } from './establishmentType.seeder';
import { UserSeeder } from './user.seeder';

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
    const users = await this.userSeeder.seedData({
      user: 4,
      moderator: 2,
      owner: 2,
    });
    console.log(`Created ${users.length} users`);
    await this.adminSeeder.seedAdmin();
    const establishmentType = await this.establishmentTypeSeeder.seedData(3);
    console.log(`Created ${establishmentType.length} establishment types`);
    const establishments = await this.establishmentSeeder.seedData(100);
    console.log(`Created ${establishments.length} establishments`);
    const comments = await this.commentSeeder.seedData(200);
    console.log(`Created ${comments.length} comments`);
  }
}
