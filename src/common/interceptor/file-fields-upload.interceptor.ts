import { FileUploadService } from '@common/services/file-upload.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Injectable()
export class FileFieldsUploadInterceptor implements NestInterceptor {
  constructor(private readonly fileUploadService: FileUploadService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const interceptor = new (FileFieldsInterceptor(
      [
        { name: 'coverPhoto', maxCount: 1 },
        { name: 'photos', maxCount: 8 },
      ],
      this.fileUploadService.multerOptions
    ))();
    return interceptor.intercept(context, next);
  }
}
