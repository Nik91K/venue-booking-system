import { ApiProperty } from '@nestjs/swagger';

export class UploadPhotosDto {
  @ApiProperty({ 
    type: 'string', 
    format: 'binary',
    description: 'Cover photo for the establishment'
  })
  coverPhoto?: Express.Multer.File;

  @ApiProperty({ 
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Array of establishment photos (max 8)',
    maxItems: 8
  })
  photos?: Express.Multer.File[];
}