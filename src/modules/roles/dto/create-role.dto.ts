import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsArray, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { Permission } from "../models";

export class CreateRoleDto {
  @ApiProperty({
    example: 'Admin',
    description: 'Role name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: [Permission],
    description: 'List of permissions for each module',
    example: [
      {
        module: 'posts',
        actionList: ['findAll', 'findOne', 'create', 'update', 'delete']
      },
      {
        module: 'users',
        actionList: ['findAll', 'findOne']
      }
    ]
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Permission)
  permissions: Permission[];

  @ApiPropertyOptional({
    example: 'user123',
    description: 'ID of the user creator (automatically filled by the system)',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({
    example: 'workspace123',
    description: 'Workspace ID (automatically filled by the system)',
  })
  @IsOptional()
  @IsString()
  workspaceId?: string;
}

