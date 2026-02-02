import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { UserRole } from '@/users/entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @ApiProperty({ example: 'Name', description: 'User name' })
  name?: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'Password123', description: 'Password' })
  password?: string;

  @IsEnum(UserRole)
  @ApiProperty({
    example: UserRole.USER,
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
  })
  role?: UserRole;

  @IsOptional()
  @ApiProperty({ example: 1, description: 'Esablishment ID' })
  establishmentId?: number;
}
