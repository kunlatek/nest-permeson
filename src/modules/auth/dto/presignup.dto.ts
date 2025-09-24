import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PreSignupDto {
  @ApiProperty({
    description: "User email for pre-signup",
    example: "user@example.com",
  })
  @IsEmail()
  @IsString()
  email: string;
}
