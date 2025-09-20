import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../models';

export class CreateUserDto extends User {}

export class CreateUserByInvitationDto extends User {
  @ApiProperty({
    example: '1234567890',
    description: 'Invitation token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}