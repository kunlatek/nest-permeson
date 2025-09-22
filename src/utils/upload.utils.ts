import { StorageEnum } from "src/enums/storage.enum";
import { UploadService as PublicUploadService } from "src/common/services/upload/public-upload.service";
import { UploadService as GoogleUploadService } from "src/common/services/upload/google-upload.service";

export const getUploadService = (storage: StorageEnum) => {
  switch (storage) {
    case StorageEnum.LOCAL:
      return PublicUploadService;
    case StorageEnum.GOOGLE:
      return GoogleUploadService;
  }
};