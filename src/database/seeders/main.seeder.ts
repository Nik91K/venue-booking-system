import { Injectable } from '@nestjs/common';
import { UserSeeder } from './user.seeder';
import { EstablishmentSeeder } from './establishment.seeder';
import { CommentSeeder } from './comment.seeder';
import { EstablishmentTypeSeeder } from './establishmentType.seeder';

@Injectable()
export class MainSeeder {
  constructor(
    private readonly userSeeder: UserSeeder,
    private readonly establishmentTypeSeeder: EstablishmentTypeSeeder,
    private readonly establishmentSeeder: EstablishmentSeeder,
    private readonly commentSeeder: CommentSeeder
  ) {}

  async run() {
    const users = await this.userSeeder.seedData(7);
    console.log(`Created ${users.length} users`)
    const establishmentType = await this.establishmentTypeSeeder.seedData(3)
    console.log(`Created ${establishmentType.length} establishment types`)
    const establishments = await this.establishmentSeeder.seedData(100);
    console.log(`Created ${establishments.length} establishments`)
    const comments = await this.commentSeeder.seedData(100);
    console.log(`Created ${comments.length} comments`)
  }

}
