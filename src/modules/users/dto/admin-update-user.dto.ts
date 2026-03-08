import { UserRole } from '@modules/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Name', description: 'User name' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'Password123', description: 'Password' })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'adventurous_panda',
    description: 'Avatar seed for generated avatar',
  })
  avatarSeed?: string | null;

  avatarUrl?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({
    example: UserRole.USER,
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
  })
  role?: UserRole;
}
