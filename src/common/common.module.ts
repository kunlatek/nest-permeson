import { Module } from "@nestjs/common";
import { ErrorService } from "./services/error.service";
import { CascadeService } from "./services/cascade.service";
import { DiscordLoggerService } from "./services/discord-logger.service";
import { getUploadService } from "src/utils/upload.utils";
import { STORAGE } from "./constants/storage.constant";

@Module({
  providers: [
    ErrorService,
    CascadeService,
    DiscordLoggerService,
    getUploadService(STORAGE),
  ],
  exports: [
    ErrorService, 
    CascadeService, 
    DiscordLoggerService, 
    getUploadService(STORAGE),
  ],
})
export class CommonModule {}
