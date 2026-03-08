import { RefreshToken } from '@modules/auth/entities/refresh-token.entity';
import { User } from '@modules/users/entities/user.entity';
import { UsersController } from '@modules/users/users.controller';
import { UsersService } from '@modules/users/users.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { avatarUploadService } from '@/config/avatar-upload.config';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  controllers: [UsersController],
  providers: [UsersService, avatarUploadService],
  exports: [UsersService],
})
export class UsersModule {}
