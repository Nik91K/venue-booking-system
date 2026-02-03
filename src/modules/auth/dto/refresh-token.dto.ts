import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh_token', description: 'Refresh Token' })
  refreshToken: string;
}
