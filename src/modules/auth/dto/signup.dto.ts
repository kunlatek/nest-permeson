import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
  @ApiProperty({
    description: "User email",
    example: "user@example.com",
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: "User password (minimum 6 characters)",
    example: "password123",
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: "Registration token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @IsString()
  registerToken: string;
}
