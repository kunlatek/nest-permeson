import { IsString, IsNotEmpty, MinLength, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordRequestDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The token received by email to reset the password',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2MTYxODk2NjZ9.sR0bAUn2k4Z3yRiley9j8_H2b...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'The new password for the user (minimum 8 characters)',
    example: 'newStr0ngP@ss!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
