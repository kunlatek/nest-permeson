import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email, must be valid.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'p4s$W0rd!',
    description: 'User password, min length = 6 characters.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}