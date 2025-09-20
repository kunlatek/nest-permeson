import { Module } from "@nestjs/common";
import { CleanupController } from "./cleanup.controller";
import { CleanupService } from "./cleanup.service";
import { UserService } from "../user/user.service";

@Module({
  imports: [],
  controllers: [CleanupController],
  providers: [CleanupService, UserService],
  exports: [CleanupService],
})
export class CleanupModule {}
