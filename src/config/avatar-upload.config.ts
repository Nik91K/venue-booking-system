import { FileUploadService } from '@common/services/file-upload.service';

export const avatarUploadService = {
  provide: FileUploadService,
  useFactory: () =>
    new FileUploadService({
      folder: 'avatars',
      prefix: 'avatar',
    }),
};
