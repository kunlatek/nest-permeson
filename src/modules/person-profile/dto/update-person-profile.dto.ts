import { PartialType } from "@nestjs/swagger";
import { CreatePersonProfileDto } from "./create-person-profile.dto";

export class UpdatePersonProfileDto extends PartialType(CreatePersonProfileDto) {}