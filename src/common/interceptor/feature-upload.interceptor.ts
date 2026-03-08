import { FileUploadInterceptor } from '@common/interceptor/file-upload.interceptor';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FeatureUploadInterceptor extends FileUploadInterceptor {
  protected readonly fieldName = 'image';
}
