import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class UpdateWorkspaceTeamDto {
  @ApiProperty({
    example: '123456',
    description: 'ID do usuário a ser adicionado ao time',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '123456',
    description: 'ID do workspace',
  })
  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({
    example: '123456',
    description: 'ID do criado por',
  })
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do role a ser atribuído ao usuário (opcional)',
  })
  @IsString()
  @IsOptional()
  roleId?: string;
}