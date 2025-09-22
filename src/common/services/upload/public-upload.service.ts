import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { promises as fs } from "fs";
import { join } from "path";
import { UploadServiceInterface } from "./upload-service.interface";

@Injectable()
export class UploadService implements UploadServiceInterface {
  private readonly logger = new Logger(UploadService.name);
  private readonly publicPath: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.publicPath = join(process.cwd(), "public");
    this.baseUrl = this.configService.get<string>("API_BASE_URL") || "http://localhost:3000";
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
      const fullPath = normalizedPath ? join(this.publicPath, normalizedPath) : this.publicPath;

      // Cria o diretório se não existir
      await this.ensureDirectoryExists(fullPath);

      // Lista arquivos existentes na pasta
      const existingFiles = await this.listFiles(path);
      
      // Deleta apenas os arquivos que não estão na lista de arquivos para manter
      if (existingFiles.length > 0) {
        for (const existingFile of existingFiles) {
          // Se não há lista de arquivos para manter, deleta todos
          // Se há lista, deleta apenas os que não estão na lista
          const shouldKeep = keepFiles && keepFiles.includes(existingFile);
          
          if (!shouldKeep) {
            await this.deleteFile(path, existingFile);
            this.logger.log(`Existing file ${existingFile} deleted before upload`);
          }
        }
      }

      const uploadedUrls: string[] = [];

      // Upload de cada arquivo
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = fileNames && fileNames[i] ? fileNames[i] : file.originalname;
        const filePath = join(fullPath, fileName);

        // Salva o arquivo
        await fs.writeFile(filePath, file.buffer);

        this.logger.log(`File ${fileName} uploaded to ${fullPath}`);

        // Gera a URL pública
        const publicPath = normalizedPath ? `${normalizedPath}/${fileName}` : fileName;
        const fileUrl = `${this.baseUrl}/public/uploads/${publicPath}`;
        uploadedUrls.push(fileUrl);
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
      // Normaliza o path
      const normalizedPath = path.replace(/^\/+|\/+$/g, "");
      const fullPath = normalizedPath 
        ? join(this.publicPath, normalizedPath, fileName)
        : join(this.publicPath, fileName);

      // Verifica se o arquivo existe
      await fs.access(fullPath);

      // Deleta o arquivo
      await fs.unlink(fullPath);

      this.logger.log(`File ${fileName} deleted from ${fullPath}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        this.logger.warn(`File not found for deletion: ${fileName} in path: ${path}`);
        return; // Arquivo não existe, não é um erro crítico
      }
      
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      throw new Error("Unable to delete file, please try again later.");
    }
  }

  async fileExists(path: string = "", fileName: string): Promise<boolean> {
    try {
      const normalizedPath = path.replace(/^\/+|\/+$/g, "");
      const fullPath = normalizedPath 
        ? join(this.publicPath, normalizedPath, fileName)
        : join(this.publicPath, fileName);

      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async listFiles(path: string = ""): Promise<string[]> {
    try {
      const normalizedPath = path.replace(/^\/+|\/+$/g, "");
      const fullPath = normalizedPath ? join(this.publicPath, normalizedPath) : this.publicPath;

      // Verifica se o caminho existe e é um diretório
      const stats = await fs.stat(fullPath).catch(() => null);
      if (!stats || !stats.isDirectory()) {
        return [];
      }

      const files = await fs.readdir(fullPath);
      return files.filter(file => {
        return !file.startsWith('.');
      });
    } catch (error) {
      this.logger.error(`Failed to list files: ${error.message}`, error.stack);
      return [];
    }
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }
}
