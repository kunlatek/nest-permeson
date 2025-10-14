import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsEmail, IsDateString } from "class-validator";

export class Invitation {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do convidado',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: false,
    description: 'Se o convite foi aceito',
  })
  @IsBoolean()
  accepted: boolean;

  @ApiProperty({
    example: 'role123',
    description: 'ID da role associada ao convite',
    required: false,
  })
  @IsOptional()
  @IsString()
  roleId?: string;

  @ApiProperty({
    example: 'workspace123',
    description: 'ID do workspace',
    required: false,
  })
  @IsOptional()
  @IsString()
  workspaceId?: string;

  @ApiProperty({
    example: 'user123',
    description: 'ID do usuário que criou o convite',
    required: false,
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Data de criação',
  })
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Data de atualização',
  })
  @IsOptional()
  @IsDateString()
  updatedAt?: string;

  constructor(data: Partial<Invitation>) {
    Object.assign(this, data);
  }
}

