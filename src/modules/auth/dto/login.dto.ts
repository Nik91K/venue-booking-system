import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@example.com', description: 'Email' })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'Password123', description: 'Password' })
  password: string;
}
