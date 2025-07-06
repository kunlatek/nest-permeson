import { PartialType } from "@nestjs/swagger";
import { CompanyProfile } from "../models/company-profile.model";

export class UpdateCompanyProfileDto extends PartialType(CompanyProfile) {}