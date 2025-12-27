import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entities/refresh-token.entity';
import { generateAvatarSeed, generateAvatarUrl } from 'src/common/utils/avatar.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ){}

  async register (dto: CreateAuthDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } })
    if (existing) throw new ConflictException('User already exists')

    const avatarSeed = generateAvatarSeed()
    const avatarUrl = generateAvatarUrl(avatarSeed)

    const hash = await bcrypt.hash(dto.password, 10)
    const user = this.userRepo.create({ ...dto, password: hash, avatarUrl, avatarSeed });
    await this.userRepo.save(user)

    const tokens = await this.getTokens(user.id, user.email, user.role)
    return { user, ...tokens }
  }

  async login (dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    const tokens = await this.getTokens(user.id, user.email, user.role)
    return { user, ...tokens }
  }

  async getTokens (userId: number, email: string, role: UserRole) {
    const payload = { sub: userId, email, role }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    })

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    })

    const hashedToken = await bcrypt.hash(refreshToken, 10)

    const expiresAt = new Date()
    const expiresInDays = parseInt(process.env.JWT_REFRESH_EXPIRES_IN ?? '7', 10);
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    await this.refreshTokenRepo.delete({ user: { id: userId } })

    const refreshTokenEntity = this.refreshTokenRepo.create({
      hashedToken,
      user: { id: userId },
      expiresAt
    })
    await this.refreshTokenRepo.save(refreshTokenEntity)

    return { accessToken, refreshToken }
  }

  async refreshToken (refreshToken: string) {
    let payload: any
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      })
      return this.getTokens(payload.sub, payload.email, payload.role)
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async findAll () {
    const users = await this.userRepo.find({
      relations: ['establishment', 'bookings']
    })
    return users.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
  }

  async getCurrentUser (userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['bookings', 'comments']
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async getUserById (id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['comments']
    })

    if (!user) {
      throw new NotFoundException(`User ${id} not found`)
    }

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async updateCurrentUser (userId: number, dto: UpdateAuthDto) {
    const user = await this.userRepo.findOneBy({ id: userId })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10)
    }

    Object.assign(user, dto)
    const updatedUser = await this.userRepo.save(user)

    const { password, ...userWithoutPassword } = updatedUser
    return userWithoutPassword
  }

  async update (id: number, dto: UpdateAuthDto) {
    const user = await this.userRepo.findOneBy({ id })
    if (!user) return null

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10)
    }

    Object.assign(user, dto)
    return this.userRepo.save(user)
  }

  async deleteUser (id: number) {
    const user = await this.userRepo.findOneBy({ id })

    if (!user) {
      throw new NotFoundException(`User ${id} not found`)
    }

    await this.refreshTokenRepo.delete({user: { id }})
    await this.userRepo.delete(id)
    return user;
  }

  async changeRole (id: number, role: UserRole) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    user.role = role
    await this.userRepo.save(user)

    const tokens = await this.getTokens(user.id, user.email, user.role)

    return { user, ...tokens, message: 'Role updated' }
  }

  async logout (userId: number) {
    await this.refreshTokenRepo.delete({user: {id: userId}})
    return { message: 'Logged out' }
  }

  async logoutAllDevices (userId: number) {
    await this.refreshTokenRepo.delete({user: {id: userId}})
    return { message: 'Logged out from all devices' }
  }
}