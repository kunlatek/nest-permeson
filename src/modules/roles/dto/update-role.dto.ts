import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Permission } from "../models";

export class UpdateRoleDto {
  @ApiPropertyOptional({
    example: 'Admin',
    description: 'Role name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
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
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Permission)
  permissions?: Permission[];
}

