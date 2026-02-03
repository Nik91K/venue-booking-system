import { faker } from '@faker-js/faker';
import { Establishment } from '@modules/establishment/entities/establishment.entity';
import { User } from '@modules/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from '@/modules/comment/entities/comment.entity';

@Injectable()
export class CommentSeeder {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>
  ) {}

  async seedData(count: number = 20) {
    const users = await this.userRepository.find();
    const establishments = await this.establishmentRepository.find();

    if (users.length === 0 || establishments.length === 0) {
      throw new Error('Please seed users and establishments first');
    }

    const comments: Comment[] = [];

    for (let i = 0; i < count; i++) {
      const comment = this.commentRepository.create({
        text: faker.lorem.paragraph(),
        rating: faker.number.int({ min: 1, max: 5 }),
        user: faker.helpers.arrayElement(users),
        establishment: faker.helpers.arrayElement(establishments),
      });

      comments.push(comment);
    }

    await this.commentRepository.save(comments);
  }
}
