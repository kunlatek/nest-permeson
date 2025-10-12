import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../models";

export class RoleResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Role ID',
  })
  id: string;

  @ApiProperty({
    type: Role,
    description: 'Role data',
  })
  role: Role;

  constructor(id: string, role: Role) {
    this.id = id;
    this.role = role;
  }
}

