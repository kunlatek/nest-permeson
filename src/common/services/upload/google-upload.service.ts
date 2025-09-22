import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Storage } from "@google-cloud/storage";
import { UploadServiceInterface } from "./upload-service.interface";

@Injectable()
export class UploadService implements UploadServiceInterface {
  private readonly storage: Storage;
  private readonly publicBucketName: string;
  private readonly privateBucketName: string;
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly configService: ConfigService) {
    // Initialize Google Cloud Storage
    // This assumes the GCS_CREDENTIALS environment variable is set with the JSON key file content
    this.storage = new Storage();

    this.publicBucketName = this.configService.get<string>(
      "GCS_PUBLIC_BUCKET_NAME"
    );
    this.privateBucketName = this.configService.get<string>(
      "GCS_PRIVATE_BUCKET_NAME"
    );

    if (!this.publicBucketName || !this.privateBucketName) {
      this.logger.error(
        "GCS bucket names are not configured in environment variables."
      );
      throw new Error("Google Cloud Storage is not properly configured.");
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    path: string = "",
    fileNames?: string[],
    keepFiles?: string[]
  ): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new Error("No files provided for upload.");
    }

    try {
      // Normaliza o path removendo barras extras e garantindo que termine com /
      const normalizedPath = path.replace(/^\/+|\/+$/g, "");
      const isPublic = normalizedPath.startsWith("public/");
      const bucketName = isPublic
        ? this.publicBucketName
        : this.privateBucketName;
      const bucket = this.storage.bucket(bucketName);

      // Lista arquivos existentes na pasta
      const existingFiles = await this.listFiles(normalizedPath);
      
      // Deleta apenas os arquivos que não estão na lista de arquivos para manter
      if (existingFiles.length > 0) {
        for (const existingFile of existingFiles) {
          // Se não há lista de arquivos para manter, deleta todos
          // Se há lista, deleta apenas os que não estão na lista
          const shouldKeep = keepFiles && keepFiles.includes(existingFile);
          
          if (!shouldKeep) {
            await this.deleteFile(normalizedPath, existingFile);
            this.logger.log(`Existing file ${existingFile} deleted before upload`);
          }
        }
      }

      const uploadedUrls: string[] = [];

      // Upload de cada arquivo
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = fileNames && fileNames[i] ? fileNames[i] : file.originalname.replace(/\s+/g, "_");
        const destination = normalizedPath ? `${normalizedPath}/${fileName}` : fileName;

        const blob = bucket.file(destination);
        const blobStream = blob.createWriteStream({
          resumable: false,
          contentType: file.mimetype,
        });

        // Upload do arquivo individual
        await new Promise<void>((resolve, reject) => {
          blobStream.on("error", (err) => {
            this.logger.error(`GCS Upload Error for ${fileName}: ${err.message}`, err.stack);
            reject(`Unable to upload file ${fileName}, please try again later.`);
          });

          blobStream.on("finish", async () => {
            this.logger.log(`File ${fileName} uploaded to ${bucketName}/${normalizedPath}`);

            // If the bucket is public, make the file publicly readable
            if (isPublic) {
              try {
                await blob.makePublic();
              } catch (e) {
                this.logger.error(
                  `Failed to make file public: ${e.message}`,
                  e.stack
                );
                // Even if it fails to be made public, we can still continue
              }
            }

            resolve();
          });

          blobStream.end(file.buffer);
        });

        // Gera a URL pública
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
        uploadedUrls.push(publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      this.logger.error(`Failed to upload multiple files: ${error.message}`, error.stack);
      throw new Error("Unable to upload files, please try again later.");
    }
  }

  async deleteFile(path: string = "", fileName: string): Promise<void> {
    if (!fileName) {
      throw new Error("File name is required for deletion.");
    }

    try {
      const normalizedPath = path.replace(/^\/+|\/+$/g, "");
      const isPublic = normalizedPath.startsWith("public/");
      const bucketName = isPublic
        ? this.publicBucketName
        : this.privateBucketName;
      const bucket = this.storage.bucket(bucketName);

      const destination = normalizedPath ? `${normalizedPath}/${fileName}` : fileName;
      const file = bucket.file(destination);

      await file.delete();
      this.logger.log(`File ${fileName} deleted from bucket ${bucketName}`);
    } catch (error) {
      if (error.code === 404) {
        this.logger.warn(`File not found for deletion: ${fileName} in path: ${path}`);
        return; // Arquivo não existe, não é um erro crítico
      }
      
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      throw new Error("Unable to delete file, please try again later.");
    }
  }

  async listFiles(path: string = ""): Promise<string[]> {
    try {
      const normalizedPath = path.replace(/^\/+|\/+$/g, "");
      const isPublic = normalizedPath.startsWith("public/");
      const bucketName = isPublic
        ? this.publicBucketName
        : this.privateBucketName;
      const bucket = this.storage.bucket(bucketName);

      const prefix = normalizedPath ? `${normalizedPath}/` : "";
      const [files] = await bucket.getFiles({ prefix });

      return files.map(file => {
        const fullName = file.name;
        return fullName.replace(prefix, "");
      }).filter(fileName => fileName.length > 0);
    } catch (error) {
      this.logger.error(`Failed to list files: ${error.message}`, error.stack);
      return [];
    }
  }
}
