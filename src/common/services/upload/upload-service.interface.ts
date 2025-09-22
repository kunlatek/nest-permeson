export interface UploadServiceInterface {
  uploadMultipleFiles(files: Express.Multer.File[], path: string, fileNames?: string[], keepFiles?: string[]): Promise<string[]>;
}