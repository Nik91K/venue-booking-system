import { FileUploadService } from '@common/services/file-upload.service';

export const featureUploadService = {
  provide: FileUploadService,
  useFactory: () =>
    new FileUploadService({
      folder: 'features',
      prefix: 'feature',
    }),
};
