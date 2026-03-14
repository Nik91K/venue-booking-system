import { FileUploadService } from '@common/services/file-upload.service';

export const establishmentUploadService = {
  provide: FileUploadService,
  useFactory: () =>
    new FileUploadService({
      folder: 'establishments',
      prefix: 'establishment',
    }),
};
