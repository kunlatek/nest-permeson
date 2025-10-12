import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddAclDto {
  @ApiProperty({
    example: '123456',
    description: 'ID do usuário',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do role (referência ao módulo de Roles)',
  })
  @IsString()
  @IsNotEmpty()
  roleId: string;
}

