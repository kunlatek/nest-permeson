import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyAccountSendMailDto {
  @ApiProperty({ description: 'Email to verify' })
  @IsNotEmpty()
  @IsString()
  email: string;
}