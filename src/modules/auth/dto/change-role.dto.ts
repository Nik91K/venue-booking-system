import { UserRole } from '@modules/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ChangeRoleDto {
  @ApiProperty({
    enum: UserRole,
    description: 'New user role',
    example: UserRole.MODERATOR,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
