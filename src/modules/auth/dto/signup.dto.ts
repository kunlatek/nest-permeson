import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";
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
    description: "JWT token received from pre-signup email",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
