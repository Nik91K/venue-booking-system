import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  generateAvatarSeed,
  generateAvatarUrl,
} from 'src/common/utils/avatar.util';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async seedData(counts?: {
    user?: number;
    moderator?: number;
    owner?: number;
  }) {
    const defaultCounts = {
      user: counts?.user ?? 3,
      moderator: counts?.moderator ?? 3,
      owner: counts?.owner ?? 2,
    };
    const users: User[] = [];

    for (let i = 0; i < defaultCounts.user; i++) {
      users.push(await this.createUser(UserRole.USER));
    }

    for (let i = 0; i < defaultCounts.moderator; i++) {
      users.push(await this.createUser(UserRole.MODERATOR));
    }

    for (let i = 0; i < defaultCounts.owner; i++) {
      users.push(await this.createUser(UserRole.OWNER));
    }

    return this.userRepository.save(users);
  }

  private async createUser(role: UserRole) {
    const avatarSeed = generateAvatarSeed();
    const avatarUrl = generateAvatarUrl(avatarSeed);

    return this.userRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await bcrypt.hash('MyPassword1', 10),
      phoneNumber: faker.phone.number(),
      avatarSeed,
      avatarUrl,
      role,
    });
  }
}
