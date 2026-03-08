import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { extname } from 'path';

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { diskStorage } from 'multer';

export interface FileUploadOptions {
  folder: string;
  prefix: string;
  maxSizeBytes?: number;
}

const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp)$/i;
const ALLOWED_MIMETYPES = /^image\/(jpg|jpeg|png|gif|webp)$/i;

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly uploadDirectory: string;
  private readonly baseUploadsDir: string;

  constructor(private readonly options: FileUploadOptions) {
    this.baseUploadsDir = process.env.UPLOADS_PATH ?? 'uploads';
    this.uploadDirectory = path.join(this.baseUploadsDir, options.folder);
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists(): void {
    fs.mkdirSync(this.uploadDirectory, { recursive: true });
  }

  private imageFileFilter(
    _req: any,
    file: Express.Multer.File,
    callback: any
  ): void {
    const validExtension = ALLOWED_EXTENSIONS.test(file.originalname);
    const validMimetype = ALLOWED_MIMETYPES.test(file.mimetype);

    if (!validExtension || !validMimetype) {
      return callback(
        new BadRequestException(
          'Only image files are allowed (jpg, jpeg, png, gif, webp)'
        ),
        false
      );
    }

    callback(null, true);
  }

  private generateFileName(file: Express.Multer.File): string {
    const uniqueSuffix = crypto.randomUUID();
    return `${this.options.prefix}-${uniqueSuffix}${extname(file.originalname)}`;
  }

  get multerOptions() {
    return {
      storage: diskStorage({
        destination: this.uploadDirectory,
        filename: (_req: any, file: Express.Multer.File, callback: any) => {
          callback(null, this.generateFileName(file));
        },
      }),
      fileFilter: this.imageFileFilter.bind(this),
      limits: {
        fileSize: this.options.maxSizeBytes ?? 5 * 1024 * 1024,
      },
    };
  }

  getFileUrl(filename: string): string {
    return `/${this.baseUploadsDir}/${this.options.folder}/${filename}`;
  }

  deleteFile(fileUrl?: string | null): void {
    if (!fileUrl) return;

    const prefix = `/${this.baseUploadsDir}/${this.options.folder}/`;
    const filename = fileUrl.startsWith(prefix)
      ? fileUrl.slice(prefix.length)
      : null;

    if (!filename) return;

    const filePath = path.join(this.uploadDirectory, filename);

    try {
      fs.unlinkSync(filePath);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        this.logger.error(`Failed to delete file: ${filePath}`, err.stack);
      }
    }
  }
}
