import { Module } from "@nestjs/common";
import { CleanupController } from "./cleanup.controller";
import { CleanupService } from "./cleanup.service";
import { UserService } from "../user/user.service";
import { PersonProfileService } from "../profile/person/person-profile.service";
import { CompanyProfileService } from "../profile/company/company-profile.service";

@Module({
  imports: [],
  controllers: [CleanupController],
  providers: [CleanupService, UserService, PersonProfileService, CompanyProfileService],
  exports: [CleanupService],
})
export class CleanupModule {}
