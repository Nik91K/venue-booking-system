import { faker } from '@faker-js/faker';
import { User, UserRole } from '@modules/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  generateAvatarSeed,
  generateAvatarUrl,
} from 'src/common/utils/avatar.util';
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

    const uniqueEmails = new Set<string>();
    const uniquePhones = new Set<string>();

    for (let i = 0; i < defaultCounts.user; i++) {
      users.push(
        await this.createUser(UserRole.USER, uniqueEmails, uniquePhones)
      );
    }

    for (let i = 0; i < defaultCounts.moderator; i++) {
      users.push(
        await this.createUser(UserRole.MODERATOR, uniqueEmails, uniquePhones)
      );
    }

    for (let i = 0; i < defaultCounts.owner; i++) {
      users.push(
        await this.createUser(UserRole.OWNER, uniqueEmails, uniquePhones)
      );
    }

    return this.userRepository.save(users);
  }

  private async createUser(
    role: UserRole,
    uniqueEmails: Set<string>,
    uniquePhones: Set<string>
  ): Promise<User> {
    const avatarSeed = generateAvatarSeed();
    const avatarUrl = generateAvatarUrl(avatarSeed);

    let email: string = faker.internet.email();
    let phoneNumber: string = faker.phone.number({ style: 'international' });

    while (uniqueEmails.has(email)) {
      email = faker.internet.email();
    }

    while (uniquePhones.has(phoneNumber)) {
      phoneNumber = faker.phone.number({ style: 'international' });
    }

    return this.userRepository.create({
      name: faker.person.fullName(),
      email,
      password: await bcrypt.hash('MyPassword1', 10),
      phoneNumber,
      avatarSeed,
      avatarUrl,
      role,
    });
  }
}
