import { FileUploadInterceptor } from '@common/interceptor/file-upload.interceptor';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AvatarUploadInterceptor extends FileUploadInterceptor {
  protected readonly fieldName = 'avatar';
}
