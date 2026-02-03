import * as crypto from 'crypto';
import { extname } from 'path';

import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const editFileName = (
  _req: any,
  file: Express.Multer.File,
  callback: any
) => {
  const uniqueSuffix = crypto.randomUUID();
  callback(null, `establishment-${uniqueSuffix}${extname(file.originalname)}`);
};

export const imageFileFilter = (
  _req: any,
  file: Express.Multer.File,
  callback: any
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false
    );
  }
  callback(null, true);
};

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads/establishments',
    filename: editFileName,
  }),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
