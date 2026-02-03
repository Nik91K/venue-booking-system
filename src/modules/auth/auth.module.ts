import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';
import { RefreshToken } from '@modules/auth/entities/refresh-token.entity';
import { JwtStrategy } from '@modules/auth/strategy/jwt.strategy';
import { User } from '@modules/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesGuard, JwtAuthGuard } from '@/common/guard/jwt.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, JwtAuthGuard],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
