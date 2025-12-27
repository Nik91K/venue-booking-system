import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { faker } from '@faker-js/faker';
import { User, UserRole } from "src/users/entities/user.entity";
import * as bcrypt from 'bcrypt';
import { generateAvatarSeed, generateAvatarUrl } from "src/common/utils/avatar.util";

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seedData(count: number = 10) {
    const users: User[] = []

    for (let i = 0; i < count; i++) {
      const avatarSeed = generateAvatarSeed()
      const avatarUrl = generateAvatarUrl(avatarSeed)

      const user = this.userRepository.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('MyPassword1', 10),
        phoneNumber: faker.phone.number(),
        avatarSeed: avatarSeed,
        avatarUrl: avatarUrl,
        role: faker.helpers.arrayElement([
          UserRole.USER,
          UserRole.MODERATOR,
          UserRole.OWNER
        ])
      })

      users.push(user)
    }

    return await this.userRepository.save(users)
  }
}