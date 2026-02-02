import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { RefreshToken } from '@/auth/entities/refresh-token.entity';
import {
  generateAvatarSeed,
  generateAvatarUrl,
} from '@/common/utils/avatar.util';
import { User, UserRole } from '@/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: CreateAuthDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('User already exists');

    const avatarSeed = generateAvatarSeed();
    const avatarUrl = generateAvatarUrl(avatarSeed);

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hash,
      avatarUrl,
      avatarSeed,
      role: UserRole.USER,
    });
    await this.userRepo.save(user);

    const tokens = await this.getTokens(user.id, user.email, user.role);
    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    return { user, ...tokens };
  }

  async getTokens(userId: number, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN) || 900,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN) || 604800,
    });

    const hashedToken = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date();
    const expiresInDays = Number(process.env.JWT_REFRESH_EXPIRES_IN) || 604800;
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await this.refreshTokenRepo.delete({ user: { id: userId } });

    const refreshTokenEntity = this.refreshTokenRepo.create({
      hashedToken,
      user: { id: userId },
      expiresAt,
    });
    await this.refreshTokenRepo.save(refreshTokenEntity);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    let payload: any;
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return this.getTokens(payload.sub, payload.email, payload.role);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
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

  async changeRole(id: number, role: UserRole) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    user.role = role;
    await this.userRepo.save(user);

    const tokens = await this.getTokens(user.id, user.email, user.role);

    return { user, ...tokens, message: 'Role updated' };
  }

  async logout(userId: number) {
    await this.refreshTokenRepo.delete({ user: { id: userId } });
    return { message: 'Logged out' };
  }

  async logoutAllDevices(userId: number) {
    await this.refreshTokenRepo.delete({ user: { id: userId } });
    return { message: 'Logged out from all devices' };
  }
}
