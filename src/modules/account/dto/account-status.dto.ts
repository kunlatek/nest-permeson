import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class AccountStatusDto {
  @ApiProperty({ description: 'If the account exists' })
  @IsBoolean()
  exists: boolean;

  @ApiProperty({ description: 'If the account is verified' })
  @IsBoolean()
  verified: boolean;

  constructor(data: Partial<AccountStatusDto>) {
    this.exists = data?.exists ?? false;
    this.verified = data?.verified ?? false;
  }
}