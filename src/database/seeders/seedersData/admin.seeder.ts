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
export class AdminSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async seedAdmin() {
    const adminAvatarSeed = generateAvatarSeed();
    const adminAvatarUrl = generateAvatarUrl(adminAvatarSeed);

    const admin = this.userRepository.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('MyPassword1', 10),
      phoneNumber: '+380900000000',
      avatarSeed: adminAvatarSeed,
      avatarUrl: adminAvatarUrl,
      role: UserRole.SUPER_ADMIN,
    });

    return await this.userRepository.save(admin);
  }
}
