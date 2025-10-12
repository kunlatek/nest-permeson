import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsArray, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export enum Action {
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export class Permission {
  @ApiProperty({
    example: 'posts',
    description: 'Module name',
  })
  @IsNotEmpty()
  @IsString()
  module: string;

  @ApiProperty({
    type: [String],
    example: ['findAll', 'findOne', 'create', 'update', 'delete'],
    description: 'List of allowed actions',
    enum: Action,
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(Action, { each: true })
  actionList: Action[];
}

export class Role {
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
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Permission)
  permissions: Permission[];

  @ApiProperty({
    example: 'workspace123',
    description: 'Workspace ID',
  })
  @IsNotEmpty()
  @IsString()
  workspace: string;

  @ApiProperty({
    example: 'user123',
    description: 'ID of the user who created the role',
  })
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Creation date',
  })
  @IsOptional()
  createdAt?: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Update date',
  })
  @IsOptional()
  updatedAt?: string;

  constructor(data: Partial<Role>) {
    Object.assign(this, data);
  }
}

