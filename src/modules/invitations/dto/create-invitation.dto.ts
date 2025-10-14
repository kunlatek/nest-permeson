import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, IsOptional } from "class-validator";

export class CreateInvitationDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do convidado',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'role123',
    description: 'ID da role associada ao convite',
  })
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @ApiPropertyOptional({
    example: 'workspace123',
    description: 'ID do workspace (preenchido automaticamente pelo sistema)',
  })
  @IsOptional()
  @IsString()
  workspaceId?: string;

  @ApiPropertyOptional({
    example: 'user123',
    description: 'ID do usuário criador (preenchido automaticamente pelo sistema)',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class CreateAdminInvitationDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do convidado',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'pass_code',
    description: 'Código de senha para acesso ao workspace',
  })
  @IsNotEmpty()
  @IsString()
  passCode: string;
}

