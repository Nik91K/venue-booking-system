import { PageMetaDto } from '@common/pagination/dto/page-meta.dto';
import { PageOptionsDto } from '@common/pagination/dto/page-options.dto';
import { PageDto } from '@common/pagination/dto/page.dto';
import { RefreshToken } from '@modules/auth/entities/refresh-token.entity';
import { UpdateUserDto } from '@modules/users/dto/update-user.dto';
import { User } from '@modules/users/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>
  ) {}

  async updateCurrentUser(userId: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    this.userRepo.merge(user, dto);
    const updatedUser = await this.userRepo.save(user);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) return null;

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    this.userRepo.merge(user, dto);
    return this.userRepo.save(user);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = this.userRepo
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.bookings', 'bookings')
      .orderBy('users.id', pageOptionsDto.order);

    if (pageOptionsDto.search) {
      queryBuilder.andWhere(
        '(LOWER(users.name) LIKE LOWER(:search) OR LOWER(users.email) LIKE LOWER(:search) OR users.phoneNumber LIKE :search)',
        { search: `%${pageOptionsDto.search}%` }
      );
    }

    queryBuilder.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder
      .clone()
      .offset(undefined)
      .limit(undefined)
      .getCount();

    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(entities, pageMetaDto);
  }

  async getCurrentUser(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['bookings', 'comments'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    await this.refreshTokenRepo.delete({ user: { id } });
    await this.userRepo.delete(id);
    return user;
  }
}
