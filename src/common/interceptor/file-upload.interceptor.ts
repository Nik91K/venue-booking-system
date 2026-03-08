import { FileUploadService } from '@common/services/file-upload.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  protected readonly fieldName: string = 'file';

  constructor(private readonly fileUploadService: FileUploadService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const interceptor = new (FileInterceptor(
      this.fieldName,
      this.fileUploadService.multerOptions
    ))();
    return interceptor.intercept(context, next);
  }
}
